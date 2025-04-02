import React, { useState, useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import StatusDashboard from './components/StatusDashboard';
import ManualControls from './components/ManualControls';
import SubmarineControls from './components/SubmarineControls';
import VideoFeed from './components/VideoFeed';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState({
    depth: 0,
    speed: 0,
    direction: 0,
    battery: 100,
  });

  // Use ports defined in .env
  const arduinoUnoPort = process.env.ARDUINO_UNO_PORT || '/dev/ttyUSB0';
  const arduinoCameraPort = process.env.ARDUINO_CAMERA_PORT || '/dev/ttyUSB1';

  useEffect(() => {
    console.log('Using ports from .env:');
    console.log('Arduino Uno Port:', arduinoUnoPort);
    console.log('Arduino Camera Port:', arduinoCameraPort);
  }, []);

  return (
    <div className="app-container">
      <h1>Indatwa Aqua Explorer 1 Control System</h1>
      <ConnectionPanel isConnected={isConnected} setIsConnected={setIsConnected} />
      {isConnected && (
        <>
          <VideoFeed isConnected={isConnected} />
          <div className="main-layout">
            <StatusDashboard status={status} />
            <ManualControls isConnected={isConnected} updateStatus={setStatus} />
            <SubmarineControls isConnected={isConnected} updateStatus={setStatus} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;