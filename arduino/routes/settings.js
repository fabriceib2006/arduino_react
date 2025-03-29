// routes/settings.js
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

// Add a new setting
router.post('/', async (req, res) => {
  const { setting_key, setting_value } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
      [setting_key, setting_value]
    );
    res.json({ id: result.insertId, setting_key, setting_value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a setting
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { setting_key, setting_value } = req.body;
  try {
    await db.query('UPDATE settings SET setting_key = ?, setting_value = ? WHERE id = ?', [
      setting_key,
      setting_value,
      id,
    ]);
    res.json({ message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a setting
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM settings WHERE id = ?', [id]);
    res.json({ message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;