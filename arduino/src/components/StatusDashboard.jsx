 // components/StatusDashboard.jsx
 import React, { useState, useEffect } from 'react';

 function StatusDashboard({ status, deviceId }) {
   const [sensorData, setSensorData] = useState({ temperature: 0, pressure: 0 });
 
   useEffect(() => {
     if (!deviceId) return;
 
     const fetchSensorData = async () => {
       try {
         const response = await fetch('http://localhost:5000/api/sensors');
         if (!response.ok) throw new Error('Failed to fetch sensor data');
         const data = await response.json();
         const deviceSensors = data.filter(sensor => sensor.device_id === deviceId);
         const latestTemperature = deviceSensors.find(s => s.data_type === 'temperature')?.value || 0;
         const latestPressure = deviceSensors.find(s => s.data_type === 'pressure')?.value || 0;
         setSensorData({ temperature: latestTemperature, pressure: latestPressure });
       } catch (err) {
         console.error('Error fetching sensor data:', err);
       }
     };
 
     fetchSensorData();
     const interval = setInterval(fetchSensorData, 5000); // Refresh every 5 seconds
     return () => clearInterval(interval);
   }, [deviceId]);
 
   return (
     <div className="status-dashboard">
       <h2>IAE 1 Status</h2>
       <div className="status-item">
         <span>Depth:</span> <span>{status.depth} m</span>
       </div>
       <div className="status-item">
         <span>Speed:</span> <span>{status.speed}%</span>
       </div>
       <div className="status-item">
         <span>Direction:</span> <span>{status.direction}°</span>
       </div>
       <div className="status-item">
         <span>Battery:</span> <span>{status.battery}%</span>
       </div>
       <div className="status-item">
         <span>Temperature:</span> <span>{sensorData.temperature}°C</span>
       </div>
       <div className="status-item">
         <span>Pressure:</span> <span>{sensorData.pressure} kPa</span>
       </div>
     </div>
   );
 }
 
 export default StatusDashboard;