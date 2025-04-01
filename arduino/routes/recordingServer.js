import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const RECORDINGS_DIR = path.join(process.cwd(), 'recordings');

// Middleware
router.use(cors());
router.use('/recordings', express.static(RECORDINGS_DIR)); // Serve recordings statically

// Log incoming requests with IP address
router.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Request received from IP: ${clientIP}`);
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

// Fetch all recordings
router.get('/api/recordings', (req, res) => {
  try {
    const recordings = fs.readdirSync(RECORDINGS_DIR).map((file) => ({
      id: path.basename(file, '.mp4'),
      name: file,
      url: `/recordings/${file}`,
      timestamp: fs.statSync(path.join(RECORDINGS_DIR, file)).mtime,
    }));
    res.json(recordings);
  } catch (err) {
    console.error('Error fetching recordings:', err.message);
    res.status(500).json({ error: 'Failed to fetch recordings' });
  }
});

// Start a recording (mock implementation)
router.post('/start-recording', (req, res) => {
  const { streamUrl, duration } = req.body;
  if (!streamUrl || !duration) {
    return res.status(400).json({ error: 'Missing streamUrl or duration' });
  }
  console.log(`Starting recording from ${streamUrl} for ${duration} seconds...`);
  // Simulate recording logic here
  res.json({ message: 'Recording started' });
});

// Stop a recording (mock implementation)
router.post('/stop-recording', (req, res) => {
  console.log('Stopping recording...');
  // Simulate stopping recording logic here
  res.json({ message: 'Recording stopped and saved' });
});

// Delete a recording
router.delete('/api/recordings/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(RECORDINGS_DIR, `${id}.mp4`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Recording not found' });
  }
  try {
    fs.unlinkSync(filePath);
    res.json({ message: 'Recording deleted' });
  } catch (err) {
    console.error('Error deleting recording:', err.message);
    res.status(500).json({ error: 'Failed to delete recording' });
  }
});

export default router;
