//recordingServer.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/recordings', express.static(path.join(__dirname, 'recordings'))); // Fix static path

// Configuration
const RECORDINGS_DIR = path.join(__dirname, 'recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

// In-memory storage for active recording (in a real app, use proper state management)
let activeRecording = null;

// Storage for recording files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RECORDINGS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.mp4`);
  }
});

const upload = multer({ storage });

// API Endpoints

// Get list of recordings
app.get('/recordings', (req, res) => {
  try {
    const files = fs.readdirSync(RECORDINGS_DIR);
    const recordings = files.map(file => {
      const stat = fs.statSync(path.join(RECORDINGS_DIR, file));
      return {
        id: path.parse(file).name,
        name: `Recording ${path.parse(file).name}`,
        url: `./recordings/${file}`,
        timestamp: stat.birthtime
      };
    }).sort((a, b) => b.timestamp - a.timestamp);

    res.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).json({ error: 'Failed to fetch recordings' });
  }
});

// Start recording
app.post('/start-recording', (req, res) => {
  try {
    const { streamUrl, duration } = req.body;
    
    if (activeRecording) {
      return res.status(400).json({ error: 'Recording already in progress' });
    }

    const recordingId = uuidv4();
    const outputPath = path.join(RECORDINGS_DIR, `${recordingId}.mp4`);

    // Start recording with ffmpeg
    const command = ffmpeg(streamUrl)
      .inputOptions([
        '-rtsp_transport tcp',
        '-stimeout 5000000'
      ])
      .outputOptions([
        '-c:v copy',
        '-c:a copy',
        '-f mp4'
      ])
      .save(outputPath)
      .on('start', (commandLine) => {
        console.log('Recording started:', commandLine);
        activeRecording = {
          id: recordingId,
          process: command,
          outputPath,
          startTime: new Date()
        };
        res.json({ message: 'Recording started', id: recordingId });
      })
      .on('error', (err) => {
        console.error('Recording error:', err);
        activeRecording = null;
        if (!res.headersSent) {
          res.status(500).json({ error: 'Recording failed to start' });
        }
      })
      .on('end', () => {
        console.log('Recording finished');
        activeRecording = null;
      });

    // If duration is specified, stop recording after that time
    if (duration) {
      setTimeout(() => {
        if (activeRecording && activeRecording.id === recordingId) {
          command.kill('SIGINT');
        }
      }, duration * 1000);
    }

  } catch (error) {
    console.error('Error starting recording:', error);
    res.status(500).json({ error: 'Failed to start recording' });
  }
});

// Stop recording
app.post('/stop-recording', (req, res) => {
  try {
    if (!activeRecording) {
      return res.status(400).json({ error: 'No active recording to stop' });
    }

    activeRecording.process.kill('SIGINT');
    const recordingId = activeRecording.id;
    activeRecording = null;

    // Wait a moment for the file to be finalized
    setTimeout(() => {
      const recordingPath = path.join(RECORDINGS_DIR, `${recordingId}.mp4`);
      const stat = fs.statSync(recordingPath);
      
      res.json({
        id: recordingId,
        name: `Recording ${recordingId}`,
        url: `/recordings/${recordingId}.mp4`,
        timestamp: stat.birthtime
      });
    }, 500);
  } catch (error) {
    console.error('Error stopping recording:', error);
    res.status(500).json({ error: 'Failed to stop recording' });
  }
});

// Delete recording
app.delete('/recordings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(RECORDINGS_DIR, `${id}.mp4`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    console.error('Error deleting recording:', error);
    res.status(500).json({ error: 'Failed to delete recording' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;