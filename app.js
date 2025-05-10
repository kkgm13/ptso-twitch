import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import open from 'open'
import path from 'path'
import { initDB } from './scripts/database.js'
import twitchRouter from './scripts/twitch.js'
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

// Redirect to Admin!
const __dirname = import.meta.dirname;
app.use('/admin', express.static(path.join(__dirname, '/public/admin')));
// app.use(function(req,res){
    // res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// });
// app.use('/api/twitch', twitchRouter);


let browserOpened = false;

async function startServer() {
    try {
        await initDB();
        console.log("----------------------------")
        app.listen(3030, () => {
            console.log('Opening PTSO on localhost');
            open('http://localhost:3030/admin');
            browserOpened = true;
        });
    } catch (error) {
        console.error('Failed to initialize database: ', error);
        process.exit(1);
    }
}

startServer();