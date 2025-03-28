//settings.js
// This file contains the routes for managing settings in the application.
import express from 'express';
const router = express.Router();
import db from '../config/db.js';

// Get all settings
router.get('/', async (req, res) => {
  try {
    console.log('Fetching settings...');
    const [rows] = await db.query('SELECT * FROM settings');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching settings:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update a setting
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { setting_key, setting_value } = req.body;
  try {
    await db.query('UPDATE settings SET setting_key = ?, setting_value = ? WHERE id = ?', [setting_key, setting_value, id]);
    res.json({ message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;