import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DroneStatusCard from './DroneStatusCard.jsx';

/**
 * Right-side control panel component
 * @param {Object} props - Component props
 * @param {Array} props.drones - Array of drone objects
 * @param {boolean} props.isSimulating - Simulation state
 * @param {Object} props.selectedDrone - Currently selected drone
 * @param {Object} props.stats - Simulation statistics
 * @param {number} props.simulationSpeed - Simulation speed multiplier
 * @param {Function} props.onToggleSimulation - Toggle simulation callback
 * @param {Function} props.onResetSimulation - Reset simulation callback
 * @param {Function} props.onSelectDrone - Drone selection callback
 * @param {Function} props.onFocusDrone - Focus drone on map callback
 * @param {Function} props.onSpeedChange - Speed change callback
 * @returns {JSX.Element}
 */
const DroneStatusPanel = ({
  drones = [],
  isSimulating = false,
  selectedDrone = null,
  stats = {},
  simulationSpeed = 1,
  onToggleSimulation = () => {},
  onResetSimulation = () => {},
  onSelectDrone = () => {},
  onFocusDrone = () => {},
  onSpeedChange = () => {}
}) => {
  
  const getStatusCount = (status) => {
    return drones.filter(drone => drone.status === status).length;
  };

  const renderMissionStatus = () => (
    <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
      <h3 className="text-lg font-bold mb-3 text-military-accent flex items-center gap-2">
        <Activity className="w-5 h-5" />
        MISSION STATUS
      </h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Online:</span>
          <span className="font-mono text-green-400">{stats.onlineCount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Warning:</span>
          <span className="font-mono text-yellow-400">{stats.warningCount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Offline:</span>
          <span className="font-mono text-red-400">{stats.offlineCount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Progress:</span>
          <span className="font-mono text-cyan-400">{stats.totalProgress || 0}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Avg Battery:</span>
          <span className="font-mono text-blue-400">{stats.avgBattery || 0}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Mission Time:</span>
          <span className="font-mono text-cyan-400">{stats.missionTime || 0}m</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-300">OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-gray-300">CAUTION</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs text-gray-300">DOWN</span>
        </div>
      </div>
    </div>
  );

  const renderSimulationControls = () => (
    <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
      <h3 className="text-lg font-bold mb-3 text-military-accent flex items-center gap-2">
        <Settings className="w-5 h-5" />
        SIMULATION CONTROL
      </h3>

      {/* Main Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onToggleSimulation}
          className={`
            flex-1 btn-tactical px-4 py-2 rounded flex items-center justify-center gap-2 font-semibold text-sm
            ${isSimulating 
              ? 'text-red-400 border-red-400/50 hover:bg-red-400/10' 
              : 'text-green-400 border-green-400/50 hover:bg-green-400/10'
            }
            border transition-colors
          `}
        >
          {isSimulating ? (
            <>
              <Pause className="w-4 h-4" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              START
            </>
          )}
        </button>

        <button
          onClick={onResetSimulation}
          className="btn-tactical px-4 py-2 rounded flex items-center gap-2 text-yellow-400 border border-yellow-400/50 hover:bg-yellow-400/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>
      </div>

      {/* Speed Control */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">
          Simulation Speed: {simulationSpeed}x
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={simulationSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-military-light rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.1x</span>
          <span>1x</span>
          <span>5x</span>
        </div>
      </div>

      {/* Simulation Status */}
      <div className="text-xs space-y-1 text-gray-400">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={isSimulating ? 'text-green-400' : 'text-red-400'}>
            {isSimulating ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Speed:</span>
          <span className="text-cyan-400">{simulationSpeed}x</span>
        </div>
        <div className="flex justify-between">
          <span>Update Rate:</span>
          <span className="text-cyan-400">2Hz</span>
        </div>
      </div>
    </div>
  );

  const renderSelectedDroneDetails = () => {
    if (!selectedDrone) {
      return (
        <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
          <h3 className="text-lg font-bold mb-3 text-military-accent flex items-center gap-2">
            <Eye className="w-5 h-5" />
            DRONE DETAILS
          </h3>
          <div className="text-center text-gray-400 py-8">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a drone to view details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
        <h3 className="text-lg font-bold mb-3 text-military-accent flex items-center gap-2">
          <Eye className="w-5 h-5" />
          DRONE DETAILS
        </h3>
        
        <div className="space-y-3">
          <div className="border-b border-military-light pb-2">
            <div className="font-bold text-military-accent">{selectedDrone.id}</div>
            <div className="text-sm text-gray-300">{selectedDrone.callsign}</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Status:</span>
                <div className={`font-mono ${
                  selectedDrone.status === 'online' ? 'text-green-400' :
                  selectedDrone.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {selectedDrone.status.toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Health:</span>
                <div className="font-mono text-cyan-400">
                  {selectedDrone.systemHealth.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Battery:</span>
                <div className="font-mono text-blue-400">
                  {selectedDrone.battery.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-400">Fuel:</span>
                <div className="font-mono text-blue-400">
                  {selectedDrone.fuel.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Altitude:</span>
                <div className="font-mono text-cyan-400">
                  {selectedDrone.altitude.toFixed(0)}m
                </div>
              </div>
              <div>
                <span className="text-gray-400">Speed:</span>
                <div className="font-mono text-cyan-400">
                  {selectedDrone.speed.toFixed(0)}kt
                </div>
              </div>
            </div>

            <div>
              <span className="text-gray-400">Armament:</span>
              <div className="mt-1">
                {selectedDrone.armament.map((weapon, idx) => (
                  <div key={idx} className="text-xs font-mono text-orange-400">
                    • {weapon}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-400">Last Update:</span>
              <div className="font-mono text-xs text-gray-300">
                {new Date(selectedDrone.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Mission Status */}
      {renderMissionStatus()}

      {/* Simulation Controls */}
      {renderSimulationControls()}

      {/* Selected Drone Details */}
      {renderSelectedDroneDetails()}

      {/* Drone List */}
      <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
        <h3 className="text-lg font-bold mb-3 text-military-accent flex items-center gap-2">
          <Users className="w-5 h-5" />
          DRONE CONVOY ({drones.length})
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {drones.map(drone => (
            <DroneStatusCard
              key={drone.id}
              drone={drone}
              isSelected={selectedDrone?.id === drone.id}
              onSelect={onSelectDrone}
              onFocus={onFocusDrone}
            />
          ))}
        </div>
      </div>

      {/* OpenCV Integration Status */}
      <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
        <h3 className="text-lg font-bold mb-3 text-military-accent">
          COMPUTER VISION
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Tracking System:</span>
            <span className="text-green-400">READY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Object Detection:</span>
            <span className="text-yellow-400">STANDBY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">P2P Network:</span>
            <span className="text-blue-400">INIT</span>
          </div>
          <div className="mt-3 p-2 bg-military-light rounded text-xs text-gray-400">
            <strong className="text-military-accent">Phase 2:</strong> OpenCV Rust backend integration for real-time halo tracking.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneStatusPanel;