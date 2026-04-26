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

// Set Cache-Control headers for all API routes (Best Practice)
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    next();
});

// Helper: fetch data from Google Sheets API v4 (no caching delay)
async function fetchSheet(sheetName) {
    // Primary: use Google Sheets API v4 directly
    if (GOOGLE_SHEETS_ID && GOOGLE_API_KEY) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${encodeURIComponent(sheetName)}?key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`[API] Google Sheets API error for "${sheetName}": ${response.status}`);
            // Fall through to Apps Script fallback
        } else {
            const data = await response.json();
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                return data.values.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, i) => {
                        obj[header] = row[i] || '';
                    });
                    return obj;
                });
            }
            return [];
        }
    }

    // Fallback: use Google Apps Script
    if (GOOGLE_SCRIPT_URL) {
        const cacheBuster = Date.now();
        const url = `${GOOGLE_SCRIPT_URL}?sheet=${sheetName}&_=${cacheBuster}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch sheet "${sheetName}": ${response.status}`);
        const data = await response.json();
        if (data && data.error) {
            console.warn(`[API] Sheet warning for "${sheetName}": ${data.error}`);
            return [];
        }
        const rows = Array.isArray(data) ? data : (Array.isArray(data.value) ? data.value : []);
        return rows;
    }

    throw new Error('No Google Sheets data source configured.');
}

// Helper function to handle async route errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
};

// --- ENDPOINTS ---

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
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
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
