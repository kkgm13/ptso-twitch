import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/user', async (req, res) => {
  const username = req.query.login;

  if (!username) {
    return res.status(400).json({ error: 'Missing login parameter' });
  }

  try {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'Streamer not found' });
    }

    return res.json(data.data[0]); // Send user data (e.g., id, display_name)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
