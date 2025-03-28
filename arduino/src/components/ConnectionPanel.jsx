import React from 'react';

function ConnectionPanel({ isConnected, setIsConnected }) {
  const handleConnect = () => {
    // Placeholder for actual Arduino serial connection logic
    // This would typically involve Web Serial API or a backend service
    console.log('Attempting to connect to Arduino Uno...');
    try {
      // Simulated connection (replace with real implementation)
      setIsConnected(true);
      console.log('Connected successfully');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    // Placeholder for disconnection logic
    console.log('Disconnecting from Arduino Uno...');
    try {
      // Simulated disconnection
      setIsConnected(false);
      console.log('Disconnected successfully');
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  return (
    <div className="connection-panel">
      <button
        onClick={handleConnect}
        disabled={isConnected}
      >
        Connect to Submarine
      </button>
      <button
        onClick={handleDisconnect}
        disabled={!isConnected}
      >
        Disconnect
      </button>
      <span className='status'>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}

export default ConnectionPanel;