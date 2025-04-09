import { useState } from 'react';
import "../assets/styles/Equipment.css";


export default function App() {
  const [data] = useState(Array.from({ length: 300 }, (_, i) => ({
    "Equipment_ID": `EQP-${1001 + i}`,
    "Name": ["Drill Machine", "Bulldozer", "Crane", "Concrete Mixer", "Excavator"][Math.floor(Math.random() * 5)],
    "Project_ID": `PRJ-${1000 + Math.floor(Math.random() * 300)}`,
    "Status": ["In Use", "Maintenance", "Idle"][Math.floor(Math.random() * 3)],
    "Last_Inspection": "2025-03-16",
    "Next_Maintenance": "2025-03-17",
    "GPS_Location": `${10 + Math.random() * 20}, ${70 + Math.random() * 20}`,
    "Operator": `Operator ${i + 1}`,
    "Fuel_Consumption_L_per_hr": `${5 + Math.floor(Math.random() * 16)}`
  })));

  const [filters, setFilters] = useState({
    status: 'all',
    equipment: 'all'
  });

  const filteredData = data.filter(item => {
    return (filters.status === 'all' || item.Status === filters.status) &&
           (filters.equipment === 'all' || item.Name === filters.equipment);
  });

  const stats = {
    total: data.length,
    inUse: data.filter(e => e.Status === 'In Use').length,
    maintenance: data.filter(e => e.Status === 'Maintenance').length,
    idle: data.filter(e => e.Status === 'Idle').length,
    avgFuel: (data.reduce((acc, curr) => acc + parseFloat(curr.Fuel_Consumption_L_per_hr), 0) / data.length).toFixed(1)
  };

  return (
    <div className="eq-dashboard-content">
        <div className="filter-options-container">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Idle">Idle</option>
          </select>
          <select 
            value={filters.equipment} 
            onChange={(e) => setFilters({...filters, equipment: e.target.value})}
          >
            <option value="all">All Equipment</option>
            <option value="Drill Machine">Drill Machine</option>
            <option value="Bulldozer">Bulldozer</option>
            <option value="Crane">Crane</option>
            <option value="Concrete Mixer">Concrete Mixer</option>
            <option value="Excavator">Excavator</option>
          </select>
        </div>

      <div className="stats-container">
        <div className="stat-card-eq total">
          <h3>Total Equipment</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card-eq in-use">
          <h3>In Use</h3>
          <div className="stat-value">{stats.inUse}</div>
        </div>
        <div className="stat-card-eq maintenance">
          <h3>Under Maintenance</h3>
          <div className="stat-value">{stats.maintenance}</div>
        </div>
        <div className="stat-card-eq idle">
          <h3>Idle</h3>
          <div className="stat-value">{stats.idle}</div>
        </div>
      </div>

      <div className="eq-overview-content">
        <section className="equipment-list">
          <h2>Equipment Master List</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Operator</th>
                  <th>Project</th>
                  <th>Fuel/hr</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map(item => (
                  <tr key={item.Equipment_ID}>
                    <td>{item.Equipment_ID}</td>
                    <td>{item.Name}</td>
                    <td>
                      <span className={`status-badge ${item.Status.toLowerCase().replace(' ', '-')}`}>
                        {item.Status}
                      </span>
                    </td>
                    <td>{item.Operator}</td>
                    <td>{item.Project_ID}</td>
                    <td>{item.Fuel_Consumption_L_per_hr}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="maintenance-alerts">
          <h2>Maintenance Alerts</h2>
          <div className="alerts-container">
            {filteredData
              .filter(item => item.Status === 'Maintenance')
              .slice(0, 5)
              .map(item => (
                <div key={item.Equipment_ID} className="alert-card-eq-maintenance">
                  <div className="alert-header">
                    <span className="alert-icon">⚠️</span>
                    <span>{item.Equipment_ID}</span>
                  </div>
                  <div className="alert-content">
                    <p>{item.Name}</p>
                    <p>Next Maintenance: {item.Next_Maintenance}</p>
                    <p>Operator: {item.Operator}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}