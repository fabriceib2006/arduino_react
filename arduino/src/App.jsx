import React, { useState } from 'react';
import ConnectionPanel from './components/ConnectionPanel';
import SettingsPanel from './components/SettingsPanel'; // Corrected import path
import StatusDashboard from './components/StatusDashboard';
import ManualControls from './components/ManualControls';
import SubmarineControls from './components/SubmarineControls';
import VideoFeed from './components/VideoFeed';
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState({
    depth: 0,
    speed: 0,
    direction: 0,
    battery: 100
  });

  return (
    <div className="app-container">
      <h1>Indatwa Aqua Explorer 1 Control System</h1>
      <ConnectionPanel 
        isConnected={isConnected}
        setIsConnected={setIsConnected}
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