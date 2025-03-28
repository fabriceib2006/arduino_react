// App.jsx
import React, { useState } from 'react';
import SubmarineControls from './components/SubmarineControls';
import ManualControls from './components/ManualControls';
import StatusDashboard from './components/StatusDashboard';
import ConnectionPanel from './components/ConnectionPanel';
import VideoFeed from './components/VideoFeed'; // New import
import SettingsPanel from './components/settingsService'
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [submarineStatus, setSubmarineStatus] = useState({
    depth: 0,
    speed: 0,
    direction: 0,
    battery: 100
  });

  return (
    <div className="app-container">
      <h1 className='h1'>Indatwa Aqua Explore 1 Control Interface</h1>
      <VideoFeed isConnected={isConnected} />
      <ConnectionPanel 
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
      <SettingsPanel /> {/* New settings panel component */}
      <div className="main-layout">
        <SubmarineControls 
          isConnected={isConnected}
          updateStatus={setSubmarineStatus}
        />
        <ManualControls 
          isConnected={isConnected}
          updateStatus={setSubmarineStatus}
        />
        <StatusDashboard status={submarineStatus} />
      </div>
    </div>
  );
}

export default App;