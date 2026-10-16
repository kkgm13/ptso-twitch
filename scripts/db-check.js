import 'dotenv/config';
import { initDB, closeDB, DATABASE_PATH } from './database.js';

function checkDatabase() {
    try {
        const db = initDB();
        const result = db.prepare('SELECT COUNT(*) AS count FROM streamers').get();

        console.log('Database check passed.');
        console.log(`Database file: ${DATABASE_PATH}`);
        console.log(`Streamer records: ${result.count}`);
    } catch (error) {
        console.error('Database check failed:', error.message);
        process.exitCode = 1;
    } finally {
        closeDB();
    }
}

checkDatabase();
