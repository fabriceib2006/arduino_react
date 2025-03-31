//index.js
// This is the main entry point for the server application.
import express from 'express';
import bodyParser from 'body-parser'; // Use default import for body-parser
import cors from 'cors';
import dotenv from 'dotenv';
import SerialPort from 'serialport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Use bodyParser.json() here

import devicesRoutes from './routes/devices.js';
import logsRoutes from './routes/logs.js';
import sensorsRoutes from './routes/sensors.js';
import settingsRoutes from './routes/settings.js';

app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/settings', settingsRoutes);

// Serial Port Setup
const arduinoUnoPort = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 }); // Adjust port name as needed
const arduinoCameraPort = new SerialPort('/dev/ttyUSB1', { baudRate: 9600 }); // Adjust port name as needed

// Endpoint to send commands to Arduino Uno
app.post('/api/arduino-uno/command', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  arduinoUnoPort.write(command, (err) => {
    if (err) {
      console.error('Error sending command to Arduino Uno:', err);
      return res.status(500).json({ error: 'Failed to send command to Arduino Uno' });
    }
    res.json({ message: 'Command sent to Arduino Uno successfully' });
  });
});

// Endpoint to send commands to Arduino Camera
app.post('/api/arduino-camera/command', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  arduinoCameraPort.write(command, (err) => {
    if (err) {
      console.error('Error sending command to Arduino Camera:', err);
      return res.status(500).json({ error: 'Failed to send command to Arduino Camera' });
    }
    res.json({ message: 'Command sent to Arduino Camera successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});