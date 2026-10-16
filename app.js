import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import open from 'open'
import path from 'path'
import { initDB, insertStreamer, getAllStreamers, deleteStreamer} from './scripts/database.js'
import dotenv from 'dotenv'

// Load in dotenv
dotenv.config();

/*******************************
 * Start ExpressJS Environment *
 *******************************/
const app = express();

const allowedOrigins = ['http://localhost:3030'];
// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.json());

/***************
 * API CALLERS *
 ***************/
// Get all the Streamers on the Database
app.get('/api/streamers', async (req, res) => {
    try {
        const streamers = await getAllStreamers();
        return res.json({ streamers });
    } catch (err) {
        console.error('Failed to fetch streamers:', err.message);
        return res.status(500).json({ error: 'Failed to fetch streamers' });
    }
});
// Get the Streamer Information

app.get('/api/streamer', async (req, res) => {
    const username = req.query.username?.trim();

    if (!username) {
        return res.status(400).json({
            error: 'Username is required'
        });
    }

    try {
        const params = new URLSearchParams({
            login: username
        });

        const data = await twitchHelixFetch(
            `https://api.twitch.tv/helix/users?${params}`
        );

        if (!data.data?.length) {
            return res.status(404).json({
                error: 'Twitch User Not Found'
            });
        }

        const user = data.data[0];

        return res.json({
            twitchId: user.id,
            'profile-image': user.profile_image_url
        });
    } catch (error) {
        return handleTwitchError(res, error, 'Twitch user lookup');
    }
});

// app.get('/api/streamer', async (req, res) =>{
//     const username = req.query.username?.trim().toLowerCase();

//     if (!username) return res.status(400).json({ error: 'Username is required' });

//     if(!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_ACCESS_TOKEN) {
//         console.error('Twitch API credentials are missing');
//         return res.status(500).json({ error: 'Twitch API credentials are not set' });
//     }

//     try {
//         const params = new URLSearchParams({ login: username });
//         const response = await fetch(`https://api.twitch.tv/helix/users?${params}`, {
//             headers: {
//                 'Client-ID': process.env.TWITCH_CLIENT_ID,
//                 'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
//             }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             console.error('Twitch API Response error:', {status: response.status, message: data.message ?? "Unknown reason"});

//             switch (response.status) {
//                 case 401:
//                     return res.status(502).json({ easy_error: 'Credentials are needed to be updated', error_api: data.message ?? "Unknown reason" });
//                 case 502:
//                     return res.status(502).json({ easy_error: 'Twitch API is down', error_api: data.message ?? "Unknown reason" });
//             }

//             // return res.status(response.status).json({status: response.status, error: data.message ?? "Unknown reason"});
//         }

//         if (!data.data || data.data.length === 0) {
//             return res.status(404).json({ error: data.Error});
//         }

//         return res.json({ twitchId: data.data[0].id, "profile-image": data.data[0].profile_image_url });
//     } catch (err) {
//         console.error('Twitch fetch failed:', err);
//         return res.status(500).json({ error: 'Failed to fetch Twitch user.' });
//     }
// });

// Get the last stremer's Streamed Game

app.get('/api/streamer-last-game', async (req, res) => {
    const twitchId = req.query.twitchId?.trim();

    if (!twitchId) {
        return res.status(400).json({
            error: 'Twitch ID is required'
        });
    }

    try {
        const params = new URLSearchParams({
            broadcaster_id: twitchId
        });

        const data = await twitchHelixFetch(
            `https://api.twitch.tv/helix/channels?${params}`
        );

        if (!data.data?.length) {
            return res.status(404).json({
                error: 'Twitch Channel Information Not Found'
            });
        }

        const channel = data.data[0];

        return res.json({
            twitchId: channel.broadcaster_id,
            broadcaster_login: channel.broadcaster_login,
            game_id: channel.game_id,
            'last-played': channel.game_name
        });
    } catch (error) {
        return handleTwitchError(
            res,
            error,
            'Twitch channel information lookup'
        );
    }
});

// app.get('/api/streamer-last-game', async (req,res) => {
//     const twitchId = req.query.twitchId;
//     if (!twitchId) return res.status(400).json({ error: 'Twitch ID is required' });

//     try {
//         const params = new URLSearchParams({ broadcaster_id: twitchId });
//         const response = await fetch(`https://api.twitch.tv/helix/channels?${params}`, {
//             headers: {
//                 'Client-ID': process.env.TWITCH_CLIENT_ID,
//                 'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
//             }
//         });

//         const data = await response.json();

//         if (!data.data || data.data.length === 0) {
//             return res.status(404).json({ error: 'Twitch User Information Not Found' });
//         }

//         return res.json({ twitchId: data.data[0].broadcaster_id, broadcaster_login: data.data[0].broadcaster_login, game_id: data.data[0].game_id, "last-played":data.data[0].game_name });
//     } catch (error) {
//         console.log("Error: " +error);
//         return res.status(500).json({ error: 'Failed to fetch Twitch Channel Info.' });
//     }
// });

// Update the Streamer Information
app.post('/api/streamers', async (req, res) => {
    const { twitchId, streamerName, streamerDetails, streamerColor } = req.body;

    if (!twitchId || !streamerName || !streamerDetails || !streamerColor) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // if (!streamer.twitchId || !streamer.streamerName?.trim() || !streamer.streamerDetails?.trim() || !streamer.streamerColor?.trim()) {
    //     formError.value = 'All fields are required.';
    //     return;
    // }

    try {
        await insertStreamer({ twitchId, streamerName, streamerDetails, streamerColor });
        return res.json({ success: true });
    } catch (err) {
        console.error('DB insert failed:', err.message);
        return res.status(500).json({ error: 'Database error' });
    }
});
// Delete Streamer by ID
app.delete('/api/streamer/:id', (req, res) => {
    const id = req.params.id;

    try {
        deleteStreamer(id);

        return res.json({
            success: true,
            message: 'Streamer Deleted'
        });
    } catch (err) {
        if (err.code === 'STREAMER_NOT_FOUND') {
            return res.status(404).json({
                error: 'Streamer not found'
            });
        }

        console.error('Server Delete Error:', err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
});


async function twitchHelixFetch(url) {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = process.env.TWITCH_ACCESS_TOKEN;

    if (!clientId || !accessToken) {
        const error = new Error(
            'TWITCH_CLIENT_ID or TWITCH_ACCESS_TOKEN is missing'
        );
        error.status = 500;
        throw error;
    }

    const response = await fetch(url, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.message || `Twitch API returned HTTP ${response.status}`
        );

        error.status = response.status;
        throw error;
    }

    return data;
}

function handleTwitchError(res, error, operation) {
    console.error(`${operation} failed:`, {
        status: error.status || 'NETWORK_ERROR',
        message: error.message
    });

    if (error.status === 500) {
        return res.status(500).json({
            error: 'Twitch API credentials are missing'
        });
    }

    return res.status(502).json({
        error: 'Twitch API request failed',
        details: error.status === 401
            ? 'Twitch authentication failed. Renew the access token.'
            : error.status === 403
                ? 'Twitch denied the request. Check application credentials and permissions.'
                : 'Check the server logs for the Twitch API error.'
    });
}



/************************
 *   General Startup    *
 ************************/
const __dirname = import.meta.dirname;
// app.use('',express.static(path.join(__dirname,'/public/index.html')));
app.use('/admin', express.static(path.join(__dirname, '/public/admin')));
app.use('/so.html', express.static(path.join(__dirname, '/public/so.html')));

async function startServer() {
    try {
        await initDB();
        console.log("----------------------------")
        app.listen(3030, () => {
            console.log('Opening PTSO Admin');
            console.log('Opening to http://localhost:3030/admin')
            // open('http://localhost:3030/admin');
        });
    } catch (error) {
        console.error('Failed to Start System - ', error);
        process.exit(1);
    }
}

startServer();