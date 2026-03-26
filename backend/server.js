require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to handle async route errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
};

// --- ENDPOINTS ---

app.get('/api/services', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM services');
    res.json(rows);
}));

app.get('/api/fleets', asyncHandler(async (req, res) => {
    const [fleets] = await pool.query('SELECT * FROM fleets');
    const [features] = await pool.query('SELECT * FROM fleet_features');
    
    const result = fleets.map(f => ({
        ...f,
        features: features.filter(fe => fe.fleet_id === f.id).map(fe => fe.feature_name)
    }));
    res.json(result);
}));

app.get('/api/slides', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM slides');
    res.json(rows);
}));

app.get('/api/features', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM features');
    res.json(rows);
}));

app.get('/api/testimonials', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM testimonials');
    res.json(rows);
}));

app.get('/api/stats', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT trips, clients, onTime, fleetUnits FROM stats WHERE id = 1');
    res.json(rows[0] || {});
}));

app.get('/api/steps', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM steps');
    res.json(rows);
}));

app.get('/api/coverage-areas', asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT name FROM coverage_areas');
    res.json(rows.map(r => r.name));
}));

// Start server
app.listen(PORT, () => {
    console.log(`Backend MySQL server running on http://localhost:${PORT}`);
});
