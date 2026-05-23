const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL; // Kept as fallback

app.use(cors());
app.use(express.json());

// Set Cache-Control headers for all API routes — no browser caching so spreadsheet edits reflect immediately
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// In-memory cache for sheet data (survives API outages)
const sheetCache = {};
const CACHE_TTL = 2 * 1000; // 2 seconds — very short TTL so spreadsheet edits reflect fast

// Helper: fetch data from Google Sheets API v4 with caching
async function fetchSheet(sheetName) {
    const cacheKey = sheetName;
    const cached = sheetCache[cacheKey];

    // Return cached data if still within TTL
    if (cached && cached.data && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }

    // Try primary: Google Sheets API v4
    if (GOOGLE_SHEETS_ID && GOOGLE_API_KEY) {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${encodeURIComponent(sheetName)}?key=${GOOGLE_API_KEY}`;
            const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
            if (response.ok) {
                const data = await response.json();
                if (data.values && data.values.length > 1) {
                    const headers = data.values[0];
                    const result = data.values.slice(1).map(row => {
                        const obj = {};
                        headers.forEach((header, i) => {
                            obj[header] = row[i] || '';
                        });
                        return obj;
                    });
                    // Update cache
                    sheetCache[cacheKey] = { data: result, timestamp: Date.now() };
                    return result;
                }
                sheetCache[cacheKey] = { data: [], timestamp: Date.now() };
                return [];
            } else {
                console.warn(`[API] Google Sheets API error for "${sheetName}": ${response.status}`);
            }
        } catch (err) {
            console.warn(`[API] Google Sheets API fetch failed for "${sheetName}": ${err.message}`);
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
                    console.warn(`[API] Sheet warning for "${sheetName}": ${data.error}`);
                } else {
                    const rows = Array.isArray(data) ? data : (Array.isArray(data.value) ? data.value : []);
                    sheetCache[cacheKey] = { data: rows, timestamp: Date.now() };
                    return rows;
                }
            }
        } catch (err) {
            console.warn(`[API] Apps Script fetch failed for "${sheetName}": ${err.message}`);
        }
    }

    // Final fallback: return cached data if available
    if (cached && cached.data) {
        console.log(`[API] Using cached data for "${sheetName}" (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
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

app.get('/api/settings', asyncHandler(async (req, res) => {
    const rows = await fetchSheet('settings');
    const settings = {};
    rows.forEach(row => {
        if (row.key) settings[row.key] = row.value || '';
    });
    res.json(settings);
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
