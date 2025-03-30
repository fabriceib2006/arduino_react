import React, { useState } from 'react';

function ConnectionPanel({ isConnected, setIsConnected }) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('Connected successfully');
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
      <div className="connection-buttons">
        <button
          onClick={handleConnect}
          disabled={isConnected}
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