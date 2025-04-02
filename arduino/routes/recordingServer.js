import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js'; // Import the database connection
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.RECORDING_SERVER_PORT || 5001;
const RECORDINGS_DIR = path.join(process.cwd(), 'recordings');

// Middleware
app.use(cors());
app.use(express.json()); // Ensure JSON body parsing is applied
app.use('/recordings', express.static(RECORDINGS_DIR));

// Log incoming requests with IP address
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[${new Date().toISOString()}] Request received from IP: ${clientIP}`);
  next();
});

// Ensure the recordings directory exists
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RECORDINGS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.mp4`);
  },
});
const upload = multer({ storage });

// Fetch all recordings from the database
app.get('/api/recordings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recordings ORDER BY timestamp DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching recordings from database:', err.message);
    res.status(500).json({ error: 'Failed to fetch recordings' });
  }
});

// Start a recording
app.post('/start-recording', async (req, res, next) => {
  const { streamUrl, duration } = req.body;

  // Validate request body
  if (!streamUrl || !duration) {
    console.error('Invalid request: Missing streamUrl or duration');
    return res.status(400).json({ error: 'Missing streamUrl or duration' });
  }

  const recordingId = uuidv4();
  const fileName = `${recordingId}.mp4`;
  const filePath = path.join(RECORDINGS_DIR, fileName);
  const timestamp = new Date();

  try {
    console.log(`Starting recording from ${streamUrl} for ${duration} seconds...`);
    await db.query('INSERT INTO recordings (id, name, url, timestamp, duration) VALUES (?, ?, ?, ?, ?)', [
      recordingId,
      fileName,
      `/recordings/${fileName}`,
      timestamp,
      duration,
    ]);
    res.json({ message: 'Recording started', id: recordingId });
  } catch (err) {
    console.error('Error starting recording:', err.message);
    next(err); // Pass the error to the error-handling middleware
  }
});

// Stop a recording
app.post('/stop-recording', (req, res) => {
  console.log('Stopping recording...');
  res.json({ message: 'Recording stopped and saved' });
});

// Delete a recording
app.delete('/api/recordings/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM recordings WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    const filePath = path.join(RECORDINGS_DIR, rows[0].name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query('DELETE FROM recordings WHERE id = ?', [id]);
    res.json({ message: 'Recording deleted' });
  } catch (err) {
    console.error('Error deleting recording:', err.message);
    next(err); // Pass the error to the error-handling middleware
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Server-side error:', err);
  res.status(500).json({ error: 'Internal server error: ' + err.message });
});

// Check if the file is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Recording server is running on http://localhost:${PORT}`);
  });
}

export default app; // Export the app instance
