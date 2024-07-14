import fs from 'fs'
import sqlite3 from 'sqlite3'

// File Name
const dbFile = 'streamers.db';
// 
const dbExists = fs.existsSync(dbFile);

const setupDatabase = () => {
    const db = new sqlite3.Database(dbFile);
    db.serialize(() => {
        db.run(`
            CREATE TABLE streamers (
                twitchID INT primary key NOT NULL,
                streamerName TEXT NOT NULL,
                streamerDetails TEXT NOT NULL,
                streamerColor TEXT NOT NULL
            );
        `);
        db.run(`
            INSERT INTO streamers (twitchID, streamerName, streamerDetails, streamerColor)
            VALUES (0, 'ptso-twitch', 'personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;', '#666666');
        `);
    });
    db.close();
};

const checkAndSetupDatabase = () => {
  if (!dbExists) {
    setupDatabase();
  } else {
    console.log("Database is Found!")
  }
};

module.exports = checkAndSetupDatabase;
