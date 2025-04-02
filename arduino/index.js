// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { SerialPort } from 'serialport'; // Ensure SerialPort is imported
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; // Ensure this port is different from the recording server

app.use(cors());
app.use(bodyParser.json());

import devicesRoutes from './routes/devices.js';
import logsRoutes from './routes/logs.js';
import sensorsRoutes from './routes/sensors.js';
import settingsRoutes from './routes/settings.js';
import recordingServer from './routes/recordingServer.js'; // Import the recording server as default

app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/settings', settingsRoutes);
app.use(recordingServer); // Mount the recording server

// Serial Port Setup
// Removed Arduino-related code for simplicity

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Define the /api/ports route
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list(); // Fetch available serial ports
    res.json(ports);
  } catch (err) {
    console.error('Error listing ports:', err.message);
    res.status(500).json({ error: 'Failed to list ports' });
  }
});