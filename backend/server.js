require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

app.use(cors());
app.use(express.json());

// Set Cache-Control headers for all API routes (Best Practice)
// max-age=300 (cache for 5 minutes)
// stale-while-revalidate=86400 (serve stale data for up to 1 day while fetching fresh data in the background)
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    next();
});

// Helper: fetch data from Google Apps Script
async function fetchSheet(sheetName) {
    const url = `${GOOGLE_SCRIPT_URL}?sheet=${sheetName}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch sheet "${sheetName}": ${response.status}`);
    const data = await response.json();
    if (data && data.error) {
        console.warn(`[API] Sheet warning for "${sheetName}": ${data.error}`);
        return [];
    }
    return Array.isArray(data) ? data : [];
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

// Start server
app.listen(PORT, () => {
    console.log(`Backend Google Sheets server running on http://localhost:${PORT}`);
});
