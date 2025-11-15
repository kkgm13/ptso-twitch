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
app.get('/api/streamer', async (req, res) =>{
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
            }
        });

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return res.status(404).json({ error: 'Twitch User Not Found' });
        }

        return res.json({ twitchId: data.data[0].id, "profile-image": data.data[0].profile_image_url });
    } catch (err) {
        console.error('Twitch fetch failed:', err);
        return res.status(500).json({ error: 'Failed to fetch Twitch user.' });
    }
});
// Get the last stremer's Streamed Game
app.get('/api/streamer-last-game', async (req,res) => {
    const twitchId = req.query.twitchId;
    if (!twitchId) return res.status(400).json({ error: 'Twitch ID is required' });
    try {
        const response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${twitchId}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
            }
        });
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return res.status(404).json({ error: 'Twitch User Information Not Found' });
        }

        return res.json({ twitchId: data.data[0].broadcaster_id, broadcaster_login: data.data[0].broadcaster_login, game_id: data.data[0].game_id, "last-played":data.data[0].game_name });
    } catch (error) {
        console.log("Error: " +error);
        return res.status(500).json({ error: 'Failed to fetch Twitch Channel Info.' });
    }
});
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
app.delete('/api/streamer/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await deleteStreamer(id);
        return res.json({ success: true , message: 'Streamer Deleted'});
    } catch (err) {
        console.error('Server Delete Error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

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