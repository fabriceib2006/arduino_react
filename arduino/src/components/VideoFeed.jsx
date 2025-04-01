import React, { useState, useEffect, useRef } from 'react';

function VideoFeed({ isConnected }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const videoStreamUrl = 'http://192.168.1.100/stream';
  const videoRef = useRef(null);

  useEffect(() => {
    fetchRecordings();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsVideoEnabled(false);
      setIsRecording(false);
      if (videoRef.current) {
        videoRef.current.src = ''; // Clear the video source
      }
    }
  }, [isConnected]);

  const fetchRecordings = async () => {
    try {
      const response = await fetch(`${process.env.RECORDING_SERVER_URL || 'http://localhost:3000'}/api/recordings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recordings: ${response.statusText}`);
      }
      const data = await response.json();
      setRecordedVideos(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch recordings:', err.message);
      setError('Failed to connect to the recording server. Please ensure it is running and the endpoint is correct.');
    }
  };

  const startRecording = async () => {
    if (!isVideoEnabled || !isConnected) return;

    setIsRecording(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.RECORDING_SERVER_URL || 'http://localhost:3000'}/start-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamUrl: videoStreamUrl, duration: 10 }),
      });
      if (!response.ok) {
        throw new Error('Failed to start recording');
      }
      await fetchRecordings();
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) {
      setError('No recording in progress');
      return;
    }
    setIsRecording(false);
    setError(null);
    try {
      const response = await fetch(`${process.env.RECORDING_SERVER_URL || 'http://localhost:3000'}/stop-recording`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to stop recording:', response.status, text);
        setError(`Failed to stop recording: ${response.status} - ${text}`);
        return;
      }
      const newRecording = await response.json();
      console.log('Recording stopped and saved:', newRecording);
      await fetchRecordings();
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError(err.message);
    }
  };

  const deleteRecording = async (id) => {
    try {
      const response = await fetch(`${process.env.RECORDING_SERVER_URL || 'http://localhost:3000'}/api/recordings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recording');
      }
      await fetchRecordings();
    } catch (err) {
      console.error('Failed to delete recording:', err);
      setError(err.message);
    }
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const handleHistoryKeyDown = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="video-feed">
      <h2>Camera Feed</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="video-controls">
        <button onClick={() => setIsVideoEnabled((prev) => !prev)} disabled={!isConnected}>
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
            ref={videoRef}
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
              {recordedVideos.map((video) => (
                <li key={video.id} className="history-item">
                  <span>{video.name} ({new Date(video.timestamp).toLocaleString()})</span>
                  <div>
                    <a href={`http://localhost:3000${video.url}`} target="_blank" rel="noopener noreferrer">
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