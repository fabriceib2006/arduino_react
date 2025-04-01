// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
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
// Removed Arduino-related code for simplicity

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});