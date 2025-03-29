import React, { useState, useEffect } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import SettingsPanel from './components/settingsService';
import StatusDashboard from './components/StatusDashboard';
import ManualControls from './components/ManualControls';
import SubmarineControls from './components/SubmarineControls';
import VideoFeed from './components/VideoFeed';
import fetchDevices from './services/deviceServices';
import './App.css'
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
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
    <h1>Submarine Control System</h1>
    <ConnectionPanel 
      isConnected={isConnected}
      setIsConnected={setIsConnected}
      devices={devices}
      setCurrentDevice={setCurrentDevice}
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