import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../assets/styles/Equipment.css';
import EquipmentManagement from '../components/EquipmentManagement.jsx';
import FuelTracking from '../components/FuelTracking.jsx';

// Generate equipment data outside of component to prevent recreation
const generateInitialEquipment = () => {
  const equipmentTypes = ["Drill Machine", "Bulldozer", "Crane", "Excavator", "Concrete Mixer"];
  const statuses = ["In Use", "Maintenance", "Idle"];
  
  return Array.from({ length: 300 }, (_, i) => {
    const id = i + 1;
    return {
      "Equipment_ID": `EQP-${(1000 + id).toString()}`,
      "Name": equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
      "Project_ID": `PRJ-${1000 + Math.floor(Math.random() * 300)}`,
      "Status": statuses[Math.floor(Math.random() * statuses.length)],
      "Last_Inspection": "2025-03-16",
      "Next_Maintenance": "2025-03-17",
      "GPS_Location": `${(10 + Math.random() * 20).toFixed(4)}, ${(70 + Math.random() * 20).toFixed(4)}`,
      "Operator": `Operator ${id}`,
      "Fuel_Consumption_L_per_hr": (5 + Math.floor(Math.random() * 16)).toString()
    };
  });
};

// Define colors outside component
const COLORS = ['#4CAF50', '#f44336', '#FFC107'];

export default function Equipment() {
  const initialData = useRef(generateInitialEquipment());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [equipmentData, setEquipmentData] = useState([]);
  
  // Initialize data once on mount
  useEffect(() => {
    setEquipmentData(initialData.current);
  }, []);
  
  // Calculate stats when equipment data changes
  const equipmentStats = React.useMemo(() => ({
    total: equipmentData.length,
    inUse: equipmentData.filter(eq => eq.Status === 'In Use').length,
    maintenance: equipmentData.filter(eq => eq.Status === 'Maintenance').length,
    idle: equipmentData.filter(eq => eq.Status === 'Idle').length
  }), [equipmentData]);
  
  const equipmentTypeData = React.useMemo(() => {
    if (equipmentData.length === 0) return [];
    
    const typeStats = {};
    equipmentData.forEach(item => {
      if (!typeStats[item.Name]) {
        typeStats[item.Name] = {
          type: item.Name,
          count: 0,
          totalFuel: 0,
          maxFuel: 0
        };
      }
      typeStats[item.Name].count += 1;
      const fuelRate = parseFloat(item.Fuel_Consumption_L_per_hr);
      typeStats[item.Name].totalFuel += fuelRate;
      typeStats[item.Name].maxFuel = Math.max(typeStats[item.Name].maxFuel, fuelRate);
    });

    return Object.values(typeStats).map(data => ({
      type: data.type,
      count: data.count,
      avgFuel: Math.round((data.totalFuel / data.count) * 10) / 10,
      maxRate: data.maxFuel,
      efficiency: Math.round((data.totalFuel / data.count) * 10) / 10
    })).sort((a, b) => b.maxRate - a.maxRate);
  }, [equipmentData]);

  const statusData = React.useMemo(() => [
    { name: 'In Use', value: equipmentStats.inUse },
    { name: 'Idle', value: equipmentStats.idle },
    { name: 'Maintenance', value: equipmentStats.maintenance }
  ], [equipmentStats]);
  
  // Options for filter dropdowns
  const projectOptions = React.useMemo(() => 
    [...new Set(initialData.current.map(item => item.Project_ID))], []);
  
  const equipmentTypeOptions = React.useMemo(() => 
    [...new Set(initialData.current.map(item => item.Name))], []);

  // Handler functions for filtering
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setEquipmentData(initialData.current);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = initialData.current.filter(item => 
      item.Equipment_ID.toLowerCase().includes(term) ||
      item.Name.toLowerCase().includes(term) ||
      item.Operator.toLowerCase().includes(term)
    );
    setEquipmentData(filtered);
  };
  
  const handleFilterProject = (filterProject) => {
    if (filterProject === 'All') {
      setEquipmentData(initialData.current);
      return;
    }
    const filtered = initialData.current.filter(item => item.Project_ID === filterProject);
    setEquipmentData(filtered);
  };
  
  const handleFilterType = (filterType) => {
    if (filterType === 'All') {
      setEquipmentData(initialData.current);
      return;
    }
    const filtered = initialData.current.filter(item => item.Name === filterType);
    setEquipmentData(filtered);
  };
  
  const handleFilterStatus = (filterStatus) => {
    if (filterStatus === 'All') {
      setEquipmentData(initialData.current);
      return;
    }
    const filtered = initialData.current.filter(item => item.Status === filterStatus);
    setEquipmentData(filtered);
  };

  return (
    <div className="">
      <header className="dashboard-header">
        <nav className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Equipment Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'fuel' ? 'active' : ''}`}
            onClick={() => setActiveTab('fuel')}
          >
            Fuel Tracking
          </button>
        </nav>
        <div className="filter-section">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search equipment..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <select onChange={(e) => handleFilterProject(e.target.value)}>
              <option value="All">All Projects</option>
              {projectOptions.map(projectId => (
                <option key={projectId} value={projectId}>{projectId}</option>
              ))}
            </select>
            <select onChange={(e) => handleFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {equipmentTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select onChange={(e) => handleFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Under Maintenance</option>
              <option value="Idle">Idle</option>
            </select>
          </div>
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>Total Equipment</h3>
              <p>{equipmentStats.total}</p>
            </div>
            <div className="stat-card in-use">
              <h3>In Use</h3>
              <p>{equipmentStats.inUse}</p>
            </div>
            <div className="stat-card maintenance danger">
              <h3>Under Maintenance</h3>
              <p>{equipmentStats.maintenance}</p>
            </div>
            <div className="stat-card idle danger">
              <h3>Idle Equipment</h3>
              <p>{equipmentStats.idle}</p>
            </div>
          </div>

          {/* Chart Layout Section */}
          <div className="dashboard-charts-container">
            {/* Top Row - Two Charts Side by Side */}
            <div className="dashboard-charts-row">
              {/* Distribution Chart */}
              <div className="dashboard-chart-card">
                <h2>Equipment Distribution</h2>
                <div className="dashboard-chart">
                  {statusData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value, percent }) => 
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} units`, 'Count']} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Equipment Type Chart */}
              <div className="dashboard-chart-card">
                <h2>Equipment Count by Type</h2>
                <div className="dashboard-chart">
                  {equipmentTypeData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={equipmentTypeData}
                        barSize={20}
                        margin={{ top: 5, right: 30, left: 10, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis 
                          dataKey="type" 
                          angle={-45} 
                          textAnchor="end" 
                          height={70}
                          interval={0}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft', offset: 10 }} />
                        <Tooltip 
                          formatter={(value) => [`${value} units`, 'Count']}
                          cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#2196F3"
                          radius={[4, 4, 0, 0]}
                        >
                          {equipmentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(33, 150, 243, ${0.6 + (index * 0.1)})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row - Full Width Chart */}
            <div className="dashboard-chart-card dashboard-chart-card-wide">
              <h2>Fuel Consumption Analysis</h2>
              <div className="dashboard-chart">
                {equipmentTypeData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={equipmentTypeData}
                      barSize={20}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="type" 
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Liters per Hour', 
                          angle: -90, 
                          position: 'insideLeft', 
                          offset: -5,
                          style: { fill: '#666', fontSize: 12 }
                        }}
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                        contentStyle={{ fontSize: 12 }}
                      />
                      <Legend 
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Bar 
                        dataKey="avgFuel" 
                        name="Average Consumption"
                        fill="#4DB6AC"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="maxRate" 
                        name="Max Consumption"
                        fill="#7986CB"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Activity & Alerts Section */}
          <div className="activity-alerts-container">
            {/* Recent Equipment Activity */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Recent Equipment Activity</h2>
                <div className="card-badge">{equipmentData.length} Total</div>
              </div>
              <div className="activity-list">
                {equipmentData.slice(0, 5).map(equipment => (
                  <div key={equipment.Equipment_ID} className="activity-item">
                    <div className={`status-indicator ${equipment.Status.toLowerCase()}`} />
                    <div className="activity-details">
                      <div className="activity-main">
                        <h3>{equipment.Name}</h3>
                        <span className="equipment-code">{equipment.Equipment_ID}</span>
                      </div>
                      <div className="activity-meta">
                        <span>
                          <i className="fas fa-user"></i>
                          {equipment.Operator}
                        </span>
                        <span>
                          <i className="fas fa-project-diagram"></i>
                          {equipment.Project_ID}
                        </span>
                      </div>
                    </div>
                    <div className="activity-stats">
                      <div className="stat">
                        <label>Fuel</label>
                        <span>{equipment.Fuel_Consumption_L_per_hr}L/hr</span>
                      </div>
                      <div className="stat">
                        <label>Next Service</label>
                        <span>{equipment.Next_Maintenance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Alerts */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Maintenance Alerts</h2>
                <div className="card-badge warning">
                  {equipmentData.filter(e => e.Status === 'Maintenance').length} Alerts
                </div>
              </div>
              <div className="alerts-list">
                {equipmentData
                  .filter(equipment => equipment.Status === 'Maintenance')
                  .slice(0, 5)
                  .map(equipment => (
                    <div key={equipment.Equipment_ID} className="alert-item">
                      <div className="alert-priority">
                        <span className="priority-indicator">!</span>
                      </div>
                      <div className="alert-details">
                        <div className="alert-header">
                          <h3>{equipment.Name}</h3>
                          <span className="alert-id">{equipment.Equipment_ID}</span>
                        </div>
                        <div className="alert-meta">
                          <div className="meta-item">
                            <label>Operator</label>
                            <span>{equipment.Operator}</span>
                          </div>
                          <div className="meta-item">
                            <label>Service Due</label>
                            <span className="highlight">{equipment.Next_Maintenance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="equipment-management-container">
          <EquipmentManagement 
            equipmentData={equipmentData}
            setEquipmentData={setEquipmentData}
          />
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="fuel-tracking-container">
          <FuelTracking equipmentData={equipmentData} />
        </div>
      )}
    </div>
  );
}