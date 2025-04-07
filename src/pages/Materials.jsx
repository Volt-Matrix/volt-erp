import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../assets/styles/material.css";
import SubModuleBar from "../components/SubModuleBar";


const moduleBarData = [
  {url: "/materials", text:"Overview"},
  {url: "/stock-level", text: "Stock Level"},
  {url: "/add-new-stock", text: "Add New Stock/Supplier"},
  {url: "/daily-usage", text: "Daily Material Usage"},
  {url: "/stock-history", text: "Stock History"},
  {url: "/cost-analysis", text: "Cost Analysis"},
]


const materialColors = {
  Cement: "#B3B3B3",
  Bricks: "#DE685B",
  Tiles: "#D4BA91",
  Wood: "#8b5a2b",
  Sand: "#C2B280",
  Steel: "#4682B4",
  Glass: "#F9FEFF"
};

const Materials = () => {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("All");
  const [aggregatedData, setAggregatedData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlertLevel, setSelectedAlertLevel] = useState(null);


  const getAlertLevel = (quantity) => {
    if (quantity < 400) return { level: "Critical", color: "rgb(250, 86, 64)" };
    if (quantity < 450) return { level: "High", color: "rgb(52, 100, 173)" };
    if (quantity < 500) return { level: "Medium", color: "rgb(200, 250, 64)" };
    return null;
  };
  

  useEffect(() => {
    fetch("/data/project_all_materials_updated.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        setData(jsonData);
        updateAggregatedData(jsonData, "All");
      });
  }, []);


  const updateAggregatedData = (data, project) => {
    const filteredData = project === "All" ? data : data.filter((item) => item.Project_ID === project);
    const aggregated = {};
    const alertList = [];

    
    filteredData.forEach(item => {
      if (!aggregated[item.Project_ID]) {
        aggregated[item.Project_ID] = { Project_ID: item.Project_ID };
      }
      aggregated[item.Project_ID][item.Material] = (aggregated[item.Project_ID][item.Material] || 0) + item.Quantity;
    });

    Object.values(aggregated).forEach(project => {
      Object.keys(project).forEach(material => {
        if (material !== "Project_ID") {
          const alert = getAlertLevel(project[material]);
          if (alert) {
            alertList.push({ material, quantity: project[material], level: alert.level, color: alert.color });
          }
        }
      });
    });
    
    setAggregatedData(Object.values(aggregated).slice(0, 5)); // Show only 5 projects initially
    setAlerts(alertList);
  };

  useEffect(() => {
    updateAggregatedData(data, selectedProject);
  }, [selectedProject, data]);

  const projectIds = ["All", ...new Set(data.map((item) => item.Project_ID))];

  return (
    <div className="container">
     <SubModuleBar moduleData={moduleBarData} />
      <h2>Material Analysis by Project</h2>
      <label className="lab">Select Project ID: </label>
      <select className="dropdowns" onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject || ""}>
        {projectIds.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
      
      <div className="dashboard">
      <div className="chart-section">
          <h3>Total Quantity by Material for Selected Project</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={aggregatedData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="Project_ID" />
              <YAxis />
              <Tooltip cursor={{ fill: "none" }} />
              <Legend />
              {Object.keys(materialColors).map((material) => (
                <Bar 
                  key={material} 
                  dataKey={material} 
                  fill={materialColors[material]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="alert-card">
          <h3>Stock Alerts</h3>
          <div className="alert-buttons">
            {['Critical', 'Medium', 'High'].map(level => (
              <button key={level} className="alert-button" onClick={() => setSelectedAlertLevel(level)}>
                {level} ({alerts.filter(alert => alert.level === level).length})
              </button>
            ))}
          </div>
          {selectedAlertLevel && (
            <div className="alert-details">
              {alerts.filter(alert => alert.level === selectedAlertLevel).map((alert, index) => (
                <div key={index} className="alert-detail" style={{ backgroundColor: alert.color }}>
                  <h4>{alert.level} Alert</h4>
                  <p><strong>{alert.material}</strong>: {alert.quantity} Near to Out of Stock</p>
                </div>
            ))}
          </div>
        )}
    </div>
    </div>
    </div>
);
};
export default Materials;
