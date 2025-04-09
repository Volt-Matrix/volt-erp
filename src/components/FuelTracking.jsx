import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function FuelTracking({ equipmentData }) {
  const [selectedStat, setSelectedStat] = useState("daily");
  const [timeFilter, setTimeFilter] = useState("day");
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth().toString()); // Current month
  const [showLogForm, setShowLogForm] = useState(false);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    equipmentId: "",
    date: new Date().toISOString().split("T")[0],
    fuelRefilled: "",
    consumptionRate: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get month names for the dropdown - moved outside render
  const months = useMemo(() => [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ], []);
  
  // Filter data by selected month
  const filteredByMonth = useMemo(() => {
    if (timeFilter !== "month") return equipmentData;
    
    return equipmentData.filter(item => {
      // Assume we have a Date field or extract month from another field
      // If there's no actual date field in the data, this is a placeholder
      const itemDate = item.Date ? new Date(item.Date) : new Date();
      return itemDate.getMonth().toString() === monthFilter;
    });
  }, [equipmentData, timeFilter, monthFilter]);

  const totalFuelConsumption = useMemo(() => {
    return filteredByMonth.reduce(
      (total, item) => total + parseFloat(item.Fuel_Consumption_L_per_hr),
      0,
    );
  }, [filteredByMonth]);

  const avgFuelPerLiter = useMemo(() => {
    return totalFuelConsumption / (filteredByMonth.length || 1);
  }, [totalFuelConsumption, filteredByMonth]);

  const usageStats = useMemo(() => {
    const stats = {};
    filteredByMonth.forEach((item) => {
      if (!stats[item.Name]) {
        // Adjust consumption based on time filter
        const baseConsumption = parseFloat(item.Fuel_Consumption_L_per_hr);
        const adjustedConsumption = timeFilter === "month" 
          ? baseConsumption * 24 * 30  // Convert to monthly rate
          : timeFilter === "week"
            ? baseConsumption * 24 * 7  // Convert to weekly rate
            : baseConsumption;          // Keep as hourly rate
            
        stats[item.Name] = {
          type: item.Name,
          usageHours: item.Status === "In Use" ? 8 : 0,
          fuelConsumption: adjustedConsumption,
        };
      } else {
        // Adjust consumption based on time filter
        const baseConsumption = parseFloat(item.Fuel_Consumption_L_per_hr);
        const adjustedConsumption = timeFilter === "month" 
          ? baseConsumption * 24 * 30  // Convert to monthly rate
          : timeFilter === "week"
            ? baseConsumption * 24 * 7  // Convert to weekly rate
            : baseConsumption;          // Keep as hourly rate
            
        stats[item.Name].usageHours += item.Status === "In Use" ? 8 : 0;
        stats[item.Name].fuelConsumption += adjustedConsumption;
      }
    });
    return Object.values(stats);
  }, [filteredByMonth, timeFilter]);

  // Update project data calculations to match the time filter
  const projectFuelData = useMemo(() => {
    const projectStats = {};
    filteredByMonth.forEach((item) => {
      // Adjust consumption based on time filter
      const baseConsumption = parseFloat(item.Fuel_Consumption_L_per_hr);
      const adjustedConsumption = timeFilter === "month" 
        ? baseConsumption * 24 * 30  // Convert to monthly rate
        : timeFilter === "week"
          ? baseConsumption * 24 * 7  // Convert to weekly rate
          : baseConsumption;          // Keep as hourly rate
          
      if (!projectStats[item.Project_ID]) {
        projectStats[item.Project_ID] = {
          project: item.Project_ID,
          fuelConsumption: adjustedConsumption,
        };
      } else {
        projectStats[item.Project_ID].fuelConsumption += adjustedConsumption;
      }
    });
    return Object.values(projectStats).slice(0, 10);
  }, [filteredByMonth, timeFilter]);

  // Calculate fuel consumption trends by equipment type
  const fuelTrends = useMemo(() => {
    const trends = {};
    const multiplier =
      timeFilter === "week" ? 7 : timeFilter === "month" ? 30 : 1;
    filteredByMonth.forEach((item) => {
      if (!trends[item.Name]) {
        const hourlyConsumption = parseFloat(item.Fuel_Consumption_L_per_hr);
        trends[item.Name] = {
          equipmentType: item.Name,
          activeCount: item.Status === "In Use" ? 1 : 0,
          hourlyConsumption,
          dailyConsumption: hourlyConsumption * 24,
          totalConsumption: hourlyConsumption * 24 * multiplier,
          efficiency:
            item.Status === "In Use" ? (hourlyConsumption / 20) * 100 : 0, // Assuming 20L/hr is max efficiency
        };
      } else {
        const hourlyConsumption = parseFloat(item.Fuel_Consumption_L_per_hr);
        trends[item.Name].activeCount += item.Status === "In Use" ? 1 : 0;
        trends[item.Name].hourlyConsumption += hourlyConsumption;
        trends[item.Name].dailyConsumption += hourlyConsumption * 24;
        trends[item.Name].totalConsumption +=
          hourlyConsumption * 24 * multiplier;
        trends[item.Name].efficiency +=
          item.Status === "In Use" ? (hourlyConsumption / 20) * 100 : 0;
      }
    });
    return Object.values(trends).map((trend) => ({
      ...trend,
      efficiency: (trend.efficiency / (trend.activeCount || 1)).toFixed(1),
      avgConsumption: (
        trend.totalConsumption / (trend.activeCount || 1)
      ).toFixed(1),
    }));
  }, [filteredByMonth, timeFilter]);

  const tabData = useMemo(() => ({
    daily: {
      title: "Daily",
      value: `${(totalFuelConsumption / 24).toFixed(1)}L`
    },
    weekly: {
      title: "Weekly",
      value: `${(totalFuelConsumption * 7).toFixed(1)}L`
    },
    monthly: {
      title: "Monthly",
      value: `${(totalFuelConsumption * 30).toFixed(1)}L`
    },
    average: {
      title: "Average",
      value: `${avgFuelPerLiter.toFixed(1)}L`
    },
  }), [totalFuelConsumption, avgFuelPerLiter]);

  const validateForm = () => {
    const errors = {};
    if (!newLog.equipmentId) errors.equipmentId = "Equipment ID is required";
    if (!newLog.date) errors.date = "Date is required";
    if (!newLog.fuelRefilled || parseFloat(newLog.fuelRefilled) <= 0) {
      errors.fuelRefilled = "Valid fuel amount is required";
    }
    if (!newLog.consumptionRate || parseFloat(newLog.consumptionRate) <= 0) {
      errors.consumptionRate = "Valid consumption rate is required";
    }
    return errors;
  };

  const handleAddLog = () => {
    setIsSubmitting(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const efficiency = (
        (parseFloat(newLog.consumptionRate) / 20) *
        100
      ).toFixed(1);
      const log = {
        ...newLog,
        id: Date.now(),
        efficiency: `${efficiency}%`,
      };
      setFuelLogs([log, ...fuelLogs]);
      setShowLogForm(false);
      setFormErrors({});
      setNewLog({
        equipmentId: "",
        date: new Date().toISOString().split("T")[0],
        fuelRefilled: "",
        consumptionRate: "",
        notes: "",
      });
    } catch (error) {
      setFormErrors({ submit: "Failed to add log. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUnsavedChanges = () => {
    return (
      newLog.equipmentId !== "" ||
      newLog.date !== "" ||
      newLog.fuelRefilled !== "" ||
      newLog.consumptionRate !== "" ||
      newLog.notes !== ""
    );
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleCloseModal = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setShowLogForm(false);
        setFormErrors({});
      }
    } else {
      setShowLogForm(false);
      setFormErrors({});
    }
  };

  // Memoize the component styles for better performance
  const timeFilterStyle = useMemo(() => ({ 
    textAlign: "right", 
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px"
  }), []);

  const selectStyle = useMemo(() => ({ 
    padding: "0.5rem 1rem", 
    borderRadius: "4px", 
    border: "1px solid var(--border)", 
    fontSize: "0.9rem",
    backgroundColor: "var(--background)",
    color: "var(--text)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer"
  }), []);

  const tabsContainerStyle = useMemo(() => ({ 
    maxWidth: '800px', 
    margin: '0 auto 2rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    borderRadius: '8px', 
    overflow: 'hidden', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
    border: '1px solid #e0e0e0', 
    fontFamily: "'Segoe UI', Arial, sans-serif"
  }), []);

  const getTabButtonStyle = (isActive) => ({
    flex: '1',
    padding: '1rem 0.5rem', 
    border: 'none', 
    background: isActive ? '#f5f5f5' : '#f9f9f9', 
    color: '#333', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    borderRight: 'none', 
    borderBottom: isActive ? '2px solid #666' : 'none', 
    textAlign: 'center'
  });

  const tabTitleStyle = useMemo(() => ({ 
    display: 'block', 
    fontSize: '0.9rem', 
    fontWeight: 'bold', 
    marginBottom: '0.25rem'
  }), []);

  const getTabValueStyle = (isActive) => ({ 
    display: 'block', 
    fontSize: '1.1rem', 
    fontWeight: isActive ? 'bold' : 'normal' 
  });

  const chartContainerStyle = useMemo(() => ({ width: '100%', margin: '0 auto' }), []);

  const chartsRowStyle = useMemo(() => ({ 
    display: "flex", 
    flexDirection: "row", 
    flexWrap: "nowrap", 
    gap: "2rem", 
    margin: "0 0 2rem 0", 
    width: "100%"
  }), []);

  const chartCardStyle = useMemo(() => ({ 
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
    borderRadius: "8px", 
    padding: "1.5rem", 
    flexBasis: "50%",
    minWidth: "0"
  }), []);

  const chartHeadingStyle = useMemo(() => ({ 
    marginBottom: "1.5rem", 
    fontSize: "1.2rem", 
    textAlign: "center" 
  }), []);

  const chartStyle = useMemo(() => ({ 
    height: "350px", 
    width: "100%" 
  }), []);

  return (
    <div className="fuel-tracking" style={{ padding: "1rem" }}>
      <div className="time-filter" style={timeFilterStyle}>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="time-filter-select"
          style={selectStyle}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        
        {timeFilter === "month" && (
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="month-filter-select"
            style={selectStyle}
          >
            {months.map((month, index) => (
              <option key={index} value={index.toString()}>
                {month}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Updated tabs styling - removed blue highlight */}
      <div className="fuel-stats-tabs" style={tabsContainerStyle}>
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            className={`stat-tab ${selectedStat === tab ? "active" : ""}`}
            onClick={() => setSelectedStat(tab)}
            style={getTabButtonStyle(selectedStat === tab)}
          >
            <div className="tab-content">
              <span className="tab-title" style={tabTitleStyle}>
                {tabData[tab].title}
              </span>
              <span className="tab-value" style={getTabValueStyle(selectedStat === tab)}>
                {tabData[tab].value}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Fixed side-by-side charts with flex layout */}
      <div className="fuel-charts-container" style={chartContainerStyle}>
        <div style={chartsRowStyle}>
          <div className="fuel-chart-card" style={chartCardStyle}>
            <h2 style={chartHeadingStyle}>Equipment Fuel Consumption</h2>
            <div className="chart-container" style={chartStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={usageStats}
                  margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    label={{
                      value: "Consumption Rate (L/month)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -15,
                      fontSize: 12,
                      dy: 50
                    }}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    formatter={(value) => [
                      `${value.toFixed(2)} L/month`,
                      "Consumption Rate"
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="fuelConsumption"
                    name="Fuel Consumption Rate"
                    fill="#4f94cd"
                    barSize={20}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="fuel-chart-card" style={chartCardStyle}>
            <h2 style={chartHeadingStyle}>Project-wise Fuel Usage</h2>
            <div className="chart-container" style={chartStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={projectFuelData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="project"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    label={{
                      value: timeFilter === "month" ? "Total Fuel Usage (L/month)" : 
                             timeFilter === "week" ? "Total Fuel Usage (L/week)" : 
                             "Total Fuel Usage (L/hr)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -15,
                      fontSize: 12,
                      dy: 50
                    }}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    formatter={(value) => [
                      `${value.toFixed(2)} ${timeFilter === "month" ? "L/month" : timeFilter === "week" ? "L/week" : "L/hr"}`,
                      "Total Fuel Usage"
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fuelConsumption"
                    name="Project Fuel Usage"
                    stroke="#2e8b57"
                    strokeWidth={2}
                    dot={{ fill: "#2e8b57", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel log section with improved scrollable table */}
      <div className="fuel-log-section" style={{ 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
        borderRadius: "8px", 
        padding: "1.5rem", 
        margin: "2rem 0" 
      }}>
        <div className="fuel-log-header" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem" 
        }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Fuel Log</h2>
          <button 
            className="btn primary" 
            onClick={() => setShowLogForm(true)}
            style={{
              padding: "0.5rem 1rem", 
              backgroundColor: "#4f94cd",
              color: "white", 
              border: "none",
              borderRadius: "4px", 
              cursor: "pointer", 
              fontSize: "0.9rem" 
            }}
          >
            Add New Log
          </button>
        </div>

        {showLogForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Fuel Log</h3>
              <div className="form-group">
                <label>Equipment ID</label>
                <select
                  value={newLog.equipmentId}
                  onChange={(e) =>
                    setNewLog({ ...newLog, equipmentId: e.target.value })
                  }
                  className={formErrors.equipmentId ? "error" : ""}
                  disabled={isSubmitting}
                >
                  <option value="">Select Equipment</option>
                  {equipmentData.map((eq) => (
                    <option key={eq.Equipment_ID} value={eq.Equipment_ID}>
                      {eq.Equipment_ID} - {eq.Name}
                    </option>
                  ))}
                </select>
                {formErrors.equipmentId && (
                  <span className="error-message">{formErrors.equipmentId}</span>
                )}
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    if (selectedDate > today) {
                      setFormErrors({...formErrors, date: "Future dates are not allowed"});
                    } else {
                      setFormErrors({...formErrors, date: null});
                      setNewLog({ ...newLog, date: e.target.value });
                    }
                  }}
                  className={formErrors.date ? "error" : ""}
                  disabled={isSubmitting}
                />
                {formErrors.date && (
                  <span className="error-message">{formErrors.date}</span>
                )}
              </div>
              <div className="form-group">
                <label>Fuel Refilled (L)</label>
                <input
                  type="number"
                  value={newLog.fuelRefilled}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value <= 0) {
                      setFormErrors({...formErrors, fuelRefilled: "Fuel amount must be greater than 0"});
                    } else if (value > 1000) {
                      setFormErrors({...formErrors, fuelRefilled: "Fuel amount seems unusually high"});
                    } else {
                      setFormErrors({...formErrors, fuelRefilled: null});
                      setNewLog({ ...newLog, fuelRefilled: e.target.value });
                    }
                  }}
                  className={formErrors.fuelRefilled ? "error" : ""}
                  disabled={isSubmitting}
                  min="0"
                  step="0.1"
                />
                {formErrors.fuelRefilled && (
                  <span className="error-message">{formErrors.fuelRefilled}</span>
                )}
              </div>
              <div className="form-group">
                <label>Consumption Rate (L/hr)</label>
                <input
                  type="number"
                  value={newLog.consumptionRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value <= 0) {
                      setFormErrors({...formErrors, consumptionRate: "Consumption rate must be greater than 0"});
                    } else if (value > 100) {
                      setFormErrors({...formErrors, consumptionRate: "Consumption rate seems unusually high"});
                    } else {
                      setFormErrors({...formErrors, consumptionRate: null});
                      setNewLog({ ...newLog, consumptionRate: e.target.value });
                    }
                  }}
                  className={formErrors.consumptionRate ? "error" : ""}
                  disabled={isSubmitting}
                  min="0"
                  step="0.1"
                />
                {formErrors.consumptionRate && (
                  <span className="error-message">{formErrors.consumptionRate}</span>
                )}
              </div>
              <div className="form-group">
                <label>Notes/Comments</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => {
                    if (e.target.value.length > 500) {
                      setFormErrors({...formErrors, notes: "Notes cannot exceed 500 characters"});
                    } else {
                      setFormErrors({...formErrors, notes: null});
                      setNewLog({ ...newLog, notes: e.target.value });
                    }
                  }}
                  className={formErrors.notes ? "error" : ""}
                  disabled={isSubmitting}
                  placeholder="Enter notes (max 500 characters)"
                />
                {formErrors.notes && (
                  <span className="error-message">{formErrors.notes}</span>
                )}
                <span className="character-count">
                  {newLog.notes.length}/500 characters
                </span>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  className="btn primary" 
                  onClick={handleAddLog}
                  disabled={isSubmitting || Object.keys(formErrors).length > 0}
                >
                  {isSubmitting ? 'Adding...' : 'Add Log'}
                </button>
              </div>
              {formErrors.submit && (
                <div className="error-message text-center mt-2">
                  {formErrors.submit}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Improved scrollable table with white scrollbar */}
        <div 
          className="fuel-log-table-container" 
          style={{ 
            maxHeight: "400px", 
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            scrollbarWidth: "thin",
            scrollbarColor: "white #f0f0f0"
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              .fuel-log-table-container::-webkit-scrollbar {
                width: 8px;
                background-color: #f0f0f0;
              }
              .fuel-log-table-container::-webkit-scrollbar-thumb {
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
              }
            `
          }} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 1 }}>
              <tr>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Equipment ID</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Date</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Fuel Refilled (L)</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Consumption Rate (L/hr)</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Efficiency</th>
                <th style={{ padding: "0.75rem", borderBottom: "2px solid #e0e0e0", textAlign: "left", fontSize: "0.9rem" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Display both initial equipment data and any newly added logs */}
              {[...fuelLogs, ...equipmentData.slice(0, 10).map(equipment => {
                const efficiency = (parseFloat(equipment.Fuel_Consumption_L_per_hr) / 20) * 100;
                return {
                  equipmentId: equipment.Equipment_ID,
                  date: new Date().toLocaleDateString(),
                  fuelRefilled: Math.round(
                    parseFloat(equipment.Fuel_Consumption_L_per_hr) * 8
                  ).toString(),
                  consumptionRate: equipment.Fuel_Consumption_L_per_hr,
                  efficiency: `${efficiency.toFixed(1)}%`,
                  notes: equipment.Status === "Maintenance" 
                    ? "Under maintenance"
                    : "Regular operation"
                };
              })].map((log, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    borderBottom: "1px solid #e0e0e0" 
                  }}
                >
                  <td style={{ padding: "0.75rem" }}>{log.equipmentId}</td>
                  <td style={{ padding: "0.75rem" }}>{log.date}</td>
                  <td style={{ padding: "0.75rem" }}>{log.fuelRefilled}</td>
                  <td style={{ padding: "0.75rem" }}>{log.consumptionRate}</td>
                  <td style={{ padding: "0.75rem" }}>{log.efficiency}</td>
                  <td style={{ padding: "0.75rem" }}>{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}