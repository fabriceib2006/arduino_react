import React, { useState } from 'react';

function ConnectionPanel({ isConnected, setIsConnected, devices, setCurrentDevice }) {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const handleConnect = async () => {
    if (!selectedDevice) {
      alert('Please select a device first');
      return;
    }

    setConnectionStatus('connecting');
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      setCurrentDevice(selectedDevice);
      setConnectionStatus('connected');
      console.log(`Connected to ${selectedDevice} successfully`);
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnecting');
    try {
      // Simulate disconnection delay
      setTimeout(() => {
        setIsConnected(false);
        setCurrentDevice(null);
        setConnectionStatus('disconnected');
        console.log('Disconnected successfully');
      }, 500);
    } catch (error) {
      setConnectionStatus('error');
      console.error('Disconnection failed:', error);
    }
  };

  return (
    <div className="connection-panel">
      <h2>Device Connection</h2>
      
      <div className="device-selection">
        <select 
          value={selectedDevice} 
          onChange={(e) => setSelectedDevice(e.target.value)}
          disabled={isConnected}
        >
          <option value="">Select a device</option>
          {devices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name} ({device.serial_number})
            </option>
          ))}
        </select>
      </div>
      
      <div className="connection-buttons">
        <button
          onClick={handleConnect}
          disabled={isConnected || !selectedDevice}
        >
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
        </button>
        <button
          onClick={handleDisconnect}
          disabled={!isConnected}
        >
          {connectionStatus === 'disconnecting' ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
      
      <div className={`connection-status ${connectionStatus}`}>
        Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
      </div>
    </div>
  );
}

export default ConnectionPanel;