// components/ManualControls.jsx
import React, { useState } from 'react';

function ManualControls({ isConnected, updateStatus }) {
  const [lights, setLights] = useState(false); // Local state for lights

  const sendCommand = (action) => {
    if (!isConnected) {
      console.log('Cannot send command: Not connected');
      return;
    }

    console.log(`Sending command: ${action}`);
    switch (action) {
      case 'forward':
        updateStatus(prev => ({ ...prev, speed: Math.min(prev.speed + 10, 100) }));
        break;
      case 'back':
        updateStatus(prev => ({ ...prev, speed: Math.max(prev.speed - 10, -100) }));
        break;
      case 'right':
        updateStatus(prev => ({ ...prev, direction: Math.min(prev.direction + 10, 90) }));
        break;
      case 'left':
        updateStatus(prev => ({ ...prev, direction: Math.max(prev.direction - 10, -90) }));
        break;
      case 'lightOn':
        setLights(true);
        console.log('Lights turned ON');
        break;
      case 'lightOff':
        setLights(false);
        console.log('Lights turned OFF');
        break;
      default:
        break;
    }
  };

  return (
    <div className="manual-controls">
      <h2>Manual Controls</h2>
      <div className="movement-buttons">
        <button
          onClick={() => sendCommand('forward')}
          disabled={!isConnected}
        >
          Forward
        </button>
        <button
          onClick={() => sendCommand('back')}
          disabled={!isConnected}
        >
          Back
        </button>
        <button
          onClick={() => sendCommand('left')}
          disabled={!isConnected}
        >
          Left
        </button>
        <button
          onClick={() => sendCommand('right')}
          disabled={!isConnected}
        >
          Right
        </button>
      </div>
      <div className="light-controls">
        <button
          onClick={() => sendCommand('lightOn')}
          disabled={!isConnected || lights}
        >
          Light On
        </button>
        <button
          onClick={() => sendCommand('lightOff')}
          disabled={!isConnected || !lights}
        >
          Light Off
        </button>
        <span className='manual'>Lights: {lights ? 'On' : 'Off'}</span>
      </div>
    </div>
  );
}

export default ManualControls;