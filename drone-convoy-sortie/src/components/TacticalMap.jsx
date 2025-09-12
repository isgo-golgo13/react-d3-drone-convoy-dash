import React from 'react';
import { MapPin, Satellite, Map as MapIcon, Layers } from 'lucide-react';
import { useGoogleMaps } from '../hooks/useGoogleMaps.js';

/**
 * Tactical map component with Google Maps integration
 * @param {Object} props - Component props
 * @param {Array} props.drones - Array of drone objects
 * @param {Function} props.onDroneClick - Drone click callback
 * @returns {JSX.Element}
 */
const TacticalMap = ({ drones = [], onDroneClick = () => {} }) => {
  const {
    mapRef,
    isMapLoaded,
    mapError,
    focusOnDrone,
    fitMapToWaypoints,
    changeMapType
  } = useGoogleMaps(drones, onDroneClick);

  const renderMapControls = () => (
    <div className="absolute top-4 left-4 z-10 space-y-2">
      <div className="bg-military-dark/90 backdrop-blur-sm rounded-lg p-2 border border-military-accent/30">
        <div className="flex gap-1">
          <button
            onClick={() => changeMapType('hybrid')}
            className="btn-tactical p-2 rounded text-xs flex items-center gap-1 text-military-accent"
            title="Satellite View"
          >
            <Satellite className="w-3 h-3" />
          </button>
          <button
            onClick={() => changeMapType('roadmap')}
            className="btn-tactical p-2 rounded text-xs flex items-center gap-1 text-military-accent"
            title="Road Map"
          >
            <MapIcon className="w-3 h-3" />
          </button>
          <button
            onClick={() => changeMapType('terrain')}
            className="btn-tactical p-2 rounded text-xs flex items-center gap-1 text-military-accent"
            title="Terrain"
          >
            <Layers className="w-3 h-3" />
          </button>
          <button
            onClick={fitMapToWaypoints}
            className="btn-tactical p-2 rounded text-xs flex items-center gap-1 text-military-accent"
            title="Fit to Waypoints"
          >
            <MapPin className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMapStatus = () => (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="bg-military-dark/90 backdrop-blur-sm rounded-lg p-3 border border-military-accent/30">
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Map Status:</span>
            <span className={isMapLoaded ? 'text-green-400' : 'text-yellow-400'}>
              {isMapLoaded ? 'LOADED' : 'LOADING...'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">AOR:</span>
            <span className="text-cyan-400">AFGHANISTAN</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Waypoints:</span>
            <span className="text-cyan-400">12</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Assets:</span>
            <span className="text-cyan-400">{drones.length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDroneCount = () => (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-military-dark/90 backdrop-blur-sm rounded-lg p-3 border border-military-accent/30">
        <div className="text-xs space-y-1">
          <div className="text-military-accent font-bold">ACTIVE ASSETS</div>
          <div className="flex justify-between gap-4">
            <span className="text-green-400">ONLINE:</span>
            <span className="font-mono">{drones.filter(d => d.status === 'online').length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-yellow-400">WARNING:</span>
            <span className="font-mono">{drones.filter(d => d.status === 'warning').length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-red-400">OFFLINE:</span>
            <span className="font-mono">{drones.filter(d => d.status === 'offline').length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (mapError) {
    return (
      <div className="w-full h-full bg-military-medium rounded-lg border border-red-400/50 flex items-center justify-center">
        <div className="text-center p-8">
          <MapIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-400 mb-2">MAP ERROR</h3>
          <p className="text-sm text-gray-300 mb-4">{mapError}</p>
          <div className="text-xs text-gray-400 bg-military-dark p-3 rounded font-mono">
            Google Maps API key required for live map functionality.
            <br />
            Current view shows tactical overlay simulation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-military-medium rounded-lg overflow-hidden border border-military-accent/30">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full map-container"
        style={{ minHeight: '500px' }}
      >
        {!isMapLoaded && (
          <div className="flex items-center justify-center h-full bg-military-medium">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-military-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-military-accent font-bold">INITIALIZING TACTICAL MAP</div>
              <div className="text-sm text-gray-300 mt-2">Afghanistan AOR • 12 Waypoints</div>
            </div>
          </div>
        )}
      </div>

      {/* Map Overlay Controls */}
      {isMapLoaded && (
        <>
          {renderMapControls()}
          {renderMapStatus()}
          {renderDroneCount()}
        </>
      )}

      {/* Fallback Tactical Display */}
      {!window.google && (
        <div className="absolute inset-0 bg-military-dark/95 flex items-center justify-center">
          <div className="text-center p-8">
            <Satellite className="w-16 h-16 text-military-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-military-accent mb-2">TACTICAL MAP SIMULATION</h3>
            <p className="text-sm text-gray-300 mb-4">
              Google Maps API integration ready for deployment
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-military-medium p-3 rounded">
                <div className="text-military-accent font-bold">WAYPOINTS</div>
                <div className="text-gray-300">12 Strategic Points</div>
                <div className="text-gray-300">Afghanistan AOR</div>
              </div>
              <div className="bg-military-medium p-3 rounded">
                <div className="text-military-accent font-bold">ASSETS</div>
                <div className="text-green-400">{drones.filter(d => d.status === 'online').length} Online</div>
                <div className="text-yellow-400">{drones.filter(d => d.status === 'warning').length} Warning</div>
                <div className="text-red-400">{drones.filter(d => d.status === 'offline').length} Offline</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TacticalMap;