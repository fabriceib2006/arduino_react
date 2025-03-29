import React, { useState, useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import SettingsPanel from './components/SettingsPanel'; // Corrected import path
import StatusDashboard from './components/StatusDashboard';
import ManualControls from './components/ManualControls';
import SubmarineControls from './components/SubmarineControls';
import VideoFeed from './components/VideoFeed';
import fetchDevices from './services/deviceServices';
import './App.css'
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState({
    depth: 0,
    speed: 0,
    direction: 0,
    battery: 100
  });

  useEffect(() => {
    // Load available devices
    const loadDevices = async () => {
      try {
        const data = await fetchDevices();
        setDevices(data);
      } catch (error) {
        console.error('Error loading devices:', error);
      }
    };
    
    loadDevices();
  }, []);

  return (
    <div className="app-container">
    <h1>Indatwa Aqua Explorer 1 Control System</h1>
    <ConnectionPanel 
      isConnected={isConnected}
      setIsConnected={setIsConnected}
      devices={devices}
    />
    {isConnected && (
      <>
        <VideoFeed isConnected={isConnected} />
        <div className="main-layout">
          <StatusDashboard status={status} />
          <ManualControls 
            isConnected={isConnected} 
            updateStatus={setStatus} 
          />
          <SubmarineControls 
            isConnected={isConnected} 
            updateStatus={setStatus} 
          />
        </div>
        <SettingsPanel />
      </>
    )}
  </div>
  );
}

export default App;