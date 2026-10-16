import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const configuredDatabasePath = process.env.PTSO_DATABASE_PATH;
const DATABASE_PATH = configuredDatabasePath
    ? path.resolve(projectRoot, configuredDatabasePath)
    : path.join(projectRoot, 'streamers.db');

let dbInstance = null;

/** Open the shared SQLite connection and ensure the schema exists. */
function initDB() {
    if (dbInstance) return dbInstance;

    const db = new Database(DATABASE_PATH);

    try {
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = WAL');
        createTables(db);
        dbInstance = db;

        console.log(`Connected to SQLite database: ${DATABASE_PATH}`);
        return dbInstance;
    } catch (error) {
        db.close();
        throw error;
    }
}

function createTables(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS streamers (
            twitchID INTEGER PRIMARY KEY NOT NULL,
            streamerName TEXT NOT NULL,
            streamerDetails TEXT NOT NULL,
            streamerColor TEXT NOT NULL
        );
    `);

    const row = db.prepare('SELECT COUNT(*) AS count FROM streamers').get();

    // Preserve existing records. Seed only a genuinely empty table.
    if (row.count === 0) {
        db.prepare(`
            INSERT INTO streamers (
                twitchID, streamerName, streamerDetails, streamerColor
            ) VALUES (?, ?, ?, ?)
        `).run(
            0,
            'ptso-twitch',
            'Personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;',
            '#666666'
        );
    }
}

function insertStreamer({ twitchId, streamerName, streamerDetails, streamerColor }) {
    const db = initDB();

    return db.prepare(`
        INSERT INTO streamers (
            twitchID, streamerName, streamerDetails, streamerColor
        ) VALUES (?, ?, ?, ?)
        ON CONFLICT(twitchID) DO UPDATE SET
            streamerName = excluded.streamerName,
            streamerDetails = excluded.streamerDetails,
            streamerColor = excluded.streamerColor
    `).run(twitchId, streamerName, streamerDetails, streamerColor);
}

function getAllStreamers() {
    return initDB().prepare(`
        SELECT twitchID, streamerName, streamerDetails, streamerColor
        FROM streamers
        ORDER BY twitchID
    `).all();
}

function deleteStreamer(twitchId) {
    const result = initDB().prepare(
        'DELETE FROM streamers WHERE twitchID = ?'
    ).run(twitchId);

    if (result.changes === 0) {
        const error = new Error('Streamer not found');
        error.code = 'STREAMER_NOT_FOUND';
        throw error;
    }

    return { success: true };
}

function closeDB() {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}

export {
    initDB,
    closeDB,
    insertStreamer,
    getAllStreamers,
    deleteStreamer,
    DATABASE_PATH
};
