import { useEffect, useRef, useState } from 'react';
import { 
  getWaypointMarkerConfig, 
  getDroneMarkerConfig, 
  createMarkerOptions,
  createWaypointPath,
  createWaypointInfoWindow,
  createDroneInfoWindow,
  TACTICAL_MAP_STYLE
} from '../utils/mapUtils.js';
import { calculateDronePosition } from '../kit/droneKit.js';
import { AFGHANISTAN_CENTER, WAYPOINTS } from '../data/seedData.js';

/**
 * Custom hook for managing Google Maps integration
 * @param {Array} drones - Array of drone objects
 * @param {Function} onDroneClick - Callback when drone marker is clicked
 * @returns {Object} - Map state and references
 */
export const useGoogleMaps = (drones = [], onDroneClick = () => {}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({
    waypoints: [],
    drones: [],
    path: null
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Check if Google Maps is loaded
        if (!window.google || !window.google.maps) {
          setMapError('Google Maps API not loaded');
          return;
        }

        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: AFGHANISTAN_CENTER,
          zoom: 13,
          mapTypeId: 'hybrid', // Satellite with labels
          styles: TACTICAL_MAP_STYLE,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.TOP_CENTER,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
          }
        });

        mapInstanceRef.current = map;

        // Create waypoint markers
        createWaypointMarkers(map);
        
        // Create path between waypoints
        createWaypointPath(map);

        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(error.message);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      clearAllMarkers();
    };
  }, []);

  // Update drone markers when drones change
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      updateDroneMarkers();
    }
  }, [drones, isMapLoaded]);

  const createWaypointMarkers = (map) => {
    // Clear existing waypoint markers
    markersRef.current.waypoints.forEach(marker => marker.setMap(null));
    markersRef.current.waypoints = [];

    WAYPOINTS.forEach((waypoint, index) => {
      const config = getWaypointMarkerConfig(waypoint.type);
      const markerOptions = createMarkerOptions(
        config, 
        { lat: waypoint.lat, lng: waypoint.lng },
        `${waypoint.name} (WP${index + 1})`
      );

      const marker = new window.google.maps.Marker({
        ...markerOptions,
        map
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: createWaypointInfoWindow(waypoint)
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.waypoints.forEach(m => {
          if (m.infoWindow) m.infoWindow.close();
        });
        infoWindow.open(map, marker);
      });

      marker.infoWindow = infoWindow;
      markersRef.current.waypoints.push(marker);
    });
  };

  const createWaypointPath = (map) => {
    // Remove existing path
    if (markersRef.current.path) {
      markersRef.current.path.setMap(null);
    }

    // Create new path
    const pathOptions = createWaypointPath(WAYPOINTS);
    const path = new window.google.maps.Polyline({
      ...pathOptions,
      map
    });

    markersRef.current.path = path;
  };

  const updateDroneMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing drone markers
    markersRef.current.drones.forEach(marker => marker.setMap(null));
    markersRef.current.drones = [];

    drones.forEach(drone => {
      const position = calculateDronePosition(drone);
      const config = getDroneMarkerConfig(drone.status);
      const markerOptions = createMarkerOptions(
        config,
        position,
        `${drone.id} - ${drone.callsign}`
      );

      const marker = new window.google.maps.Marker({
        ...markerOptions,
        map,
        zIndex: 1000 // Ensure drones appear above waypoints
      });

      // Add click listener
      marker.addListener('click', () => {
        onDroneClick(drone);
        
        // Show info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: createDroneInfoWindow(drone, position)
        });
        
        // Close other drone info windows
        markersRef.current.drones.forEach(m => {
          if (m.infoWindow) m.infoWindow.close();
        });
        
        infoWindow.open(map, marker);
        marker.infoWindow = infoWindow;
      });

      markersRef.current.drones.push(marker);
    });
  };

  const clearAllMarkers = () => {
    // Clear waypoint markers
    markersRef.current.waypoints.forEach(marker => {
      if (marker.infoWindow) marker.infoWindow.close();
      marker.setMap(null);
    });
    markersRef.current.waypoints = [];

    // Clear drone markers
    markersRef.current.drones.forEach(marker => {
      if (marker.infoWindow) marker.infoWindow.close();
      marker.setMap(null);
    });
    markersRef.current.drones = [];

    // Clear path
    if (markersRef.current.path) {
      markersRef.current.path.setMap(null);
      markersRef.current.path = null;
    }
  };

  const focusOnDrone = (droneId) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const drone = drones.find(d => d.id === droneId);
    if (!drone) return;

    const position = calculateDronePosition(drone);
    map.panTo(position);
    map.setZoom(15);

    // Highlight the drone marker
    const droneMarker = markersRef.current.drones.find(marker => 
      marker.getTitle().includes(droneId)
    );
    
    if (droneMarker && droneMarker.infoWindow) {
      droneMarker.infoWindow.open(map, droneMarker);
    }
  };

  const fitMapToWaypoints = () => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    const bounds = new window.google.maps.LatLngBounds();
    WAYPOINTS.forEach(wp => {
      bounds.extend(new window.google.maps.LatLng(wp.lat, wp.lng));
    });

    map.fitBounds(bounds, { padding: 50 });
  };

  const changeMapType = (mapTypeId) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    map.setMapTypeId(mapTypeId);
  };

  return {
    mapRef,
    isMapLoaded,
    mapError,
    focusOnDrone,
    fitMapToWaypoints,
    changeMapType,
    mapInstance: mapInstanceRef.current
  };
};