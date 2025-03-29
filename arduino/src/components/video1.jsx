// components/VideoFeed.jsx
import React, { useState, useEffect, useRef } from 'react';

function VideoFeed({ isConnected }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const videoStreamUrl = 'http://192.168.1.100/stream'; // Replace placeholder with actual IP
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem('recordedVideos')) || [];
    setRecordedVideos(savedVideos);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsVideoEnabled(false);
      setIsRecording(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isConnected]);

  const startRecording = () => {
    if (!isVideoEnabled || !isConnected) return;

    setIsRecording(true);
    recordedChunks.current = [];

    // Simulate recording (MJPEG recording requires server-side support)
    const simulatedRecording = setTimeout(() => {
      stopRecording();
    }, 10000);

    console.log('Recording started (simulated)...');
  };

  const stopRecording = () => {
    setIsRecording(false);

    const timestamp = new Date().toISOString();
    const videoBlob = new Blob(recordedChunks.current, { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    const newRecording = {
      id: Date.now(),
      timestamp,
      url: videoUrl || 'https://via.placeholder.com/640x480?text=Recorded+Video',
      name: `Recording_${timestamp}.mp4`
    };

    const updatedVideos = [...recordedVideos, newRecording];
    setRecordedVideos(updatedVideos);
    localStorage.setItem('recordedVideos', JSON.stringify(updatedVideos));

    console.log('Recording stopped and saved:', newRecording);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const deleteRecording = (id) => {
    const updatedVideos = recordedVideos.filter(video => video.id !== id);
    setRecordedVideos(updatedVideos);
    localStorage.setItem('recordedVideos', JSON.stringify(updatedVideos));
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
        <div className="video-history">
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