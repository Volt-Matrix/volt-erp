import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/Equipment.css';
 
// Equipment sample data
const data = {
  stats: { total: 47, available: 28, inUse: 15, maintenance: 4 },
  alerts: [
    { id: 1, equipment: "Excavator #EX1290", issue: "Hydraulic fluid leak - Service required", severity: "Urgent" },
    { id: 2, equipment: "Bulldozer #BD8872", issue: "Engine overheating - Inspection needed", severity: "Urgent" },
    { id: 3, equipment: "Crane #CR4429", issue: "Regular maintenance due in 3 days", severity: "Soon" },
    { id: 4, equipment: "Loader #LD3387", issue: "Transmission issues - Immediate attention", severity: "Urgent" }
  ],
  equipment: [
    { id: "EX1290", name: "Excavator", model: "CAT 336", status: "Maintenance", lastMaintenance: "2023-02-15", fuelLevel: 45, location: "Site A - North Section" },
    { id: "BD8872", name: "Bulldozer", model: "Komatsu D61", status: "Maintenance", lastMaintenance: "2023-03-01", fuelLevel: 12, location: "Site A - West Section" },
    { id: "CR4429", name: "Crane", model: "Liebherr LTM 1200", status: "Available", lastMaintenance: "2023-04-10", fuelLevel: 78, location: "Site B - Main Area" },
    { id: "LD3387", name: "Loader", model: "John Deere 544", status: "Maintenance", lastMaintenance: "2023-03-25", fuelLevel: 35, location: "Site C - Southeast" },
    { id: "TR5578", name: "Truck", model: "Volvo FH16", status: "In Use", lastMaintenance: "2023-04-02", fuelLevel: 65, location: "In Transit - Road B" }
  ],
  fuel: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [2200, 2350, 2400, 2300, 2500, 2650]
  },
  locations: [
    { id: "EX1290", x: 25, y: 30, label: "EX", status: "Maintenance" },
    { id: "BD8872", x: 40, y: 60, label: "BD", status: "Maintenance" },
    { id: "CR4429", x: 70, y: 40, label: "CR", status: "Available" },
    { id: "LD3387", x: 65, y: 70, label: "LD", status: "Maintenance" },
    { id: "TR5578", x: 45, y: 20, label: "TR", status: "In Use" }
  ]
};
 
const Equipment = () => {
  // State
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(data.equipment);
 
  // Refs for canvas elements
  const statusRef = useRef(null);
  const fuelRef = useRef(null);
  const mapRef = useRef(null);
 
  // Filter equipment based on search term and filter type
  useEffect(() => {
    let result = data.equipment;
   
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(item =>
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
      );
    }
   
    if (filter !== "All") {
      result = result.filter(item =>
        item.name === filter ||
        (filter === "Maintenance" && item.status === "Maintenance") ||
        (filter === "Available" && item.status === "Available") ||
        (filter === "In Use" && item.status === "In Use")
      );
    }
   
    setFiltered(result);
  }, [search, filter]);
 
  // Draw equipment status chart
  useEffect(() => {
    if (!statusRef.current) return;
   
    const ctx = statusRef.current.getContext("2d");
    const width = statusRef.current.width;
    const height = statusRef.current.height;
   
    ctx.clearRect(0, 0, width, height);
   
    const { available, inUse, maintenance } = data.stats;
    const total = available + inUse + maintenance;
   
    const barWidth = width * 0.8;
    const barHeight = 30;
    const startX = width * 0.1;
    const startY = height * 0.3;
    const gap = 15;
   
    // Available bar
    const availableWidth = (available / total) * barWidth;
    ctx.fillStyle = "#10B981";
    ctx.fillRect(startX, startY, availableWidth, barHeight);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`Available: ${available}`, startX + availableWidth / 2 - 40, startY + barHeight / 2 + 4);
   
    // In Use bar
    const inUseWidth = (inUse / total) * barWidth;
    ctx.fillStyle = "#3B82F6";
    ctx.fillRect(startX, startY + barHeight + gap, inUseWidth, barHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(`In Use: ${inUse}`, startX + inUseWidth / 2 - 30, startY + barHeight + gap + barHeight / 2 + 4);
   
    // Maintenance bar
    const maintenanceWidth = (maintenance / total) * barWidth;
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(startX, startY + 2 * (barHeight + gap), maintenanceWidth, barHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(`Maintenance: ${maintenance}`, startX + maintenanceWidth / 2 + 20, startY + 2 * (barHeight + gap) + barHeight / 2 + 4);
  }, [statusRef]);
 
  // Draw fuel consumption chart
  useEffect(() => {
    if (!fuelRef.current) return;
   
    const ctx = fuelRef.current.getContext("2d");
    const width = fuelRef.current.width;
    const height = fuelRef.current.height;
   
    ctx.clearRect(0, 0, width, height);
   
    const { labels, data: fuelData } = data.fuel;
   
    // Find max value for scaling
    const maxValue = Math.max(...fuelData) * 1.1;
   
    // Calculate points
    const pointGap = width / (labels.length - 1);
    const points = fuelData.map((value, index) => ({
      x: index * pointGap,
      y: height - (value / maxValue) * (height * 0.8)
    }));
   
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#CBD5E1";
    ctx.moveTo(0, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();
   
    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;
    ctx.stroke();
   
    // Draw points
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6";
      ctx.fill();
     
      // Add labels
      ctx.fillStyle = "#64748B";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], point.x, height - 5);
      ctx.fillText(fuelData[index].toString(), point.x, point.y - 10);
    });
   
    ctx.fillStyle = "#334155";
    ctx.font = "12px Arial bold";
    ctx.textAlign = "left";
    ctx.fillText("Fuel Consumption (liters)", 10, 20);
  }, [fuelRef]);
 
  // Draw equipment location map
  useEffect(() => {
    if (!mapRef.current) return;
   
    const ctx = mapRef.current.getContext("2d");
    const width = mapRef.current.width;
    const height = mapRef.current.height;
   
    ctx.clearRect(0, 0, width, height);
   
    // Draw map background
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, width, height);
   
    // Draw grid
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
   
    // Grid lines
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
   
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
   
    // Draw site locations
    const drawSite = (x, y, name) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(203, 213, 225, 0.4)";
      ctx.fill();
      ctx.fillStyle = "#64748B";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(name, x, y + 4);
    };
   
    drawSite(width * 0.2, height * 0.3, "Site A");
    drawSite(width * 0.7, height * 0.4, "Site B");
    drawSite(width * 0.6, height * 0.7, "Site C");
   
    // Draw roads
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.5);
    ctx.stroke();
   
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.lineTo(width * 0.5, height);
    ctx.stroke();
   
    // Draw equipment locations
    data.locations.forEach(item => {
      const color = item.status === "Available" ? "#10B981" :
                    item.status === "Maintenance" ? "#EF4444" : "#3B82F6";
     
      const x = width * (item.x / 100);
      const y = height * (item.y / 100);
     
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
     
      ctx.fillStyle = "white";
      ctx.font = "10px Arial bold";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x, y + 3);
    });
  }, [mapRef]);
 
  return (
    <div>
      {/* Header */}
      <div className="header-eq">
        <h1>Equipment Dashboard</h1>
        <div className="filter-container">
          <div className="filter">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Equipment</option>
              <option value="Excavator">Excavators</option>
              <option value="Bulldozer">Bulldozers</option>
              <option value="Crane">Cranes</option>
              <option value="Truck">Trucks</option>
              <option value="Loader">Loaders</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
 
      {/* Status Cards */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-icon total">🔢</div>
          <div className="status-details">
            <h3>Total Equipment</h3>
            <div className="status-value">{data.stats.total}</div>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon available">✓</div>
          <div className="status-details">
            <h3>Available</h3>
            <div className="status-value green">{data.stats.available}</div>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon in-use">⚙️</div>
          <div className="status-details">
            <h3>In Use</h3>
            <div className="status-value blue">{data.stats.inUse}</div>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon maintenance">🔧</div>
          <div className="status-details">
            <h3>Maintenance</h3>
            <div className="status-value red">{data.stats.maintenance}</div>
          </div>
        </div>
      </div>
 
      {/* Dashboard Grid */}
      <div className="dashboard-grid-eq">
        {/* Equipment Status Chart */}
        <div className="chart-card-eq">
          <h3>Equipment Status</h3>
          <div className="chart-container-eq">
            <canvas ref={statusRef} width={400} height={200}></canvas>
          </div>
        </div>
       
        {/* Maintenance Alerts */}
        <div className="alert-card">
          <h3>Maintenance Alerts <span className="alert-badge">{data.alerts.length}</span></h3>
          <div className="alert-list">
            {data.alerts.map(alert => (
              <div className={`alert-item ${alert.severity.toLowerCase()}`} key={alert.id}>
                <div className="alert-title">{alert.equipment}</div>
                <div className="alert-description">{alert.issue}</div>
                <div className={`alert-severity ${alert.severity.toLowerCase()}`}>
                  {alert.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
       
        {/* Fuel Consumption Chart */}
        <div className="chart-card-eq">
          <h3>Fuel Consumption</h3>
          <div className="chart-container-eq">
            <canvas ref={fuelRef} width={400} height={200}></canvas>
          </div>
        </div>
       
        {/* Location Map */}
        <div className="map-card">
          <h3>Equipment Location</h3>
          <div className="chart-container-eq">
            <canvas ref={mapRef} width={400} height={200}></canvas>
          </div>
        </div>
      </div>
 
      {/* Equipment Table */}
      <div className="equipment-table-container">
        <h3>Equipment List</h3>
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Fuel Level</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <div className="equipment-name">{item.name}</div>
                  <div className="equipment-model">{item.model}</div>
                </td>
                <td>
                  <div className={`status-badge ${item.status.toLowerCase().replace(" ", "-")}`}>
                    {item.status}
                  </div>
                </td>
                <td>{item.lastMaintenance}</td>
                <td>
                  <div className="fuel-container">
                    <div className="fuel-bar">
                      <div
                        className={`fuel-level ${
                          item.fuelLevel > 60 ? "high" : item.fuelLevel > 30 ? "medium" : "low"
                        }`}
                        style={{ width: `${item.fuelLevel}%` }}
                      ></div>
                    </div>
                    <span className="fuel-text">{item.fuelLevel}%</span>
                  </div>
                </td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="no-results">No equipment matches your search criteria</div>
        )}
      </div>
    </div>
  );
};
 
export default Equipment;