import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import {
    requestAppAccessToken,
    getTwitchUserWithToken
} from '../src/services/twitch-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvPath = path.resolve(__dirname, '../.env');

function serializeEnvValue(value) {
    return JSON.stringify(String(value));
}

/** 
 * Update only requested keys while preserving unrelated .env lines.
 */
async function updateEnvFile(updates) {
    let content;

    try {
        content = await fs.readFile(dotenvPath, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        content = '';
    }

    const lines = content ? content.split(/\r?\n/) : [];

    for (const [key, value] of Object.entries(updates)) {
        const replacement = `${key}=${serializeEnvValue(value)}`;
        const keyPattern = new RegExp(`^\\s*${key}\\s*=`);
        const matchingIndexes = [];

        lines.forEach((line, index) => {
            if (keyPattern.test(line)) matchingIndexes.push(index);
        });

        if (matchingIndexes.length === 0) {
            lines.push(replacement);
        } else {
            lines[matchingIndexes[0]] = replacement;
            // Remove duplicate definitions for this key, if present.
            for (const index of matchingIndexes.slice(1).reverse()) {
                lines.splice(index, 1);
            }
        }
    }

    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    const updatedContent = `${lines.join('\n')}\n`;
    const temporaryPath = `${dotenvPath}.tmp`;

    await fs.writeFile(temporaryPath, updatedContent, { mode: 0o600 });
    await fs.rename(temporaryPath, dotenvPath);
}

/**
 * 
 * @param {*} rl 
 * @param {*} label 
 * @param {*} param2 
 * @returns 
 */
async function promptRequired(rl, label, { secret = false } = {}) {
    const value = (await rl.question(label)).trim();

    if (!value) throw new Error(`${label.replace(/\s*>\s*$/, '')} is required`);
    if (secret) console.log('');
    return value;
}

async function main() {
    const rl = createInterface({ input, output });

    try {
        console.log('PTSO Twitch setup');
        console.log('Create a Twitch application in the Twitch Developer Console first.');
        console.log('The client secret and access token will not be printed.');
        console.log('');

        const twitchUser = await promptRequired(rl, 'Your Twitch username > ');
        const clientId = await promptRequired(rl, 'Twitch Client ID > ');
        const clientSecret = await promptRequired(rl, 'Twitch Client Secret (input may be visible) > ', {
            secret: true
        });

        const tokenResponse = await requestAppAccessToken(clientId, clientSecret);
        if (!tokenResponse.access_token) {
            throw new Error('Twitch did not return an access token');
        }

        const user = await getTwitchUserWithToken(
            twitchUser,
            clientId,
            tokenResponse.access_token
        );

        if (!user) {
            throw new Error(`Twitch user "${twitchUser}" was not found. No credentials were saved.`);
        }

        await updateEnvFile({
            TWITCH_USER: twitchUser,
            TWITCH_STREAMER_ID: user.id,
            TWITCH_CLIENT_ID: clientId,
            TWITCH_CLIENT_SECRET: clientSecret,
            TWITCH_ACCESS_TOKEN: tokenResponse.access_token
        });

        console.log('');
        console.log('Twitch setup completed successfully.');
        console.log(`Twitch user: ${user.login} (ID: ${user.id})`);
        console.log(`Updated environment file: ${dotenvPath}`);
        console.log('Keep .env private. Rerun npm run twitch-setup to renew the app token.');
    } catch (error) {
        console.error('Twitch setup failed:', error.status
            ? `${error.message} (HTTP ${error.status})`
            : error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
    }
}

main();
