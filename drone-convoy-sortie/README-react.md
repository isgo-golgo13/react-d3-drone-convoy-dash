# Drone Convoy Sortie

A tactical drone convoy management dashboard built with React, Vite, D3.js, and Google Maps API. Features real-time simulation, tactical mapping, and preparation for OpenCV integration.

![Drone Convoy Sortie](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646cff.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### Phase 1: Frontend Dashboard (Current)
- **12-Drone Convoy Management**: Real-time status monitoring for attack drones
- **Tactical Mapping**: Google Maps integration with Afghanistan waypoints
- **D3.js Visualizations**: Real-time progress tracking and analytics
- **Live Simulation**: Configurable speed simulation with battery, fuel, and system health
- **Interactive Controls**: Shadowed depth buttons with military-grade UI
- **📡 Status Monitoring**: Online/offline status with detailed telemetry
- **Military Aesthetics**: Dark tactical theme with glitch effects

### Phase 2: OpenCV Integration (Planned)
- **Computer Vision**: Rust backend with OpenCV drone tracking
- **Object Detection**: Real-time halo identification around drones
- **P2P Network**: Peer-to-peer drone communication system
- **Video Processing**: Live camera feed integration
- **ID Tagging**: Unique identifier halos for each drone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Maps API key (optional, works without)

### Method 1: Docker Compose (Recommended)
```bash
# Clone and setup
git clone <repo-url>
cd drone-convoy-sortie

# Quick production start
make quick-start
# App available at http://localhost:8080

# Or development mode
make quick-dev
# App available at http://localhost:5173
```

### Method 2: Manual Setup
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm run preview
```

## Development Commands

```bash
# Start development server
make dev

# Start with Docker (hot reload)
make dev-docker

# Production deployment
make prod-up

# View logs
make logs

# Clean everything
make clean
```

## 🏗️ Project Structure

```
drone-convoy-sortie/
├── src/
│   ├── components/           # React components
│   │   ├── DroneStatusPanel.jsx    # Right-side control panel
│   │   ├── TacticalMap.jsx          # Google Maps integration
│   │   ├── ConvoyProgress.jsx       # D3.js visualizations
│   │   └── DroneStatusCard.jsx      # Individual drone cards
│   ├── hooks/                # Custom React hooks
│   │   ├── useDroneSimulation.js    # Simulation logic
│   │   └── useGoogleMaps.js         # Maps integration
│   ├── kit/                # Utility functions
│   │   ├── droneKit.js            # Drone calculations
│   │   └── mapKit.js              # Map helpers
│   ├── data/                 # Mock data and constants
│   │   └── mockData.js              # Drone & waypoint data
│   ├── App.jsx               # Main application
│   ├── main.jsx              # React entry point
│   └── index.css             # Tactical styling
├── public/
│   └── index.html            # HTML template
├── docker-compose.yml        # Container orchestration
├── Dockerfile               # Production container
├── Makefile                 # Development commands
└── README.md                # This file
```

## 🎮 Usage Guide

### Starting the Application
1. **Launch**: Run `make quick-start` or access via Docker
2. **Mission Control**: View the tactical header with mission parameters
3. **Map Interface**: Interactive Google Maps with waypoints and drones
4. **Control Panel**: Right-side panel with drone management

### Control Panel Features
- **Mission Status**: Real-time statistics and health monitoring
- **Simulation Controls**: Start/stop/reset with speed adjustment
- **Drone Selection**: Click any drone card to view detailed telemetry
- **Individual Drone Cards**: 
  - Current coordinates (lat/lng)
  - Online/offline status with colored indicators
  - Battery, fuel, altitude, and system health
  - Armament and mission progress
  - Warning indicators for attention-needed conditions

### Interactive Features
- **Drone Selection**: Click drone cards or map markers to focus
- **Real-time Updates**: Live telemetry with 2Hz update rate
- **Status Indicators**: Color-coded status (Green=Online, Yellow=Warning, Red=Offline)
- **Progress Tracking**: D3.js convoy progress visualization
- **Speed Control**: Adjustable simulation speed (0.1x to 5x)

## 🗺️ Map Integration

### Google Maps Setup
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Update `public/index.html`:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry,drawing"></script>
   ```

### Map Features
- **Satellite View**: High-resolution Afghanistan region imagery
- **12 Waypoints**: Strategic military positions with tactical names
- **Drone Tracking**: Real-time position updates with status indicators
- **Flight Paths**: Visual convoy routes between waypoints
- **Info Windows**: Detailed information on click

## 🎨 UI/UX Design

### Military Aesthetic
- **Dark Theme**: Military-grade color scheme with tactical greens and cyans
- **Glitch Effects**: Subtle animations on headers
- **Shadowed Buttons**: Tactical depth with neumorphism
- **Status Indicators**: Color-coded health and connectivity status
- **Monospace Fonts**: JetBrains Mono for technical readability

### Responsive Design
- **Grid Layout**: Adaptive layout for different screen sizes
- **Mobile Ready**: Touch-friendly controls and responsive breakpoints
- **Performance**: Optimized rendering and smooth animations

## ⚙️ Configuration

### Environment Variables
```bash
# .env file
GOOGLE_MAPS_API_KEY=your_api_key_here
REACT_APP_VERSION=1.0.0
NODE_ENV=production
```

### Docker Configuration
- **Production**: Nginx-served optimized build
- **Development**: Hot reload with volume mounting
- **Health Checks**: Built-in service monitoring
- **Multi-stage**: Optimized image sizes

## 📊 Technical Specifications

### Performance
- **React 18**: Latest React with concurrent features
- **Vite**: Lightning-fast build tool and dev server  
- **D3.js v7**: High-performance data visualizations
- **60 FPS**: Smooth animations and real-time updates

### Architecture
- **Component-based**: Modular React architecture
- **Custom Hooks**: Reusable logic encapsulation
- **State Management**: React hooks for local state
- **Real-time Simulation**: Configurable update intervals

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+
- **WebGL**: Hardware-accelerated graphics
- **Responsive**: Mobile and desktop compatibility

## 🚀 Phase 2: OpenCV Integration

### Planned Architecture
```bash
# Future backend structure
backend/
├── src/
│   ├── main.rs              # Rust entry point
│   ├── opencv/              # Computer vision modules
│   ├── tracking/            # Drone tracking algorithms
│   ├── websocket/           # Real-time communication
│   └── p2p/                 # Peer-to-peer networking
├── Cargo.toml               # Rust dependencies
└── docker/                  # Backend containers
```

### OpenCV Features (Phase 2)
- **Real-time Detection**: Live camera feed processing
- **Halo Tracking**: Circular identification markers
- **ID Association**: Unique tags for each drone
- **Position Mapping**: GPS to pixel coordinate transformation
- **Multi-drone Tracking**: Simultaneous object detection

### Integration Points
- **WebSocket Bridge**: Real-time data streaming
- **REST API**: Configuration and status endpoints  
- **Docker Network**: Containerized service communication
- **Redis**: Real-time data caching and pub/sub

## 🧪 Testing

### Current Testing
```bash
# Linting
make lint

# Code formatting
make format

# Manual testing
make test
```

### Future Testing (Phase 2)
- Unit tests for drone utilities
- Integration tests for map components
- E2E testing with Cypress
- OpenCV algorithm validation

## 📈 Monitoring

### Built-in Monitoring
- **Health Checks**: Container and service health
- **Performance Metrics**: Real-time FPS and update rates
- **Error Handling**: Graceful degradation and recovery
- **Logging**: Structured application logs

### Development Tools
```bash
# Watch logs in real-time
make watch-logs

# Monitor container resources
make monitor

# Check service health
make health
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

## 📝 License

MIT License - see LICENSE file for details.

## Support

### Getting Help
- **Issues**: GitHub issues for bugs and feature requests
- **Discussions**: GitHub discussions for questions
- **Documentation**: Inline code comments and JSDoc

### Common Issues
1. **Maps not loading**: Check Google Maps API key configuration
2. **Docker issues**: Ensure Docker daemon is running
3. **Port conflicts**: Check if ports 8080/5173 are available
4. **Permission errors**: Ensure proper file permissions on Linux/Mac

---

**🎯 Mission Status: Phase 1 Complete • Phase 2 OpenCV Integration Ready for Development**

*Built with ⚡ by the Tactical Systems Team*