//logs.js
// This file contains the routes for managing connection logs in the application.
import express from 'express';
const router = express.Router();
import db from '../config/db.js';

// Get all logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM connection_logs');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new log
router.post('/', async (req, res) => {
  const { device_id, action } = req.body;
  try {
    const [result] = await db.query('INSERT INTO connection_logs (device_id, action) VALUES (?, ?)', [device_id, action]);
    res.json({ id: result.insertId, device_id, action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;