import React from 'react';
import { 
  Battery, 
  Fuel, 
  Activity, 
  MapPin, 
  Clock, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  calculateDronePosition, 
  formatCoordinates, 
  getStatusColor, 
  getStatusTextColor,
  getSystemHealthStatus,
  calculateETA,
  checkDroneHealth
} from '../kit/droneKit.js';

/**
 * Individual drone status card component
 * @param {Object} props - Component props
 * @param {Object} props.drone - Drone object
 * @param {boolean} props.isSelected - Whether drone is selected
 * @param {Function} props.onSelect - Selection callback
 * @param {Function} props.onFocus - Focus on map callback
 * @returns {JSX.Element}
 */
const DroneStatusCard = ({ drone, isSelected, onSelect, onFocus }) => {
  const position = calculateDronePosition(drone);
  const coordinates = formatCoordinates(position);
  const healthStatus = getSystemHealthStatus(drone.systemHealth);
  const eta = calculateETA(drone);
  const droneHealth = checkDroneHealth(drone);
  
  const handleCardClick = () => {
    onSelect(drone.id);
    if (onFocus) onFocus(drone.id);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'offline':
        return <XCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getBatteryColor = (battery) => {
    if (battery > 50) return 'text-green-400';
    if (battery > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFuelColor = (fuel) => {
    if (fuel > 50) return 'text-blue-400';
    if (fuel > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div 
      className={`
        btn-tactical p-4 rounded-lg cursor-pointer transition-all duration-200 border-2
        ${isSelected 
          ? 'active border-military-accent bg-military-medium' 
          : 'border-transparent hover:border-military-accent/50'
        }
        ${droneHealth.needsAttention ? 'ring-2 ring-red-400/50' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-sm text-military-accent">
            {drone.id}
          </div>
          <div className="text-xs text-gray-300">
            {drone.callsign}
          </div>
        </div>
        <div className={`flex items-center gap-1 ${getStatusTextColor(drone.status)}`}>
          {getStatusIcon(drone.status)}
          <span className="text-xs font-medium uppercase">
            {drone.status}
          </span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)}`} />
        <div className="text-xs text-gray-300">
          WP {drone.currentWaypoint + 1}/{12} • {(drone.progress * 100).toFixed(0)}%
        </div>
      </div>

      {/* Coordinates */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <MapPin className="w-3 h-3" />
          <span className="font-mono">{coordinates}</span>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Battery */}
        <div className="flex items-center gap-1">
          <Battery className={`w-3 h-3 ${getBatteryColor(drone.battery)}`} />
          <span className={`text-xs font-mono ${getBatteryColor(drone.battery)}`}>
            {drone.battery.toFixed(0)}%
          </span>
        </div>

        {/* Fuel */}
        <div className="flex items-center gap-1">
          <Fuel className={`w-3 h-3 ${getFuelColor(drone.fuel)}`} />
          <span className={`text-xs font-mono ${getFuelColor(drone.fuel)}`}>
            {drone.fuel.toFixed(0)}%
          </span>
        </div>

        {/* System Health */}
        <div className="flex items-center gap-1">
          <Activity className={`w-3 h-3 ${healthStatus.color}`} />
          <span className={`text-xs font-mono ${healthStatus.color}`}>
            {drone.systemHealth.toFixed(0)}%
          </span>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">
            {drone.speed.toFixed(0)}kt
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Altitude:</span>
          <span className="font-mono">{drone.altitude.toFixed(0)}m</span>
        </div>
        {eta && (
          <div className="flex justify-between">
            <span>ETA Next WP:</span>
            <span className="font-mono">{eta.toFixed(1)}min</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Armament:</span>
          <span className="font-mono text-xs">{drone.armament.length}</span>
        </div>
      </div>

      {/* Health Warnings */}
      {droneHealth.needsAttention && (
        <div className="mt-3 pt-2 border-t border-red-400/30">
          <div className="flex items-center gap-1 text-red-400 mb-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">ATTENTION</span>
          </div>
          <div className="text-xs text-red-300 space-y-1">
            {droneHealth.reasons.map((reason, idx) => (
              <div key={idx}>• {reason}</div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="mt-3 pt-2 border-t border-military-accent/30">
          <div className="text-xs text-military-accent font-medium">
            ◆ SELECTED - TRACKING ACTIVE ◆
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneStatusCard;