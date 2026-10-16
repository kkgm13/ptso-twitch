import { fetchJson } from './http-client.js';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';

function getHeaders() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = process.env.TWITCH_ACCESS_TOKEN;

    if (!clientId || !accessToken) {
        const error = new Error('TWITCH_CLIENT_ID or TWITCH_ACCESS_TOKEN is missing');
        error.code = 'TWITCH_CONFIG_MISSING';
        throw error;
    }

    return {
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`
    };
}

/** Return the first Twitch user matching a login, or null if not found. */
export async function getTwitchUser(username) {
    const params = new URLSearchParams({ login: username });
    const payload = await fetchJson(`${TWITCH_API_BASE}/users?${params}`, {
        headers: getHeaders()
    });

    return payload.data?.[0] ?? null;
}

/** Return channel information for a broadcaster, or null if not found. */
export async function getTwitchChannel(twitchId) {
    const params = new URLSearchParams({ broadcaster_id: twitchId });
    const payload = await fetchJson(`${TWITCH_API_BASE}/channels?${params}`, {
        headers: getHeaders()
    });

    return payload.data?.[0] ?? null;
}

/** Exchange a Twitch app's client credentials for an app access token. */
export async function requestAppAccessToken(clientId, clientSecret) {
    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    });

    return fetchJson('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
}

/** Look up a Twitch user using the supplied app credentials and fresh token. */
export async function getTwitchUserWithToken(username, clientId, accessToken) {
    const params = new URLSearchParams({ login: username });
    const payload = await fetchJson(`${TWITCH_API_BASE}/users?${params}`, {
        headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${accessToken}`
        }
    });

    return payload.data?.[0] ?? null;
}
