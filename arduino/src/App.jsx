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

  // Example: Fetch available serial ports from the server
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/ports`);
        const ports = await response.json();
        console.log('Available ports:', ports);
      } catch (err) {
        console.error('Error fetching ports:', err);
      }
    };
    fetchPorts();
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