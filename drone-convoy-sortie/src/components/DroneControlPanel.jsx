import React from 'react';

const DroneControlPanel = ({ 
  drones, 
  selectedDrone, 
  onDroneSelect, 
  isSimulating, 
  simulationSpeed, 
  onStartSimulation, 
  onPauseSimulation, 
  onResetSimulation, 
  onSpeedChange 
}) => {
  return (
    <div className="control-container">
      {/* Simulation Controls */}
      <div className="simulation-controls">
        <h3>MISSION CONTROL</h3>
        <div className="sim-buttons">
          <button 
            className="sim-btn" 
            onClick={onStartSimulation}
            disabled={isSimulating}
          >
            ▶ START
          </button>
          <button 
            className="sim-btn pause" 
            onClick={onPauseSimulation}
            disabled={!isSimulating}
          >
            ⏸ PAUSE
          </button>
          <button 
            className="sim-btn reset" 
            onClick={onResetSimulation}
          >
            ↺ RESET
          </button>
        </div>
        <div className="speed-control">
          <span className="speed-label">SPEED:</span>
          <input 
            type="range" 
            className="speed-slider"
            min="0.5" 
            max="5" 
            step="0.5" 
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          />
          <span className="speed-value">{simulationSpeed}x</span>
        </div>
      </div>

      {/* Drone Status Cards */}
      <div className="drones-list">
        <h3>DRONE STATUS</h3>
        {drones && drones.map(drone => (
          <div 
            key={drone.id}
            className={`drone-card ${drone.status} ${selectedDrone?.id === drone.id ? 'selected' : ''}`}
            onClick={() => onDroneSelect(drone)}
          >
            <div className="drone-header">
              <span className="drone-id">{drone.callsign || drone.id}</span>
              <span className={`drone-status ${drone.status}`}>
                {drone.status.toUpperCase()}
              </span>
            </div>
            <div className="drone-stats">
              <div className="stat-item">
                <span className="stat-label">LAT:</span>
                <span className="stat-value">{drone.lat?.toFixed(4) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">LNG:</span>
                <span className="stat-value">{drone.lng?.toFixed(4) || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">BAT:</span>
                <span className={`stat-value ${drone.battery < 30 ? 'danger' : drone.battery < 60 ? 'warning' : ''}`}>
                  {Math.round(drone.battery)}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">FUEL:</span>
                <span className={`stat-value ${drone.fuel < 30 ? 'danger' : drone.fuel < 60 ? 'warning' : ''}`}>
                  {Math.round(drone.fuel)}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ALT:</span>
                <span className="stat-value">{Math.round(drone.altitude)}m</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">SPD:</span>
                <span className="stat-value">{Math.round(drone.speed)} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneControlPanel;