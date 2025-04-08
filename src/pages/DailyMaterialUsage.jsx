import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../assets/styles/dailymaterialusage.css";
import { Link } from "react-router-dom";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  { url: "/materials", text: "Overview" },
  { url: "/stock-level", text: "Stock Level" },
  { url: "/add-new-stock", text: "Add New Stock/Supplier" },
  { url: "/daily-usage", text: "Daily Material Usage" },
  { url: "/stock-history", text: "Stock History" },
  { url: "/cost-analysis", text: "Cost Analysis" },
];

const DailyMaterialUsage = () => {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Load the Excel file and parse it
  useEffect(() => {
    fetch("/data/project_all_materials_updated_usage.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Columns in data:", Object.keys(jsonData[0])); // Log the column names for debugging

        // Set the data if it exists
        setData(jsonData);
        if (jsonData.length > 0) {
          setSelectedProject(jsonData[0].Project_ID);
          setFilteredData(
            jsonData.filter(
              (item) => item.Project_ID === jsonData[0].Project_ID,
            ),
          );
        }
      })
      .catch((error) => {
        console.error("Error loading the Excel file:", error); // Log any errors
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setFilteredData(
        data.filter((item) => item.Project_ID === selectedProject),
      );
    }
  }, [selectedProject, data]);

  const projectIds = [...new Set(data.map((item) => item.Project_ID))];

  // Function to ensure valid percentage value (handle missing or invalid data)
  const getValidPercentage = (percentage) => {
    const validPercentage = parseFloat(percentage);
    return isNaN(validPercentage) ? 0 : validPercentage; // Return 0 if invalid
  };

  // Function to determine progress bar color based on percentage
  const getProgressBarStyle = (percentage) => {
    let bgColor;
    if (percentage <= 30) {
      bgColor = "#FF0000"; // Green for low usage
    } else if (percentage <= 70) {
      bgColor = "#FFA500"; // Orange for medium usage
    } else {
      bgColor = "#4CAF50"; // Red for high usage
    }
    return {
      width: `${percentage}%`,
      backgroundColor: bgColor,
    }; // Set width and color
  };

  return (
    <div className="stock-container">
      <SubModuleBar moduleData={moduleBarData} />
      <h2>Daily Material Usage</h2>

      {/* Project Filter Dropdown */}
      <label>Select Project ID: </label>
      <select
        onChange={(e) => setSelectedProject(e.target.value)}
        value={selectedProject || ""}
      >
        {projectIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Assigned Quantity</th>
            <th>Cost per Unit (₹)</th>
            <th>Supplier</th>
            <th>Material Usage (%)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => {
            const usagePercentage = getValidPercentage(
              item["Material_Usage_%"],
            );

            return (
              <tr key={index}>
                <td>{item.Material}</td>
                <td>{item.Quantity} units</td>{" "}
                {/* Add units inside the quantity */}
                <td>₹{item.Cost_per_Unit_INR}</td>
                <td className="supplier">{item.Supplier}</td>
                <td>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={getProgressBarStyle(usagePercentage)}
                    >
                      <span className="progress-text">{usagePercentage}%</span>{" "}
                      {/* Percentage inside */}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyMaterialUsage;
