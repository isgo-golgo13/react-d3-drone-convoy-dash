// Afghanistan region coordinates (Kabul area)
export const AFGHANISTAN_CENTER = { 
  lat: 34.5553, 
  lng: 69.2075 
};

// 12 strategic waypoints in Afghanistan region
export const WAYPOINTS = [
  { 
    id: 1, 
    lat: 34.5553, 
    lng: 69.2075, 
    name: "FOB ALPHA",
    type: "base",
    elevation: 1790
  },
  { 
    id: 2, 
    lat: 34.5623, 
    lng: 69.2145, 
    name: "CP BRAVO",
    type: "checkpoint",
    elevation: 1820
  },
  { 
    id: 3, 
    lat: 34.5693, 
    lng: 69.2215, 
    name: "OP CHARLIE",
    type: "overwatch",
    elevation: 1850
  },
  { 
    id: 4, 
    lat: 34.5763, 
    lng: 69.2285, 
    name: "RP DELTA",
    type: "rally",
    elevation: 1880
  },
  { 
    id: 5, 
    lat: 34.5833, 
    lng: 69.2355, 
    name: "OBS ECHO",
    type: "observation",
    elevation: 1910
  },
  { 
    id: 6, 
    lat: 34.5903, 
    lng: 69.2425, 
    name: "CTL FOXTROT",
    type: "control",
    elevation: 1940
  },
  { 
    id: 7, 
    lat: 34.5973, 
    lng: 69.2495, 
    name: "STG GOLF",
    type: "staging",
    elevation: 1970
  },
  { 
    id: 8, 
    lat: 34.6043, 
    lng: 69.2565, 
    name: "MON HOTEL",
    type: "monitor",
    elevation: 2000
  },
  { 
    id: 9, 
    lat: 34.6113, 
    lng: 69.2635, 
    name: "BCN INDIA",
    type: "beacon",
    elevation: 2030
  },
  { 
    id: 10, 
    lat: 34.6183, 
    lng: 69.2705, 
    name: "SIG JULIET",
    type: "signal",
    elevation: 2060
  },
  { 
    id: 11, 
    lat: 34.6253, 
    lng: 69.2775, 
    name: "WTH KILO",
    type: "watch",
    elevation: 2090
  },
  { 
    id: 12, 
    lat: 34.6323, 
    lng: 69.2845, 
    name: "TRM LIMA",
    type: "terminal",
    elevation: 2120
  }
];

// 12 Attack drones with realistic military designations
export const INITIAL_DRONES = [
  {
    id: 'REAPER-01',
    callsign: 'Predator Alpha',
    currentWaypoint: 0,
    progress: 0.0,
    status: 'online',
    battery: 87,
    altitude: 2500,
    speed: 135,
    fuel: 92,
    armament: ['Hellfire AGM-114', 'GBU-12'],
    lastUpdate: new Date(),
    systemHealth: 98
  },
  {
    id: 'REAPER-02',
    callsign: 'Predator Bravo',
    currentWaypoint: 0,
    progress: 0.15,
    status: 'online',
    battery: 92,
    altitude: 2450,
    speed: 142,
    fuel: 89,
    armament: ['Hellfire AGM-114', 'GBU-38'],
    lastUpdate: new Date(),
    systemHealth: 95
  },
  {
    id: 'REAPER-03',
    callsign: 'Predator Charlie',
    currentWaypoint: 1,
    progress: 0.35,
    status: 'online',
    battery: 78,
    altitude: 2600,
    speed: 128,
    fuel: 84,
    armament: ['Hellfire AGM-114', 'GBU-12'],
    lastUpdate: new Date(),
    systemHealth: 91
  },
  {
    id: 'REAPER-04',
    callsign: 'Predator Delta',
    currentWaypoint: 1,
    progress: 0.67,
    status: 'online',
    battery: 84,
    altitude: 2550,
    speed: 139,
    fuel: 76,
    armament: ['Hellfire AGM-114', 'GBU-38'],
    lastUpdate: new Date(),
    systemHealth: 88
  },
  {
    id: 'REAPER-05',
    callsign: 'Predator Echo',
    currentWaypoint: 2,
    progress: 0.23,
    status: 'warning',
    battery: 65,
    altitude: 2400,
    speed: 115,
    fuel: 71,
    armament: ['Hellfire AGM-114'],
    lastUpdate: new Date(),
    systemHealth: 82
  },
  {
    id: 'REAPER-06',
    callsign: 'Predator Foxtrot',
    currentWaypoint: 2,
    progress: 0.78,
    status: 'online',
    battery: 91,
    altitude: 2650,
    speed: 144,
    fuel: 88,
    armament: ['Hellfire AGM-114', 'GBU-12'],
    lastUpdate: new Date(),
    systemHealth: 96
  },
  {
    id: 'REAPER-07',
    callsign: 'Predator Golf',
    currentWaypoint: 3,
    progress: 0.12,
    status: 'online',
    battery: 79,
    altitude: 2500,
    speed: 131,
    fuel: 82,
    armament: ['Hellfire AGM-114', 'GBU-38'],
    lastUpdate: new Date(),
    systemHealth: 93
  },
  {
    id: 'REAPER-08',
    callsign: 'Predator Hotel',
    currentWaypoint: 3,
    progress: 0.56,
    status: 'offline',
    battery: 23,
    altitude: 1200,
    speed: 0,
    fuel: 15,
    armament: ['Hellfire AGM-114'],
    lastUpdate: new Date(Date.now() - 300000), // 5 minutes ago
    systemHealth: 34
  },
  {
    id: 'REAPER-09',
    callsign: 'Predator India',
    currentWaypoint: 4,
    progress: 0.41,
    status: 'online',
    battery: 86,
    altitude: 2580,
    speed: 137,
    fuel: 85,
    armament: ['Hellfire AGM-114', 'GBU-12'],
    lastUpdate: new Date(),
    systemHealth: 94
  },
  {
    id: 'REAPER-10',
    callsign: 'Predator Juliet',
    currentWaypoint: 4,
    progress: 0.89,
    status: 'online',
    battery: 73,
    altitude: 2480,
    speed: 133,
    fuel: 79,
    armament: ['Hellfire AGM-114', 'GBU-38'],
    lastUpdate: new Date(),
    systemHealth: 87
  },
  {
    id: 'REAPER-11',
    callsign: 'Predator Kilo',
    currentWaypoint: 5,
    progress: 0.67,
    status: 'warning',
    battery: 58,
    altitude: 2350,
    speed: 108,
    fuel: 62,
    armament: ['Hellfire AGM-114'],
    lastUpdate: new Date(),
    systemHealth: 76
  },
  {
    id: 'REAPER-12',
    callsign: 'Predator Lima',
    currentWaypoint: 6,
    progress: 0.34,
    status: 'online',
    battery: 94,
    altitude: 2720,
    speed: 146,
    fuel: 91,
    armament: ['Hellfire AGM-114', 'GBU-12', 'GBU-38'],
    lastUpdate: new Date(),
    systemHealth: 99
  }
];

// Mission parameters
export const MISSION_CONFIG = {
  name: "Operation Thunder Strike",
  classification: "SECRET//NOFORN",
  startTime: new Date(),
  estimatedDuration: 240, // minutes
  commandFrequency: "142.750 MHz",
  primaryObjective: "Convoy escort and area reconnaissance",
  secondaryObjective: "Target identification and engagement",
  rules_of_engagement: "Weapons tight - positive ID required"
};

// Drone status types
export const DRONE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline', 
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance'
};

// Waypoint types
export const WAYPOINT_TYPES = {
  BASE: 'base',
  CHECKPOINT: 'checkpoint',
  OVERWATCH: 'overwatch', 
  RALLY: 'rally',
  OBSERVATION: 'observation',
  CONTROL: 'control',
  STAGING: 'staging',
  MONITOR: 'monitor',
  BEACON: 'beacon',
  SIGNAL: 'signal',
  WATCH: 'watch',
  TERMINAL: 'terminal'
};