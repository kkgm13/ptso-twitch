import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import open from 'open'
import path from 'path'
import { initDB, insertStreamer, getAllStreamers } from './scripts/database.js'
import dotenv from 'dotenv'

// Load in dotenv
dotenv.config();

// Start System
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
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.json());

app.get('/api/streamers', async (req, res) => {
    try {
        const streamers = await getAllStreamers();
        return res.json({ streamers });
    } catch (err) {
        console.error('Failed to fetch streamers:', err.message);
        return res.status(500).json({ error: 'Failed to fetch streamers' });
    }
});

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

        return res.json({ twitchId: data.data[0].id });
    } catch (err) {
        console.error('Twitch fetch failed:', err);
        return res.status(500).json({ error: 'Failed to fetch Twitch user.' });
    }
});

app.post('/api/streamers', async (req, res) => {
    const { twitchId, streamerName, streamerDetails, streamerColor } = req.body;

    if (!twitchId || !streamerName || !streamerDetails || !streamerColor) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await insertStreamer({ twitchId, streamerName, streamerDetails, streamerColor });
        return res.json({ success: true });
    } catch (err) {
        console.error('DB insert failed:', err.message);
        return res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/streamers', async (req, res) => {
    const { twitchId, streamerName, streamerDetails, streamerColor } = req.body;

    if (!twitchId || !streamerName || !streamerDetails || !streamerColor) {
        return res.status(400).json({ error: 'Missing fields for update' });
    }

    try {
        const db = await initDB();
        
        const stmt = db.prepare(`
            UPDATE streamers
            SET streamerName = ?, streamerDetails = ?, streamerColor = ?
            WHERE twitchID = ?
        `);

        stmt.run(streamerName, streamerDetails, streamerColor, twitchId, function (err) {
            if (err) {
                console.error('Update Error:', err);
                return res.status(500).json({ error: 'Update failed' });
            }
            res.json({ success: true });
        });

        stmt.finalize();
    } catch (err) {
        res.status(500).json({ error: 'Database error' });

    }
});

app.delete('/api/streamer/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        const db = await initDB();
        db.run(`DELETE FROM streamers WHERE twitchID = ?`, [id], function (err) {
            if (err) {
                console.error('DB Delete Error:', err);
                return res.status(500).json({ error: 'Failed to delete streamer' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Streamer not found' });
            }

            return res.status(200).json({ message: 'Streamer deleted' });
        });
    } catch (err) {
        console.error('Server Delete Error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});


const __dirname = import.meta.dirname;
// Redirect to Admin!
app.use('/admin', express.static(path.join(__dirname, '/public/admin')));
// Allow the SO.html to be recognized by the system
app.use('/so.html', express.static(path.join(__dirname, '/public/so.html')));

// let browserOpened = false;
async function startServer() {
    try {
        await initDB();
        console.log("----------------------------")
        app.listen(3030, () => {
            // console.log(browserOpened)
            // if(browserOpened === false){
                console.log('Opening PTSO Admin');
                open('http://localhost:3030/admin');
                // browserOpened = true;
            // }
        });
    } catch (error) {
        console.error('Failed to initialize database: ', error);
        process.exit(1);
    }
}

startServer();