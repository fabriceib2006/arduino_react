
    //index.js
// This is the main entry point for the server application.
import express from 'express';
import bodyParser from 'body-parser'; // Use default import for body-parser
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

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
                                           
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});