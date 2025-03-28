import React from 'react';

function StatusDashboard({ status }) {
  return (
    <div className="status-dashboard">
      <h2>IAE 1 Status</h2>
      <div className="status-item">
        <span>Depth:</span> <span>{status.depth} m</span>
      </div>
      <div className="status-item">
        <span>Speed:</span> <span>{status.speed}%</span>
      </div>
      <div className="status-item">
        <span>Direction:</span> <span>{status.direction}°</span>
      </div>
      <div className="status-item">
        <span>Battery:</span> <span>{status.battery}%</span>
      </div>
    </div>
  );
}

export default StatusDashboard;