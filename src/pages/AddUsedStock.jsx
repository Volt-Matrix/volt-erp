import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../assets/styles/usedstock.css";
import { useNavigate } from "react-router-dom";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/materials", text:"Overview"},
  {url: "/stock-level", text: "Stock Level"},
  {url: "/add-new-stock", text: "Add New Stock/Supplier"},
  {url: "/daily-usage", text: "Daily Material Usage"},
  {url: "/stock-history", text: "Stock History"},
  {url: "/cost-analysis", text: "Cost Analysis"},
]

  


const UsedStockEntry = () => {
  const [stock, setStock] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [materials, setMaterials] = useState([{ materialName: "", usedQuantity: "", unit: "" }]);
  const [units, setUnits] = useState(["kg", "liters", "pieces", "meters"]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/used_stock.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Excel Data Loaded:", jsonData);
        setStock(jsonData);

        const uniqueProjectIds = [...new Set(jsonData.map((item) => item.Project_ID).filter(Boolean))];
        setProjectIds(uniqueProjectIds);
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  const handleProjectChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);
    setSelectedSupervisor("");

    if (selectedId) {
      const filteredSupervisors = [...new Set(stock.filter(item => item.Project_ID === selectedId && item.Supervisor).map(item => item.Supervisor))];
      console.log("Filtered Supervisors:", filteredSupervisors);
      setSupervisors(filteredSupervisors);
      
      const availableMaterials = [...new Set(stock.filter(item => item.Project_ID === selectedId && item.Material).map(item => item.Material))];
      console.log("Available Materials:", availableMaterials);
      setMaterialsList(availableMaterials);
    } else {
      setSupervisors([]);
      setMaterialsList([]);
    }
  };

  return (
    <div className="usedstock-container">
             <SubModuleBar moduleData={moduleBarData} />

      <h2 className="usedstock-title">Enter Used Stock</h2>

      <div className="usedstock-form-container">
        <div className="usedstock-form-section">
          <select value={selectedProjectId} onChange={handleProjectChange} className="usedstock-dropdown12">
            <option value="">Select Project ID</option>
            {projectIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>

          <select value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)} className="usedstock-dropdown">
            <option value="">Select Supervisor</option>
            {supervisors.map((supervisor, idx) => (
              <option key={idx} value={supervisor}>{supervisor}</option>
            ))}
          </select>

          <h3 className="usedstock-subtitle">Material Details</h3>
          {materials.map((material, index) => (
            <div key={index} className="usedstock-material-row">
              <select
                value={material.materialName}
                onChange={(e) => {
                  const updatedMaterials = [...materials];
                  updatedMaterials[index].materialName = e.target.value;
                  setMaterials(updatedMaterials);
                }}
                className="usedstock-dropdown"
              >
                <option value="">Select Material</option>
                {materialsList.map((mat, idx) => (
                  <option key={idx} value={mat}>{mat}</option>
                ))}
              </select>

              <input 
                type="number" 
                placeholder="Used Quantity" 
                value={material.usedQuantity} 
                onChange={(e) => {
                  const updatedMaterials = [...materials];
                  updatedMaterials[index].usedQuantity = e.target.value;
                  setMaterials(updatedMaterials);
                }} 
                className="usedstock-input-field"
              />

              <select 
                value={material.unit} 
                onChange={(e) => {
                  const updatedMaterials = [...materials];
                  updatedMaterials[index].unit = e.target.value;
                  setMaterials(updatedMaterials);
                }} 
                className="usedstock-dropdown"
              >
                <option value="">Select Unit</option>
                {units.map((unit, idx) => (
                  <option key={idx} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          ))}

          <button className="usedstock-add-more-btn" onClick={() => setMaterials([...materials, { materialName: "", usedQuantity: "", unit: "" }])}>Add More</button>
          <button className="usedstock-submit-btn" onClick={() => {
            console.log("Project ID:", selectedProjectId);
            console.log("Supervisor:", selectedSupervisor);
            console.log("Materials:", materials);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
          }}>Submit</button>
          {showPopup && <div className="usedstock-popup-message">✅ Used Stock Recorded Successfully!</div>}
        </div>
      </div>
    </div>
  );
};

export default UsedStockEntry;
