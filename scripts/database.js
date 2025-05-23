import sqlite3 from 'sqlite3';

const dbInstance = null;

async function initDB() {
    if (dbInstance) return dbInstance;

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
                VALUES (0, 'ptso-twitch', 'Personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;', '#666666');
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

async function insertStreamer({ twitchId, streamerName, streamerDetails, streamerColor }) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT OR REPLACE INTO streamers (twitchID, streamerName, streamerDetails, streamerColor)
             VALUES (?, ?, ?, ?)`,
            [twitchId, streamerName, streamerDetails, streamerColor],
            function (err) {
                if (err) {
                    console.error('DB insert failed:', err);
                    return res.status(500).json({ error: 'Database insert failed' });
                }
                // return res.json({ success: true });
                resolve({ success: true });
            }
        );
    });
}

async function getAllStreamers() {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM streamers`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export { initDB, insertStreamer, getAllStreamers };
