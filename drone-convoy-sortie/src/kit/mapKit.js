import { WAYPOINT_TYPES } from '../data/seedData.js';

/**
 * Get map marker configuration based on waypoint type
 * @param {string} type - Waypoint type
 * @returns {Object} - Marker configuration
 */
export const getWaypointMarkerConfig = (type) => {
  const configs = {
    [WAYPOINT_TYPES.BASE]: {
      color: '#4fd1c7',
      symbol: 'CIRCLE',
      scale: 12,
      strokeWidth: 3,
      strokeColor: '#ffffff'
    },
    [WAYPOINT_TYPES.CHECKPOINT]: {
      color: '#f6ad55',
      symbol: 'CIRCLE',
      scale: 8,
      strokeWidth: 2,
      strokeColor: '#ffffff'
    },
    [WAYPOINT_TYPES.OVERWATCH]: {
      color: '#fc8181',
      symbol: 'CIRCLE',
      scale: 10,
      strokeWidth: 2,
      strokeColor: '#ffffff'
    },
    [WAYPOINT_TYPES.CONTROL]: {
      color: '#68d391',
      symbol: 'CIRCLE',
      scale: 10,
      strokeWidth: 2,
      strokeColor: '#ffffff'
    }
  };

  return configs[type] || configs[WAYPOINT_TYPES.CHECKPOINT];
};

/**
 * Get drone marker configuration based on status
 * @param {string} status - Drone status
 * @returns {Object} - Marker configuration
 */
export const getDroneMarkerConfig = (status) => {
  const configs = {
    'online': {
      color: '#68d391',
      path: 'M0,-20 L-8,8 L0,4 L8,8 Z', // Military drone shape
      scale: 2,
      strokeColor: '#ffffff',
      strokeWidth: 1
    },
    'offline': {
      color: '#fc8181',
      path: 'M0,-20 L-8,8 L0,4 L8,8 Z',
      scale: 2,
      strokeColor: '#ffffff',
      strokeWidth: 1
    },
    'warning': {
      color: '#f6ad55',
      path: 'M0,-20 L-8,8 L0,4 L8,8 Z',
      scale: 2,
      strokeColor: '#ffffff',
      strokeWidth: 1
    }
  };

  return configs[status] || configs['offline'];
};

/**
 * Create Google Maps marker options
 * @param {Object} config - Marker configuration
 * @param {Object} position - {lat, lng}
 * @param {string} title - Marker title
 * @returns {Object} - Google Maps marker options
 */
export const createMarkerOptions = (config, position, title) => {
  if (config.symbol) {
    return {
      position,
      title,
      icon: {
        path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
        scale: config.scale,
        fillColor: config.color,
        fillOpacity: 0.8,
        strokeColor: config.strokeColor,
        strokeWeight: config.strokeWidth
      }
    };
  }

  return {
    position,
    title,
    icon: {
      path: config.path,
      scale: config.scale,
      fillColor: config.color,
      fillOpacity: 0.9,
      strokeColor: config.strokeColor,
      strokeWeight: config.strokeWidth
    }
  };
};

/**
 * Calculate map bounds for all waypoints
 * @param {Array} waypoints - Array of waypoint objects
 * @returns {Object} - Google Maps LatLngBounds
 */
export const calculateMapBounds = (waypoints) => {
  if (!window.google || !waypoints.length) return null;

  const bounds = new window.google.maps.LatLngBounds();
  waypoints.forEach(wp => {
    bounds.extend(new window.google.maps.LatLng(wp.lat, wp.lng));
  });
  
  return bounds;
};

/**
 * Create path between waypoints
 * @param {Array} waypoints - Array of waypoint objects
 * @returns {Object} - Google Maps Polyline options
 */
export const createWaypointPath = (waypoints) => {
  return {
    path: waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
    geodesic: true,
    strokeColor: '#4fd1c7',
    strokeOpacity: 0.6,
    strokeWeight: 3
  };
};

/**
 * Create info window content for waypoints
 * @param {Object} waypoint - Waypoint object
 * @returns {string} - HTML content
 */
export const createWaypointInfoWindow = (waypoint) => {
  return `
    <div style="color: #1a202c; padding: 8px; font-family: 'JetBrains Mono', monospace;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
        ${waypoint.name}
      </div>
      <div style="font-size: 12px;">
        <div>Type: ${waypoint.type.toUpperCase()}</div>
        <div>Elevation: ${waypoint.elevation}m</div>
        <div>Coords: ${waypoint.lat.toFixed(6)}°N ${waypoint.lng.toFixed(6)}°E</div>
      </div>
    </div>
  `;
};

/**
 * Create info window content for drones
 * @param {Object} drone - Drone object
 * @param {Object} position - Current position {lat, lng}
 * @returns {string} - HTML content
 */
export const createDroneInfoWindow = (drone, position) => {
  const statusColor = drone.status === 'online' ? '#68d391' : 
                     drone.status === 'warning' ? '#f6ad55' : '#fc8181';
                     
  return `
    <div style="color: #1a202c; padding: 8px; font-family: 'JetBrains Mono', monospace; min-width: 200px;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; display: flex; align-items: center;">
        <span style="width: 8px; height: 8px; background: ${statusColor}; border-radius: 50%; margin-right: 6px;"></span>
        ${drone.id}
      </div>
      <div style="font-size: 11px; line-height: 1.4;">
        <div><strong>Callsign:</strong> ${drone.callsign}</div>
        <div><strong>Status:</strong> ${drone.status.toUpperCase()}</div>
        <div><strong>Position:</strong> ${position.lat.toFixed(6)}°N ${position.lng.toFixed(6)}°E</div>
        <div><strong>Altitude:</strong> ${drone.altitude}m</div>
        <div><strong>Speed:</strong> ${drone.speed} kts</div>
        <div><strong>Battery:</strong> ${drone.battery}%</div>
        <div><strong>System Health:</strong> ${drone.systemHealth}%</div>
      </div>
    </div>
  `;
};

/**
 * Map style configuration for tactical appearance
 */
export const TACTICAL_MAP_STYLE = [
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#ffffff"}]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#000000"}, {"lightness": 13}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#144b53"}, {"lightness": 14}, {"weight": 1.4}]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{"color": "#08304b"}]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#0c4152"}, {"lightness": 5}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#0b434f"}, {"lightness": 25}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#0b3d51"}, {"lightness": 16}]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"color": "#146474"}]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": "#021019"}]
  }
];