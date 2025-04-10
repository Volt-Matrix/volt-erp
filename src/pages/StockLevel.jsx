import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "../assets/styles/stocklevel.css";
import SubModuleBar from "../components/SubModuleBar";


const moduleBarData = [
  {url: "/materials", text:"Overview"},
  {url: "/stock-level", text: "Stock Level"},
  {url: "/add-new-stock", text: "Add New Stock/Supplier"},
  {url: "/daily-usage", text: "Daily Material Usage"},
  {url: "/stock-history", text: "Stock History"},
  {url: "/cost-analysis", text: "Cost Analysis"},
]


const StockLevelTemp = () => {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetch("/data/project_all_materials_updated.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
 
        setData(jsonData);
        const projectIds = [...new Set(jsonData.map((item) => item.Project_ID))];
        if (projectIds.length > 0) {
          setSelectedProject(projectIds[0]);
          setFilteredData(jsonData.filter((item) => item.Project_ID === projectIds[0]));
        }
      });
  }, []);
 
  useEffect(() => {
    if (selectedProject) {
      setFilteredData(data.filter((item) => item.Project_ID === selectedProject));
    }
  }, [selectedProject, data]);
 
  const projectIds = [...new Set(data.map((item) => item.Project_ID))];
 
  // Array of 7 images
  const images = [
    "/images/material0.jpg",
    "/images/material1.jpg",
    "/images/material2.jpg",
    "/images/material3.jpg",
    "/images/material4.jpg",
    "/images/material5.jpg",
    "/images/material6.jpg",
  ];
 
  return (
    <div>
      
    

    <div>
    <SubModuleBar moduleData={moduleBarData} />
 
      <h3>Stock Analysis by Project</h3>

      <div className="project-selector-materials">
      <label className="lab">Select Project: </label>
      <select className="dropdowns" onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject || ""}>
        {projectIds.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>
      </div>
 
      {/* Grid Layout for Cards */}
      <div className="materials-stocklevel-container">
        {filteredData.map((item, index) => {
          const imagePath = images[index % images.length]; // Cycle through images
          return (
            <div
              key={index}
              className={`material-card ${hoveredCard === index ? "expanded" : ""}`}
              style={{ backgroundImage: `url(${imagePath})` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3>{item.Material}</h3>
              <p><strong>Quantity:</strong> <span>{item.Quantity}</span></p>
              <p><strong>Cost per Unit:</strong> <span>₹{item.Cost_per_Unit_INR}</span></p>
              <p style={{color: "#ffae03"}}><strong>Supplier:</strong> <span>{item.Supplier}</span></p>
            </div>
          );
        })}
      </div>
 
      {/* Overlay Effect */}
      {hoveredCard !== null && <div className="overlay"></div>}
    </div>
    </div>
  );
};
 
export default StockLevelTemp;