const path = require('path');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL; // Kept as fallback

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set Cache-Control headers for all API routes — no browser caching so spreadsheet edits reflect immediately
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// In-memory cache for sheet data (survives API outages)
const sheetCache = {};
const CACHE_TTL = 5 * 1000; // 5 seconds — very short TTL so spreadsheet edits reflect fast
const CACHE_TTL_FAILURE = 60 * 1000; // 60 seconds — longer TTL when network is down to avoid retry storms

// Track network status to avoid spamming failed requests
let lastNetworkFailure = 0;
let networkFailureLogged = false;
const NETWORK_RETRY_INTERVAL = 30 * 1000; // Only retry network every 30s when it's down

// List of sheets that are optional and shouldn't log a warning if missing
const OPTIONAL_SHEETS = ['Menu', 'Gallery', 'fleet', 'settings', 'hero'];

// Helper: fetch data from Google Sheets API v4 with caching
async function fetchSheet(sheetName) {
    const cacheKey = sheetName;
    const cached = sheetCache[cacheKey];
    const now = Date.now();

    // Return cached data if still within TTL
    if (cached && cached.data && (now - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }

    // If network was recently down and we have cached data, return it immediately
    // This prevents slow page loads when there's no internet
    const networkIsDown = (now - lastNetworkFailure) < NETWORK_RETRY_INTERVAL;
    if (networkIsDown && cached && cached.data && cached.data.length > 0) {
        return cached.data;
    }

    // Try primary: Google Sheets API v4
    if (GOOGLE_SHEETS_ID && GOOGLE_API_KEY) {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${encodeURIComponent(sheetName)}?key=${GOOGLE_API_KEY}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                // Network recovered — reset failure tracking
                lastNetworkFailure = 0;
                networkFailureLogged = false;
                if (data.values && data.values.length > 1) {
                    const headers = data.values[0];
                    const result = data.values.slice(1).map(row => {
                        const obj = {};
                        headers.forEach((header, i) => {
                            obj[header] = row[i] || '';
                        });
                        return obj;
                    });
                    // Update cache with SUCCESS
                    sheetCache[cacheKey] = { data: result, timestamp: now, status: 'success' };
                    return result;
                }
                // Empty sheet
                sheetCache[cacheKey] = { data: [], timestamp: now, status: 'empty' };
                return [];
            } else {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.error?.message || response.statusText;
                if (!OPTIONAL_SHEETS.includes(sheetName)) {
                    console.warn(`[API] Google Sheets API error for "${sheetName}": ${response.status} - ${msg}`);
                }
                sheetCache[cacheKey] = { data: cached?.data || [], timestamp: now, status: 'error', code: response.status };
            }
        } catch (err) {
            // Mark network as down and log only once
            lastNetworkFailure = now;
            if (!networkFailureLogged) {
                console.warn(`[API] Network appears down — serving cached data. (${err.message})`);
                networkFailureLogged = true;
            }
            // Extend cache TTL during failures
            if (cached) cached.timestamp = now;
        }
    }

    // Fallback: use Google Apps Script
    if (GOOGLE_SCRIPT_URL) {
        try {
            const cacheBuster = Date.now();
            const url = `${GOOGLE_SCRIPT_URL}?sheet=${sheetName}&_=${cacheBuster}`;
            const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
            if (response.ok) {
                const data = await response.json();
                if (data && data.error) {
                    if (!OPTIONAL_SHEETS.includes(sheetName)) {
                        console.warn(`[API] Sheet warning for "${sheetName}": ${data.error}`);
                    }
                    sheetCache[cacheKey] = { data: [], timestamp: Date.now(), status: 'gas-error' };
                } else {
                    const rows = Array.isArray(data) ? data : (Array.isArray(data.value) ? data.value : []);
                    sheetCache[cacheKey] = { data: rows, timestamp: Date.now(), status: 'success' };
                    return rows;
                }
            }
        } catch (err) {
            lastNetworkFailure = now;
            if (!networkFailureLogged) {
                console.warn(`[API] Network appears down (Apps Script fallback). (${err.message})`);
                networkFailureLogged = true;
            }
        }
    }

    // Final fallback: return cached data if available
    if (cached && cached.data) {
        if (cached.status === 'success') {
            console.log(`[API] Using cached data for "${sheetName}" (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
        }
        return cached.data;
    }

    return [];
}

// Helper function to handle async route errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
};

// --- ENDPOINTS ---

// Generic: fetch any sheet as array of row objects
app.get('/api/sheet/:name', asyncHandler(async (req, res) => {
    const rows = await fetchSheet(req.params.name);
    res.json(rows);
}));

// Endpoint to get all sheet names from the spreadsheet
app.get('/api/spreadsheet-meta', asyncHandler(async (req, res) => {
    if (!GOOGLE_SHEETS_ID || !GOOGLE_API_KEY) {
        return res.json({ sheets: [] });
    }

    const cacheKey = 'spreadsheet-meta';
    const cached = sheetCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL * 2) { // Cache meta 10s
        return res.json(cached.data);
    }

    // Skip network call if network is known to be down
    const networkIsDown = (Date.now() - lastNetworkFailure) < NETWORK_RETRY_INTERVAL;
    if (!networkIsDown) {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}?key=${GOOGLE_API_KEY}&fields=sheets.properties.title`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                lastNetworkFailure = 0;
                networkFailureLogged = false;
                const sheetNames = data.sheets.map(s => s.properties.title);
                const result = { sheets: sheetNames };
                sheetCache[cacheKey] = { data: result, timestamp: Date.now() };
                return res.json(result);
            }
        } catch (err) {
            lastNetworkFailure = Date.now();
            if (!networkFailureLogged) {
                console.warn(`[API] Network appears down (meta). (${err.message})`);
                networkFailureLogged = true;
            }
        }
    }
    res.json({ sheets: [] });
}));

// Generic: fetch a key-value style sheet as flat object
app.get('/api/kv/:name', asyncHandler(async (req, res) => {
    const rows = await fetchSheet(req.params.name);
    const kv = {};
    rows.forEach(row => {
        if (row.key) kv[row.key] = row.value || '';
    });
    res.json(kv);
}));

app.get('/api/fleets', asyncHandler(async (req, res) => {
    const fleets = await fetchSheet('fleets');
    const result = fleets.map(f => ({
        ...f,
        features: f.features ? String(f.features).split(', ').map(s => s.trim()).filter(Boolean) : []
    }));
    res.json(result);
}));

app.get('/api/hero', asyncHandler(async (req, res) => {
    const rows = await fetchSheet('hero');
    res.json(rows);
}));

app.get('/api/critical', asyncHandler(async (req, res) => {
    const [settingsRows, heroRows] = await Promise.all([
        fetchSheet('settings'),
        fetchSheet('hero')
    ]);
    const settings = {};
    settingsRows.forEach(row => {
        if (row.key) settings[row.key] = row.value || '';
    });
    res.json({ settings, hero: heroRows });
}));

app.get('/api/settings', asyncHandler(async (req, res) => {
    const rows = await fetchSheet('settings');
    const settings = {};
    rows.forEach(row => {
        if (row.key) settings[row.key] = row.value || '';
    });
    res.json(settings);
}));

// Hybrid gallery endpoint: KV metadata at top + table data below
app.get('/api/gallery-full', asyncHandler(async (req, res) => {
    const sheetName = 'Gallery';
    const cacheKey = 'gallery-full';
    const cached = sheetCache[cacheKey];

    if (cached && cached.data && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return res.json(cached.data);
    }

    // If network is down and we have cached gallery data, return it immediately
    const networkIsDown = (Date.now() - lastNetworkFailure) < NETWORK_RETRY_INTERVAL;
    if (networkIsDown && cached && cached.data) {
        return res.json(cached.data);
    }

    // Fetch raw values from Google Sheets API
    let rawValues = [];
    if (GOOGLE_SHEETS_ID && GOOGLE_API_KEY) {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${encodeURIComponent(sheetName)}?key=${GOOGLE_API_KEY}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                lastNetworkFailure = 0;
                networkFailureLogged = false;
                rawValues = data.values || [];
            }
        } catch (err) {
            lastNetworkFailure = Date.now();
            if (!networkFailureLogged) {
                console.warn(`[API] Network appears down (gallery-full). (${err.message})`);
                networkFailureLogged = true;
            }
        }
    }

    // Split into KV meta section + table data section
    const meta = {};
    let tableStartIdx = -1;

    for (let i = 0; i < rawValues.length; i++) {
        const row = rawValues[i];
        const isEmptyRow = !row || row.length === 0 || row.every(c => !c || c.toString().trim() === '');

        if (isEmptyRow) {
            // Blank separator found — next non-empty row is table headers
            tableStartIdx = i + 1;
            break;
        }

        // KV rows: 2-col (key, value) — skip header row
        if (row.length >= 2 && row[0] && row[0].toString().trim()) {
            const key = row[0].toString().trim().toLowerCase();
            if (key !== 'key') { // Skip header row
                meta[row[0].toString().trim()] = (row[1] || '').toString();
            }
        }
    }

    // Parse table data section (headers + rows)
    const items = [];
    if (tableStartIdx >= 0 && tableStartIdx < rawValues.length) {
        const headers = rawValues[tableStartIdx];
        for (let i = tableStartIdx + 1; i < rawValues.length; i++) {
            const row = rawValues[i];
            if (!row || row.every(c => !c || c.toString().trim() === '')) continue;
            const obj = {};
            headers.forEach((header, j) => {
                obj[header] = (row[j] || '').toString();
            });
            items.push(obj);
        }
    }

    const result = { meta, items };
    sheetCache[cacheKey] = { data: result, timestamp: Date.now() };
    res.json(result);
}));

// --- AUTH ENDPOINTS (proxy to Google Apps Script) ---

// Generic auth proxy helper
async function proxyAuthToGAS(action, bodyData) {
    if (!GOOGLE_SCRIPT_URL) {
        return { status: 'error', error: 'Google Script URL not configured' };
    }
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action, ...bodyData }),
            redirect: 'follow',
            signal: AbortSignal.timeout(30000),
        });
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { status: 'error', error: 'Invalid response from server' };
        }
    } catch (err) {
        console.error(`[AUTH] ${action} error:`, err.message);
        return { status: 'error', error: 'Server connection failed: ' + err.message };
    }
}

app.post('/api/auth/login', express.json(), asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await proxyAuthToGAS('login', { email, password });
    res.json(result);
}));

app.post('/api/auth/register', express.json(), asyncHandler(async (req, res) => {
    const { name, email, password, verifyLinkBase } = req.body;
    const result = await proxyAuthToGAS('register', { name, email, password, verifyLinkBase });
    res.json(result);
}));

app.post('/api/auth/forgot-password', express.json(), asyncHandler(async (req, res) => {
    const { email, resetLinkBase } = req.body;
    const result = await proxyAuthToGAS('forgot_password', { email, resetLinkBase });
    res.json(result);
}));

app.post('/api/auth/reset-password', express.json(), asyncHandler(async (req, res) => {
    const { email, newPassword, token } = req.body;
    const result = await proxyAuthToGAS('reset_password', { email, newPassword, token });
    res.json(result);
}));

app.post('/api/auth/verify-email', express.json(), asyncHandler(async (req, res) => {
    const { email, token } = req.body;
    const result = await proxyAuthToGAS('verify_email', { email, token });
    res.json(result);
}));

app.post('/api/gallery/add', express.json({ limit: '50mb' }), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('add_gallery', req.body);
    delete sheetCache['gallery'];
    delete sheetCache['gallery-full'];
    res.json(result);
}));

app.post('/api/gallery/update', express.json({ limit: '50mb' }), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('update_gallery', req.body);
    delete sheetCache['gallery'];
    delete sheetCache['gallery-full'];
    res.json(result);
}));

app.post('/api/gallery/delete', express.json(), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('delete_gallery', req.body);
    delete sheetCache['gallery'];
    delete sheetCache['gallery-full'];
    res.json(result);
}));

app.post('/api/fleet/add', express.json({ limit: '50mb' }), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('add_fleet', req.body);
    delete sheetCache['Fleet'];
    delete sheetCache['fleet'];
    res.json(result);
}));

app.post('/api/fleet/update', express.json({ limit: '50mb' }), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('update_fleet', req.body);
    delete sheetCache['Fleet'];
    delete sheetCache['fleet'];
    res.json(result);
}));

app.post('/api/fleet/delete', express.json(), asyncHandler(async (req, res) => {
    const result = await proxyAuthToGAS('delete_fleet', req.body);
    delete sheetCache['Fleet'];
    delete sheetCache['fleet'];
    res.json(result);
}));

// Start server & keep alive
const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Data source: ${GOOGLE_SHEETS_ID ? 'Google Sheets API v4' : 'Google Apps Script'}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
