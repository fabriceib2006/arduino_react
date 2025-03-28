//devices.js
// This file contains the routes for managing devices in the application.
import express from 'express';
const router = express.Router();
import db from '../config/db.js';

// Get all devices
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new device
router.post('/', async (req, res) => {
  const { name, serial_number } = req.body;
  try {
    const [result] = await db.query('INSERT INTO devices (name, serial_number) VALUES (?, ?)', [name, serial_number]);
    res.json({ id: result.insertId, name, serial_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update device status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE devices SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Device status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a device
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM devices WHERE id = ?', [id]);
    res.json({ message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;