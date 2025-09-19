import React, { useEffect, useRef, useState } from 'react';

const TacticalMap = ({ drones, waypoints }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const droneMarkersRef = useRef({});
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps loaded successfully');
      setGoogleLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps');
    };
    
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && !window.google) {
        existingScript.remove();
      }
    };
  }, []);

  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!googleLoaded || !mapRef.current || mapInstanceRef.current) return;

    console.log('Initializing Google Map...');
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 34.5553, lng: 69.2075 }, // Afghanistan center
      zoom: 12,
      mapTypeId: 'satellite',
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#00ff00" }]
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#000000" }, { lightness: 13 }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0a4f3c" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#1a1a1a" }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT
      }
    });

    mapInstanceRef.current = map;

    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: waypoint.lat, lng: waypoint.lng },
        map: map,
        title: waypoint.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ff6b35',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          anchor: new window.google.maps.Point(0, 0)
        },
        zIndex: 1
      });

      // Add waypoint label
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            background: rgba(0,0,0,0.9); 
            color: #00ff00; 
            padding: 8px; 
            border: 1px solid #00ff00;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            min-width: 150px;
          ">
            <strong>${waypoint.name}</strong><br/>
            WP-${String(index + 1).padStart(2, '0')}<br/>
            ${waypoint.lat.toFixed(4)}, ${waypoint.lng.toFixed(4)}
          </div>
        `,
        disableAutoPan: true
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

  }, [googleLoaded, waypoints]);

  // Update drone positions
  useEffect(() => {
    if (!mapInstanceRef.current || !googleLoaded) return;

    drones.forEach(drone => {
      // Calculate drone position based on waypoint progress
      const currentWP = waypoints[drone.currentWaypoint];
      const nextWP = waypoints[Math.min(drone.currentWaypoint + 1, waypoints.length - 1)];
      
      if (currentWP && nextWP) {
        const lat = currentWP.lat + (nextWP.lat - currentWP.lat) * drone.progress;
        const lng = currentWP.lng + (nextWP.lng - currentWP.lng) * drone.progress;

        // Update or create drone marker
        if (droneMarkersRef.current[drone.id]) {
          droneMarkersRef.current[drone.id].setPosition({ lat, lng });
          droneMarkersRef.current[drone.id].setIcon({
            path: 'M0,-20 L-10,10 L0,5 L10,10 Z',
            scale: 1.5,
            fillColor: drone.status === 'online' ? '#00ff00' : '#ff0000',
            fillOpacity: 0.9,
            strokeColor: '#000000',
            strokeWeight: 1,
            rotation: 45,
            anchor: new window.google.maps.Point(0, 0)
          });
        } else {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: drone.callsign,
            icon: {
              path: 'M0,-20 L-10,10 L0,5 L10,10 Z',
              scale: 1.5,
              fillColor: drone.status === 'online' ? '#00ff00' : '#ff0000',
              fillOpacity: 0.9,
              strokeColor: '#000000',
              strokeWeight: 1,
              rotation: 45,
              anchor: new window.google.maps.Point(0, 0)
            },
            zIndex: 100
          });

          // Add click handler for drone info
          marker.addListener('click', () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="
                  background: rgba(0,0,0,0.95); 
                  color: #00ff00; 
                  padding: 10px; 
                  border: 1px solid #00ff00;
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 11px;
                  min-width: 200px;
                ">
                  <strong style="color: #ff6b35">${drone.callsign}</strong><br/>
                  <hr style="border-color: #00ff00; opacity: 0.3; margin: 5px 0;"/>
                  Status: <span style="color: ${drone.status === 'online' ? '#00ff00' : '#ff0000'}">${drone.status.toUpperCase()}</span><br/>
                  Battery: ${drone.battery.toFixed(0)}%<br/>
                  Altitude: ${drone.altitude.toFixed(0)}m<br/>
                  Speed: ${drone.speed.toFixed(0)} km/h<br/>
                  Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br/>
                  Waypoint: ${drone.currentWaypoint + 1}/${waypoints.length}
                </div>
              `
            });
            infoWindow.open(mapInstanceRef.current, marker);
          });

          droneMarkersRef.current[drone.id] = marker;
        }

        // Update drone's lat/lng
        drone.lat = lat;
        drone.lng = lng;
      }
    });
  }, [drones, waypoints, googleLoaded]);

  if (!googleLoaded) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-500 font-mono">Loading Tactical Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-green-500 px-4 py-2 rounded-lg font-mono text-sm border border-green-500/50">
        TACTICAL OPS - AFGHANISTAN THEATER
      </div>
    </div>
  );
};

export default TacticalMap;