// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { SerialPort } from 'serialport';
import db from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

import devicesRoutes from './routes/devices.js';
import logsRoutes from './routes/logs.js';
import sensorsRoutes from './routes/sensors.js';
import settingsRoutes from './routes/settings.js';

app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/settings', settingsRoutes);

// Serial Port Setup
  const arduinoUnoPortPath = process.env.ARDUINO_UNO_PORT || '/dev/ttyUSB0';
const arduinoCameraPortPath = process.env.ARDUINO_CAMERA_PORT || '/dev/ttyUSB1';

let arduinoUnoPort, arduinoCameraPort;

try {
  arduinoUnoPort = new SerialPort({ path: arduinoUnoPortPath, baudRate: 9600 });
  console.log(`Arduino Uno connected on ${arduinoUnoPortPath}`);
} catch (err) {
  console.error(`Failed to open Arduino Uno port (${arduinoUnoPortPath}):`, err.message);
}

try {
  arduinoCameraPort = new SerialPort({ path: arduinoCameraPortPath, baudRate: 9600 });
  console.log(`Arduino Camera connected on ${arduinoCameraPortPath}`);
} catch (err) {
  console.error(`Failed to open Arduino Camera port (${arduinoCameraPortPath}):`, err.message);
}

// Endpoint to list available serial ports
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (err) {
    console.error('Error listing ports:', err);
    res.status(500).json({ error: 'Failed to list ports' });
  }
});

// Existing endpoints for Arduino commands...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});