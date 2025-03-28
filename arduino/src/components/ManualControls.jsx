// components/ManualControls.jsx
import React, { useState, useEffect } from 'react';

function ManualControls({ isConnected, updateStatus }) {
  const [lights, setLights] = useState(false);
  const [controlMode, setControlMode] = useState('buttons');

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

  const toggleControlMode = () => {
    setControlMode(prev => (prev === 'buttons' ? 'keyboard' : 'buttons'));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (controlMode !== 'keyboard' || !isConnected) return;

      // Prevent default behavior (e.g., scrolling) for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowUp':
          sendCommand('forward');
          break;
        case 'ArrowDown':
          sendCommand('back');
          break;
        case 'ArrowLeft':
          sendCommand('left');
          break;
        case 'ArrowRight':
          sendCommand('right');
          break;
        case 'l':
        case 'L':
          sendCommand(lights ? 'lightOff' : 'lightOn');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [controlMode, isConnected, lights]);

  return (
    <div className="manual-controls">
      <h2>Manual Controls</h2>
      <div className="control-mode">
        <button onClick={toggleControlMode}>
          Switch to {controlMode === 'buttons' ? 'Keyboard' : 'Buttons'} Control
        </button>
        <p>
          Mode: {controlMode === 'buttons' ? 'Button Control' : 'Keyboard Control'}
          {controlMode === 'keyboard' && (
            <span> (Use Arrow Keys to move, L to toggle lights)</span>
          )}
        </p>
      </div>
      {controlMode === 'buttons' && (
        <>
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
            <span className="manual">Lights: {lights ? 'On' : 'Off'}</span>
          </div>
        </>
      )}
      {controlMode === 'keyboard' && (
        <div className="keyboard-instructions">
          <p>Use the following keys to control the submarine:</p>
          <ul>
            <li><strong>Arrow Up</strong>: Forward</li>
            <li><strong>Arrow Down</strong>: Back</li>
            <li><strong>Arrow Left</strong>: Left</li>
            <li><strong>Arrow Right</strong>: Right</li>
            <li><strong>L</strong>: Toggle Lights (Currently: {lights ? 'On' : 'Off'})</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManualControls;