import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    initDB,
    closeDB,
    insertStreamer,
    getStreamerByTwitchId,
    getAllStreamers,
    deleteStreamer
} from './scripts/database.js';
import { getTwitchUser, getTwitchChannel } from './src/services/twitch-api.js';

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '3030', 10);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Each connected browser source receives live shoutout events over Server-Sent Events.
const overlayClients = new Set();

function publishShoutout(payload) {
    const message = `data: ${JSON.stringify(payload)}\\n\\n`;
    for (const client of overlayClients) {
        client.write(message);
    }
}

const allowedOrigins = new Set([
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`
]);

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header include same-machine tools such as curl.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100kb' }));

// Provide Twitch Errors 
function sendTwitchError(res, error, operation) {
    console.error(`${operation} failed:`, {
        status: error.status ?? 'NETWORK_OR_PARSE_ERROR',
        message: error.message
    });

    if (error.code === 'TWITCH_CONFIG_MISSING') {
        return res.status(500).json({
            error: 'Twitch API credentials are not configured'
        });
    }

    return res.status(502).json({
        error: `${operation} failed`,
        details: error.status === 401
            ? 'Twitch authentication failed. Run npm run twitch-setup to refresh credentials.'
            : error.status === 403
                ? 'Twitch denied the request. Check the Twitch application credentials.'
                : 'Check the server logs for the Twitch API response.'
    });
}

// Return all streamer records.
app.get('/api/streamers', (req, res) => {
    try {
        return res.json({ streamers: getAllStreamers() });
    } catch (error) {
        console.error('Failed to fetch streamers:', error);
        return res.status(500).json({ error: 'Failed to fetch streamers' });
    }
});

// Look up a Twitch user by login name.
app.get('/api/streamer', async (req, res) => {
    const username = typeof req.query.username === 'string'
        ? req.query.username.trim()
        : '';

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const user = await getTwitchUser(username);

        if (!user) {
            return res.status(404).json({ error: 'Twitch User Not Found' });
        }

        return res.json({
            twitchId: user.id,
            'profile-image': user.profile_image_url
        });
    } catch (error) {
        return sendTwitchError(res, error, 'Twitch user lookup');
    }
});

// Return the channel's currently configured category/game.
app.get('/api/streamer-last-game', async (req, res) => {
    const twitchId = typeof req.query.twitchId === 'string'
        ? req.query.twitchId.trim()
        : '';

    if (!twitchId) {
        return res.status(400).json({ error: 'Twitch ID is required' });
    }

    try {
        const channel = await getTwitchChannel(twitchId);

        if (!channel) {
            return res.status(404).json({
                error: 'Twitch Channel Information Not Found'
            });
        }

        return res.json({
            twitchId: channel.broadcaster_id,
            broadcaster_login: channel.broadcaster_login,
            game_id: channel.game_id,
            'last-played': channel.game_name
        });
    } catch (error) {
        return sendTwitchError(res, error, 'Twitch channel lookup');
    }
});

// Insert a new streamer or update the existing record with the same Twitch ID.
app.post('/api/streamers', (req, res) => {
    const { twitchId, streamerName, streamerDetails, streamerColor } = req.body ?? {};

    if (
        twitchId === undefined || twitchId === null || String(twitchId).trim() === '' ||
        typeof streamerName !== 'string' || !streamerName.trim() ||
        typeof streamerDetails !== 'string' || !streamerDetails.trim() ||
        typeof streamerColor !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(streamerColor)
    ) {
        return res.status(400).json({
            error: 'Twitch ID, streamer name, details and a valid colour are required'
        });
    }

    try {
        insertStreamer({
            twitchId: String(twitchId).trim(),
            streamerName: streamerName.trim(),
            streamerDetails: streamerDetails.trim(),
            streamerColor
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Database insert/update failed:', error);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Delete a streamer by Twitch ID.
app.delete('/api/streamer/:id', (req, res) => {
    try {
        deleteStreamer(req.params.id);
        return res.json({ success: true, message: 'Streamer Deleted' });
    } catch (error) {
        if (error.code === 'STREAMER_NOT_FOUND') {
            return res.status(404).json({ error: 'Streamer not found' });
        }

        console.error('Streamer delete failed:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Browser-source connection: events are pushed only when a shoutout is triggered.
app.get('/api/shoutout/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    res.write(': PTSO overlay connected');
    overlayClients.add(res);

    const heartbeat = setInterval(() => res.write(': heartbeat'), 20_000);
    req.on('close', () => {
        clearInterval(heartbeat);
        overlayClients.delete(res);
    });
});

// Trigger this endpoint from the Twitch chat command handler.
// Example body: { "username": "target_login" }
app.post('/api/shoutout', async (req, res) => {
    const username = typeof req.body?.username === 'string'
        ? req.body.username.trim().replace(/^@/, '').toLowerCase()
        : '';

    if (!/^[a-z0-9_]{1,25}$/.test(username)) {
        return res.status(400).json({ error: 'A valid Twitch username is required' });
    }

    try {
        const user = await getTwitchUser(username);
        if (!user) {
            return res.status(404).json({ error: 'Twitch user not found' });
        }

        // The database is keyed by Twitch ID, so username changes do not break matching.
        const [savedStreamer, channel] = await Promise.all([
            Promise.resolve(getStreamerByTwitchId(user.id)),
            getTwitchChannel(user.id)
        ]);

        const descriptions = (savedStreamer?.streamerDetails ?? '')
            .split(';')
            .map((item) => item.trim())
            .filter(Boolean);

        const payload = {
            type: 'shoutout',
            twitchId: user.id,
            username: user.login,
            displayName: user.display_name || user.login,
            profileImage: user.profile_image_url || '/admin/assets/default.jpeg',
            streamerColor: savedStreamer?.streamerColor || '#666666',
            descriptions: descriptions.length
                ? descriptions
                : [`Check out ${user.display_name || user.login} and give them a follow!`],
            lastGame: channel?.game_name?.trim() || 'a variety of games',
            createdAt: Date.now()
        };

        publishShoutout(payload);
        return res.status(202).json({ success: true, queued: true, twitchId: user.id });
    } catch (error) {
        return sendTwitchError(res, error, 'Shoutout preparation');
    }
});

// Serve static files for the admin interface and the Overlay page.
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
// app.use('/', (req, res) => res.redirect('/admin'));
app.use("/so.html", express.static(path.join(__dirname,  'public/so')));
// Minature health check
app.use('/health', (req, res) => res.json(
    {
        version: "a3.0.0",
        status: res.statusCode === 200 ? 'Healthy' : res.statusCode , 
        message: req.statusMessage ?? "Operational", has_db: initDB() ? true : false, twitch_cred: process.env 
    }
));

async function startServer() {
    try {
        initDB();

        const server = app.listen(PORT, () => {
            console.log('----------------------------');
            console.log(`PTSO Admin available at http://localhost:${PORT}/admin`);
        });

        const shutdown = (signal) => {
            console.log(`${signal} received. Shutting down...`);
            server.close(() => {
                closeDB();
                process.exit(0);
            });
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        console.error('Failed to start PTSO:', error);
        closeDB();
        process.exitCode = 1;
    }
}

startServer();