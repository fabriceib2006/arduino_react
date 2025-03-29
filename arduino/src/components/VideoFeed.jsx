// components/VideoFeed.jsx
import React, { useState, useEffect, useRef } from 'react';

function VideoFeed({ isConnected }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const videoStreamUrl = 'http://[your-esp32-ip]/stream'; // Replace with your ESP32-CAM stream URL

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem('recordedVideos')) || [];
    setRecordedVideos(savedVideos);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsVideoEnabled(false);
      setIsRecording(false);
    }
  }, [isConnected]);

  const startRecording = async () => {
    if (!isVideoEnabled || !isConnected) return;

    setIsRecording(true);
    try {
      const response = await fetch('http://localhost:3000/start-recording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamUrl: videoStreamUrl, duration: 10 }),
      });
      const data = await response.json();
      console.log('Recording started:', data);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      const response = await fetch('http://localhost:3000/stop-recording');
      const data = await response.json();
      const timestamp = new Date().toISOString();
      const newRecording = {
        id: Date.now(),
        timestamp,
        url: data.url,
        name: `Recording_${timestamp}.mp4`,
      };
      const updatedVideos = [...recordedVideos, newRecording];
      setRecordedVideos(updatedVideos);
      localStorage.setItem('recordedVideos', JSON.stringify(updatedVideos));
      console.log('Recording stopped and saved:', newRecording);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const deleteRecording = (id) => {
    const updatedVideos = recordedVideos.filter(video => video.id !== id);
    setRecordedVideos(updatedVideos);
    localStorage.setItem('recordedVideos', JSON.stringify(updatedVideos));
  };

  const handleHistoryKeyDown = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="video-feed">
      <h2>Camera Feed</h2>
      <div className="video-controls">
        <button
          onClick={() => setIsVideoEnabled(prev => !prev)}
          disabled={!isConnected}
        >
          {isVideoEnabled ? 'Disable Video' : 'Enable Video'}
        </button>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isVideoEnabled || !isConnected}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={toggleHistory}>
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {isVideoEnabled && isConnected && !showHistory ? (
        <div className="video-container">
          <img
            src={videoStreamUrl}
            alt="Submarine Camera Feed"
            className="video-stream"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/640x480?text=Video+Feed+Unavailable';
            }}
          />
        </div>
      ) : showHistory ? (
        <div className="video-history" onKeyDown={handleHistoryKeyDown} tabIndex={0}>
          <h3>Recording History</h3>
          {recordedVideos.length > 0 ? (
            <ul>
              {recordedVideos.map(video => (
                <li key={video.id} className="history-item">
                  <span>{video.name} ({new Date(video.timestamp).toLocaleString()})</span>
                  <div>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <button>View</button>
                    </a>
                    <button onClick={() => deleteRecording(video.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recordings available.</p>
          )}
        </div>
      ) : (
        <div className="video-placeholder">
          <p>{isConnected ? 'Video feed disabled' : 'Connect to enable video'}</p>
        </div>
      )}
    </div>
  );
}

export default VideoFeed;