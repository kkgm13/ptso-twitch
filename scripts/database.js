import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the database relative to the project root.
const DATABASE_PATH = path.resolve(__dirname, '../streamers.db');

let dbInstance = null;

/**
 * Initialise the database and return the shared connection.
 *
 * better-sqlite3 creates the database file if it does not exist.
 * Existing databases and their streamer records are preserved.
 *
 * @returns {Database.Database}
 */
function initDB() {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        const db = new Database(DATABASE_PATH);

        // Apply sensible connection settings.
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = WAL');

        createTables(db);

        dbInstance = db;

        console.log('Database connected:', DATABASE_PATH);

        return dbInstance;
    } catch (error) {
        console.error('Failed to initialise database:', error);
        throw error;
    }
}

/**
 * Create the required tables if they do not already exist.
 *
 * Existing streamer records are not overwritten.
 *
 * @param {Database.Database} db
 */
function createTables(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS streamers (
            twitchID INTEGER PRIMARY KEY NOT NULL,
            streamerName TEXT NOT NULL,
            streamerDetails TEXT NOT NULL,
            streamerColor TEXT NOT NULL
        );
    `);

    // Add the example record only when the table is empty.
    const result = db
        .prepare('SELECT COUNT(*) AS count FROM streamers')
        .get();

    if (result.count === 0) {
        db.prepare(`
            INSERT INTO streamers (
                twitchID,
                streamerName,
                streamerDetails,
                streamerColor
            )
            VALUES (?, ?, ?, ?)
        `).run(
            0,
            'ptso-twitch',
            'Personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;',
            '#666666'
        );

        console.log('Default streamer record created.');
    }
}

/**
 * Insert or replace a streamer.
 *
 * @param {object} streamer
 * @param {string|number} streamer.twitchId
 * @param {string} streamer.streamerName
 * @param {string} streamer.streamerDetails
 * @param {string} streamer.streamerColor
 * @returns {{ success: boolean }}
 */
function insertStreamer({
    twitchId,
    streamerName,
    streamerDetails,
    streamerColor
}) {
    const db = initDB();

    const statement = db.prepare(`
        INSERT OR REPLACE INTO streamers (
            twitchID,
            streamerName,
            streamerDetails,
            streamerColor
        )
        VALUES (?, ?, ?, ?)
    `);

    statement.run(
        twitchId,
        streamerName,
        streamerDetails,
        streamerColor
    );

    return { success: true };
}

/**
 * Return all streamers ordered by Twitch ID.
 *
 * @returns {Array<object>}
 */
function getAllStreamers() {
    const db = initDB();

    return db.prepare(`
        SELECT *
        FROM streamers
        ORDER BY twitchID
    `).all();
}

/**
 * Delete a streamer by Twitch ID.
 *
 * @param {string|number} twitchId
 * @returns {{ success: boolean }}
 * @throws {Error} If the streamer does not exist.
 */
function deleteStreamer(twitchId) {
    const db = initDB();

    const result = db.prepare(`
        DELETE FROM streamers
        WHERE twitchID = ?
    `).run(twitchId);

    if (result.changes === 0) {
        const error = new Error('Streamer not found');
        error.code = 'STREAMER_NOT_FOUND';
        throw error;
    }

    return { success: true };
}

export {
    initDB,
    insertStreamer,
    getAllStreamers,
    deleteStreamer
};
