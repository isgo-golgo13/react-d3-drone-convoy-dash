import { useState, useEffect, useCallback } from 'react';
import { INITIAL_DRONES, WAYPOINTS } from '../data/seedData.js';

/**
 * Custom hook for managing drone simulation
 * @returns {Object} - Drone simulation state and controls
 */
export const useDroneSimulation = () => {
  const [drones, setDrones] = useState(INITIAL_DRONES);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [missionStartTime] = useState(new Date());

  // Update drone positions and status
  const updateDronePositions = useCallback(() => {
    setDrones(prevDrones => 
      prevDrones.map(drone => {
        // Skip if drone is at final waypoint
        if (drone.currentWaypoint >= WAYPOINTS.length - 1) {
          return drone;
        }

        // Skip offline drones
        if (drone.status === 'offline') {
          return drone;
        }

        // Calculate progress increment based on drone speed and simulation speed
        const baseIncrement = 0.01; // Base movement per update
        const speedMultiplier = (drone.speed / 135) * simulationSpeed; // Normalize against avg speed
        const progressIncrement = baseIncrement * speedMultiplier;

        let newProgress = drone.progress + progressIncrement;
        let newWaypoint = drone.currentWaypoint;
        let newStatus = drone.status;

        // Check if reached next waypoint
        if (newProgress >= 1) {
          newProgress = 0;
          newWaypoint = Math.min(drone.currentWaypoint + 1, WAYPOINTS.length - 1);
          
          // Simulate occasional status changes at waypoints
          if (Math.random() < 0.05 && drone.status === 'online') {
            newStatus = Math.random() < 0.7 ? 'online' : 'warning';
          }
        }

        // Simulate battery drain and fuel consumption
        const batteryDrain = 0.02 * simulationSpeed;
        const fuelConsumption = 0.03 * simulationSpeed;
        const newBattery = Math.max(0, drone.battery - batteryDrain);
        const newFuel = Math.max(0, drone.fuel - fuelConsumption);

        // Update system health based on various factors
        let healthChange = 0;
        if (newBattery < 20) healthChange -= 0.1;
        if (newFuel < 15) healthChange -= 0.1;
        if (drone.status === 'warning') healthChange -= 0.05;
        
        // Gradual health recovery when conditions are good
        if (newBattery > 50 && newFuel > 50 && drone.status === 'online') {
          healthChange += 0.02;
        }

        const newSystemHealth = Math.max(0, Math.min(100, drone.systemHealth + healthChange));

        // Determine status based on system conditions
        if (newBattery < 10 || newFuel < 5 || newSystemHealth < 30) {
          newStatus = 'offline';
        } else if (newBattery < 30 || newFuel < 20 || newSystemHealth < 60) {
          newStatus = 'warning';
        } else if (drone.status !== 'offline') {
          newStatus = 'online';
        }

        // Simulate speed variations based on conditions
        let newSpeed = drone.speed;
        if (newStatus === 'warning') {
          newSpeed = Math.max(80, drone.speed * 0.95);
        } else if (newStatus === 'offline') {
          newSpeed = 0;
        } else {
          // Random speed variation ±5%
          newSpeed = drone.speed + (Math.random() - 0.5) * 10;
          newSpeed = Math.max(100, Math.min(150, newSpeed));
        }

        return {
          ...drone,
          progress: newProgress,
          currentWaypoint: newWaypoint,
          status: newStatus,
          battery: newBattery,
          fuel: newFuel,
          systemHealth: newSystemHealth,
          speed: newSpeed,
          lastUpdate: new Date(),
          // Simulate slight altitude variations
          altitude: drone.altitude + (Math.random() - 0.5) * 50
        };
      })
    );
  }, [simulationSpeed]);

  // Simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(updateDronePositions, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [isSimulating, updateDronePositions]);

  // Auto-update selected drone info
  useEffect(() => {
    if (selectedDrone) {
      const updatedDrone = drones.find(d => d.id === selectedDrone.id);
      if (updatedDrone) {
        setSelectedDrone(updatedDrone);
      }
    }
  }, [drones, selectedDrone]);

  // Control functions
  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setDrones(INITIAL_DRONES);
    setSelectedDrone(null);
  }, []);

  const selectDrone = useCallback((droneId) => {
    const drone = drones.find(d => d.id === droneId);
    setSelectedDrone(drone || null);
  }, [drones]);

  const updateDroneStatus = useCallback((droneId, newStatus) => {
    setDrones(prevDrones =>
      prevDrones.map(drone =>
        drone.id === droneId
          ? { ...drone, status: newStatus, lastUpdate: new Date() }
          : drone
      )
    );
  }, []);

  // Statistics
  const getSimulationStats = useCallback(() => {
    const onlineCount = drones.filter(d => d.status === 'online').length;
    const offlineCount = drones.filter(d => d.status === 'offline').length;
    const warningCount = drones.filter(d => d.status === 'warning').length;
    
    const avgBattery = drones.reduce((sum, d) => sum + d.battery, 0) / drones.length;
    const avgFuel = drones.reduce((sum, d) => sum + d.fuel, 0) / drones.length;
    const avgHealth = drones.reduce((sum, d) => sum + d.systemHealth, 0) / drones.length;
    
    const completedWaypoints = drones.filter(d => d.currentWaypoint >= WAYPOINTS.length - 1).length;
    const totalProgress = drones.reduce((sum, d) => {
      return sum + (d.currentWaypoint + d.progress) / WAYPOINTS.length;
    }, 0) / drones.length;

    return {
      onlineCount,
      offlineCount,
      warningCount,
      avgBattery: Math.round(avgBattery),
      avgFuel: Math.round(avgFuel),
      avgHealth: Math.round(avgHealth),
      completedWaypoints,
      totalProgress: Math.round(totalProgress * 100),
      missionTime: Math.floor((new Date() - missionStartTime) / 60000) // minutes
    };
  }, [drones, missionStartTime]);

  return {
    // State
    drones,
    isSimulating,
    selectedDrone,
    simulationSpeed,
    missionStartTime,
    
    // Actions
    startSimulation,
    stopSimulation,
    toggleSimulation,
    resetSimulation,
    selectDrone,
    updateDroneStatus,
    setSimulationSpeed,
    
    // Computed
    stats: getSimulationStats()
  };
};