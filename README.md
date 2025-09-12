# Drone Attack Convoy Dash
Drone Attack Tracking Convoy Geo-Grid Service using React.js with D3.j, Google Maps for React, OpenCV Tracking API and Rust. 



## Drone Attack Convoy Dash Service Overview

- 12 waypoints in Afghanistan region with GD Icons-style markers
- 4 mock attack drones with real-time simulation
- Google Maps integration (needs API key)
- Real-time status monitoring with battery, altitude, waypoint progress
- Tactical-style dark UI with military aesthetics

For phase two, the service uses OpenCV Rust API (for Drone halo tracking) and Rust Tokio Async for the server-side. Following is the  architecture.

```shell
// Cargo.toml dependencies
[dependencies]
opencv = "0.88"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
warp = "0.3"
uuid = { version = "1.0", features = ["v4"] }
```

### (1) Drone Tracking System (Rust, OpenCV)

- Real-time object detection for each drone
- Unique ID halo rendering around detected drones
- Position tracking with Kalman filtering
- Collision avoidance calculations


### (2) P2P Communication Network

- Each drone maintains peer connections
- Real-time position/status broadcasting
- Swarm coordination algorithms


### (3) Integration Points

- WebSocket connection to React frontend
- Real-time video feed processing
- GPS coordinate mapping to pixel coordinates
