import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Activity } from 'lucide-react';
import { WAYPOINTS } from '../data/seedData.js';

/**
 * D3.js convoy progress visualization component
 * @param {Object} props - Component props
 * @param {Array} props.drones - Array of drone objects
 * @param {Function} props.onDroneClick - Drone click callback
 * @returns {JSX.Element}
 */
const ConvoyProgress = ({ drones = [], onDroneClick = () => {} }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !drones.length) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width || 600;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, WAYPOINTS.length - 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, drones.length + 1])
      .range([height - margin.bottom, margin.top]);

    // Background grid
    const xAxis = d3.axisBottom(xScale)
      .ticks(WAYPOINTS.length)
      .tickFormat(d => `WP${d + 1}`);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5);

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .ticks(WAYPOINTS.length)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#4fd1c7");

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#4fd1c7");

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", "#ffffff")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", "#ffffff")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px");

    // Add axis labels
    svg.append("text")
      .attr("transform", `translate(${width/2},${height - 10})`)
      .style("text-anchor", "middle")
      .style("fill", "#4fd1c7")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("WAYPOINTS");

    svg.append("text")
      .attr("transform", `translate(15,${height/2}) rotate(-90)`)
      .style("text-anchor", "middle")
      .style("fill", "#4fd1c7")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("DRONES");

    // Waypoint markers
    WAYPOINTS.forEach((waypoint, index) => {
      svg.append("circle")
        .attr("cx", xScale(index))
        .attr("cy", height - margin.bottom)
        .attr("r", 4)
        .style("fill", "#f6ad55")
        .style("stroke", "#ffffff")
        .style("stroke-width", 2);

      // Waypoint labels
      svg.append("text")
        .attr("x", xScale(index))
        .attr("y", height - margin.bottom + 20)
        .style("text-anchor", "middle")
        .style("fill", "#f6ad55")
        .style("font-family", "JetBrains Mono, monospace")
        .style("font-size", "8px")
        .text(waypoint.name);
    });

    // Drone progress visualization
    drones.forEach((drone, droneIndex) => {
      const yPosition = yScale(droneIndex + 1);
      
      // Get drone color based on status
      const droneColor = drone.status === 'online' ? '#68d391' : 
                        drone.status === 'warning' ? '#f6ad55' : '#fc8181';

      // Draw progress line
      const progressData = [];
      for (let i = 0; i <= drone.currentWaypoint; i++) {
        const progress = i === drone.currentWaypoint ? drone.progress : 1;
        progressData.push({
          waypoint: i + progress,
          y: yPosition
        });
      }

      if (progressData.length > 0) {
        const line = d3.line()
          .x(d => xScale(d.waypoint))
          .y(d => d.y)
          .curve(d3.curveMonotoneX);

        // Background line (full route)
        svg.append("path")
          .datum([{waypoint: 0, y: yPosition}, {waypoint: WAYPOINTS.length - 1, y: yPosition}])
          .attr("d", line)
          .style("stroke", "#2d3748")
          .style("stroke-width", 2)
          .style("fill", "none")
          .style("opacity", 0.5);

        // Progress line
        svg.append("path")
          .datum(progressData)
          .attr("d", line)
          .style("stroke", droneColor)
          .style("stroke-width", 3)
          .style("fill", "none")
          .style("opacity", 0.8)
          .attr("class", "progress-line");

        // Current position marker
        const currentPosition = drone.currentWaypoint + drone.progress;
        svg.append("circle")
          .attr("cx", xScale(currentPosition))
          .attr("cy", yPosition)
          .attr("r", 6)
          .style("fill", droneColor)
          .style("stroke", "#ffffff")
          .style("stroke-width", 2)
          .style("cursor", "pointer")
          .on("click", () => onDroneClick(drone))
          .on("mouseover", function() {
            d3.select(this).attr("r", 8);
            
            // Show tooltip
            const tooltip = svg.append("g")
              .attr("class", "tooltip");
            
            const rect = tooltip.append("rect")
              .attr("x", xScale(currentPosition) + 10)
              .attr("y", yPosition - 30)
              .attr("width", 120)
              .attr("height", 50)
              .attr("rx", 4)
              .style("fill", "#1a202c")
              .style("stroke", droneColor)
              .style("stroke-width", 1);

            tooltip.append("text")
              .attr("x", xScale(currentPosition) + 15)
              .attr("y", yPosition - 15)
              .style("fill", droneColor)
              .style("font-family", "JetBrains Mono, monospace")
              .style("font-size", "10px")
              .style("font-weight", "bold")
              .text(drone.id);

            tooltip.append("text")
              .attr("x", xScale(currentPosition) + 15)
              .attr("y", yPosition - 5)
              .style("fill", "#ffffff")
              .style("font-family", "JetBrains Mono, monospace")
              .style("font-size", "8px")
              .text(`${drone.callsign}`);

            tooltip.append("text")
              .attr("x", xScale(currentPosition) + 15)
              .attr("y", yPosition + 5)
              .style("fill", "#ffffff")
              .style("font-family", "JetBrains Mono, monospace")
              .style("font-size", "8px")
              .text(`WP${drone.currentWaypoint + 1} ${(drone.progress * 100).toFixed(0)}%`);
          })
          .on("mouseout", function() {
            d3.select(this).attr("r", 6);
            svg.select(".tooltip").remove();
          });

        // Drone ID label
        svg.append("text")
          .attr("x", margin.left - 5)
          .attr("y", yPosition + 3)
          .style("text-anchor", "end")
          .style("fill", droneColor)
          .style("font-family", "JetBrains Mono, monospace")
          .style("font-size", "9px")
          .style("font-weight", "bold")
          .text(drone.id);

        // Status indicator
        svg.append("circle")
          .attr("cx", margin.left - 15)
          .attr("cy", yPosition)
          .attr("r", 3)
          .style("fill", droneColor)
          .style("stroke", "#ffffff")
          .style("stroke-width", 1);
      }
    });

    // Add mission progress indicator
    const avgProgress = drones.reduce((sum, drone) => {
      return sum + (drone.currentWaypoint + drone.progress) / WAYPOINTS.length;
    }, 0) / drones.length;

    svg.append("line")
      .attr("x1", xScale(avgProgress * (WAYPOINTS.length - 1)))
      .attr("y1", margin.top)
      .attr("x2", xScale(avgProgress * (WAYPOINTS.length - 1)))
      .attr("y2", height - margin.bottom)
      .style("stroke", "#4fd1c7")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5")
      .style("opacity", 0.7);

    svg.append("text")
      .attr("x", xScale(avgProgress * (WAYPOINTS.length - 1)))
      .attr("y", margin.top - 10)
      .style("text-anchor", "middle")
      .style("fill", "#4fd1c7")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(`AVG: ${(avgProgress * 100).toFixed(0)}%`);

  }, [drones, onDroneClick]);

  return (
    <div className="bg-military-medium rounded-lg p-4 border border-military-accent/30">
      <h3 className="text-lg font-bold mb-4 text-military-accent flex items-center gap-2">
        <Activity className="w-5 h-5" />
        CONVOY PROGRESS ANALYSIS
      </h3>
      
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full"></svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-gray-300">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-gray-300">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span className="text-gray-300">Offline</span>
        </div>
      </div>
    </div>
  );
};

export default ConvoyProgress;