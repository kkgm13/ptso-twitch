import { initDB } from './database.js';

async function checkAndInitializeDatabase() {
    try {
        await initDB();
        console.log('Database initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

checkAndInitializeDatabase();