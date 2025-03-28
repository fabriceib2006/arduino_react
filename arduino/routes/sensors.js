//sensors.js
// This file contains the routes for managing sensor data in the application.
import { Router } from 'express';
const router = Router();
import db from '../config/db.js';

// Get all sensor data
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sensor_data'); // Use db.query
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new sensor data
router.post('/', async (req, res) => {
  const { device_id, data_type, value } = req.body;
  try {
    const [result] = await db.query('INSERT INTO sensor_data (device_id, data_type, value) VALUES (?, ?, ?)', [device_id, data_type, value]); // Use db.query
    res.json({ id: result.insertId, device_id, data_type, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;