import React from 'react';
import TacticalMap from './components/TacticalMap.jsx';
import DroneControlPanel from './components/DroneControlPanel.jsx';
import ConvoyProgress from './components/ConvoyProgress.jsx';
import { useDroneSimulation } from './hooks/useDroneSimulation.js';
import { MISSION_CONFIG } from './data/seedData.js';
import { Shield, Radio, Clock, MapPin } from 'lucide-react';

/**
 * Main application component - Drone Convoy Sortie
 * @returns {JSX.Element}
 */
function App() {
  const {
    drones,
    isSimulating,
    selectedDrone,
    simulationSpeed,
    missionStartTime,
    startSimulation,
    stopSimulation,
    toggleSimulation,
    resetSimulation,
    selectDrone,
    updateDroneStatus,
    setSimulationSpeed,
    stats
  } = useDroneSimulation();

  const handleDroneClick = (drone) => {
    selectDrone(drone.id);
  };

  const formatMissionTime = () => {
    const now = new Date();
    const diff = now - missionStartTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
    return `${remainingMinutes}m`;
  };

  const renderHeader = () => (
    <div className="mb-6 p-6 bg-military-medium rounded-lg border border-military-accent/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-military-accent" />
          <div>
            <h1 className="text-3xl font-bold text-military-accent glitch" data-text="DRONE CONVOY SORTIE">
              DRONE CONVOY SORTIE
            </h1>
            <div className="text-sm text-gray-300 font-mono">
              {MISSION_CONFIG.name} • {MISSION_CONFIG.classification}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-mono text-military-accent">
            {formatMissionTime()}
          </div>
          <div className="text-sm text-gray-300">MISSION TIME</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-gray-300">FREQ</div>
            <div className="font-mono text-cyan-400">{MISSION_CONFIG.commandFrequency}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-gray-300">AOR</div>
            <div className="font-mono text-orange-400">AFGHANISTAN</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-400" />
          <div>
            <div className="text-gray-300">DURATION</div>
            <div className="font-mono text-green-400">{MISSION_CONFIG.estimatedDuration}min</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-yellow-400" />
          <div>
            <div className="text-gray-300">ROE</div>
            <div className="font-mono text-yellow-400">WEAPONS TIGHT</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissionObjectives = () => (
    <div className="mb-6 p-4 bg-military-medium rounded-lg border border-military-accent/30">
      <h3 className="text-lg font-bold mb-3 text-military-accent">MISSION OBJECTIVES</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-300 mb-1">PRIMARY:</div>
          <div className="text-cyan-400 font-mono">{MISSION_CONFIG.primaryObjective}</div>
        </div>
        <div>
          <div className="text-gray-300 mb-1">SECONDARY:</div>
          <div className="text-cyan-400 font-mono">{MISSION_CONFIG.secondaryObjective}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-military-dark text-white p-4">
      <div className="max-w-full mx-auto">
        {/* Mission Header */}
        {renderHeader()}

        {/* Mission Objectives */}
        {renderMissionObjectives()}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
          
          {/* Map and Progress Section */}
          <div className="xl:col-span-3 space-y-6">
            {/* Tactical Map */}
            <div className="h-2/3">
              <TacticalMap 
                drones={drones}
                onDroneClick={handleDroneClick}
              />
            </div>
            
            {/* Conway Progress Visualization */}
            <div className="h-1/3">
              <ConvoyProgress 
                drones={drones}
                onDroneClick={handleDroneClick}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <DroneControlPanel
              drones={drones}
              isSimulating={isSimulating}
              selectedDrone={selectedDrone}
              stats={stats}
              simulationSpeed={simulationSpeed}
              onToggleSimulation={toggleSimulation}
              onResetSimulation={resetSimulation}
              onSelectDrone={selectDrone}
              onFocusDrone={() => {}} // Will be implemented with map focus
              onSpeedChange={setSimulationSpeed}
            />
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-6 p-3 bg-military-medium rounded-lg border border-military-accent/30">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div>
              Drone Convoy Sortie v1.0 • React + Vite + D3.js • Google Maps Integration Ready
            </div>
            <div className="flex items-center gap-4">
              <div>Simulation: <span className={isSimulating ? 'text-green-400' : 'text-red-400'}>{isSimulating ? 'ACTIVE' : 'STOPPED'}</span></div>
              <div>Speed: <span className="text-cyan-400">{simulationSpeed}x</span></div>
              <div>OpenCV: <span className="text-yellow-400">STANDBY</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;