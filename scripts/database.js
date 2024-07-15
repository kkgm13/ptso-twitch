import sqlite3 from 'sqlite3';

async function initDB() {
    try {
        const db = await connectDatabase();
        console.log('Connected to Database');
        return db;
    } catch (error) {
        if (error.code === 'SQLITE_CANTOPEN') {
            console.warn("No Database Found!")
            console.warn("Creating Streamer DB")
            const newdb = await createDatabase();
            return newdb;
        } else {
            console.log('DB Error: ' + error);
            throw error;
        }
    }
}

function connectDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./streamers.db', sqlite3.OPEN_READWRITE, (error) => {
            if (error) {
                console.warn("CANNOT CONNECT TO DB! ".error)
                reject(error);
            } else {
                resolve(db);
                console.log("Database Found!")
            }
        });
    });
}

async function createDatabase() {
    const newdb = await new Promise((resolve, reject) => {
        const db = new sqlite3.Database('streamers.db', (error) => {
            if (error) {
                console.warn("CANNOT CREATE DB! ".error)
                reject(error);
            } else {
                resolve(db);
            }
        });
    });
    await createTables(newdb);
    return newdb;
}

function createTables(newdb) {
    return new Promise((resolve, reject) => {
        newdb.exec(`
            CREATE TABLE streamers (
                twitchID INT primary key NOT NULL,
                streamerName TEXT NOT NULL,
                streamerDetails TEXT NOT NULL,
                streamerColor TEXT NOT NULL
            );

            INSERT INTO streamers (twitchID, streamerName, streamerDetails, streamerColor)
                VALUES (0, 'ptso-twitch', 'personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;', '#666666');
        `, (error) => {
            if (error) {
                console.warn("CANNOT CREATE DB TABLE! ".error)
                reject(error);
            } else {
                console.log('Streamer Database Created!');
                console.log('Database Connected!');
                resolve();
            }
        });
    });
}

export { initDB };
