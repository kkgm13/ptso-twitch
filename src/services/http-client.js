/**
 * Fetch JSON from an HTTP endpoint and throw an informative error for non-2xx
 * responses. Requires a modern Node.js release with built-in fetch and AbortSignal.timeout.
 *
 * @param {string | URL} url
 * @param {RequestInit} options
 * @returns {Promise<unknown>}
 */
export async function fetchJson(url, options = {}) {
    const { signal, ...requestOptions } = options;

    const response = await fetch(url, {
        ...requestOptions,
        signal: signal ?? AbortSignal.timeout(10_000)
    });

    const contentType = response.headers.get('content-type') ?? '';
    let payload;

    if (response.status === 204) {
        payload = null;
    } else if (contentType.includes('application/json')) {
        try {
            payload = await response.json();
        } catch {
            const error = new Error('The server returned invalid JSON');
            error.status = response.status;
            throw error;
        }
    } else {
        payload = await response.text();
    }

    if (!response.ok) {
        const message =
            typeof payload === 'object' && payload !== null && 'message' in payload
                ? payload.message
                : typeof payload === 'string' && payload.trim()
                    ? payload
                    : `HTTP ${response.status}`;

        const error = new Error(message);
        error.status = response.status;
        error.responseBody = payload;
        throw error;
    }

    return payload;
}
