import React, { useState, useEffect } from 'react';

function VideoFeed({ isConnected }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const videoStreamUrl = 'https://youtu.be/iJCV_2H9xD0?list=RDmC-zw0zCCtg'; // Replace with actual stream URL

  const handleToggleVideo = () => {
    setIsVideoEnabled(prev => !prev);
  };

  useEffect(() => {
    // Reset video state when disconnected
    if (!isConnected) {
      setIsVideoEnabled(false);
    }
  }, [isConnected]);

  return (
    <div className="video-feed">
      <h2>Camera Feed</h2>
      <button
        onClick={handleToggleVideo}
        disabled={!isConnected}
      >
        {isVideoEnabled ? 'Disable Video' : 'Enable Video'}
      </button>
      {isVideoEnabled && isConnected ? (
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
      ) : (
        <div className="video-placeholder">
          <p>{isConnected ? 'Video feed disabled' : 'Connect to enable video'}</p>
        </div>
      )}
    </div>
  );
}

export default VideoFeed;