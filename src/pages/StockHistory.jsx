import React, { useState, useEffect } from "react";
import "../assets/styles/stockhistory.css";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
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

const DataTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    projectId: "",
    material: "",
    purchaseDate: "",
    supplier: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({
    projectId: [],
    material: [],
    purchaseDate: [],
    supplier: [],
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetch("/data/project_materials_updated.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Ensure Purchase_Date remains varied and properly formatted
        const formattedData = jsonData.map((item) => {
          let formattedDate = "";
          if (item.Purchase_Date) {
            const parsedDate = new Date(item.Purchase_Date);
            if (!isNaN(parsedDate)) {
              formattedDate = parsedDate.toISOString().split("T")[0];
            } else {
              formattedDate = item.Purchase_Date; // Keep original if parsing fails
            }
          }
          return { ...item, Purchase_Date: formattedDate };
        });

        setData(formattedData);

        setDropdownOptions({
          projectId: [
            ...new Set(formattedData.map((item) => item.Project_ID.toString())),
          ],
          material: [...new Set(formattedData.map((item) => item.Material))],
          purchaseDate: [
            ...new Set(formattedData.map((item) => item.Purchase_Date)),
          ],
          supplier: [...new Set(formattedData.map((item) => item.Supplier))],
        });
      });
  }, []);

  useEffect(() => {
    let filteredMaterials = data;
    if (filters.projectId) {
      filteredMaterials = filteredMaterials.filter(
        (item) => item.Project_ID.toString() === filters.projectId,
      );
    }

    setDropdownOptions((prevOptions) => ({
      ...prevOptions,
      material: [...new Set(filteredMaterials.map((item) => item.Material))],
      purchaseDate: [
        ...new Set(filteredMaterials.map((item) => item.Purchase_Date)),
      ],
      supplier: [...new Set(filteredMaterials.map((item) => item.Supplier))],
    }));
  }, [filters.projectId, data]);

  const handleSelect = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setActiveDropdown(null);
  };

  useEffect(() => {
    if (filters.projectId) {
      const newFilteredData = data.filter(
        (item) =>
          (filters.projectId
            ? item.Project_ID.toString() === filters.projectId
            : true) &&
          (filters.material ? item.Material === filters.material : true) &&
          (filters.purchaseDate
            ? item.Purchase_Date === filters.purchaseDate
            : true) &&
          (filters.supplier ? item.Supplier === filters.supplier : true),
      );
      setFilteredData(newFilteredData);
    } else {
      setFilteredData([]);
    }
  }, [filters, data]);

  const clearFilters = () => {
    setFilters({ projectId: "", material: "", purchaseDate: "", supplier: "" });
    setFilteredData([]);
    setActiveDropdown(null);
  };

  return (
    <div className="stock-container">
      <SubModuleBar moduleData={moduleBarData} />
      <h2>Stock History</h2>
      <div className="search-bar">
        {Object.keys(filters).map((key) => (
          <div key={key} className="search-input-container">
            <input
              type="text"
              placeholder={`Search ${key.replace(/([A-Z])/g, " $1").trim()}`}
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              onFocus={() => setActiveDropdown(key)}
            />
            {activeDropdown === key && dropdownOptions[key] && (
              <div className="dropdown">
                {dropdownOptions[key]
                  .filter((option) =>
                    option
                      .toString()
                      .toLowerCase()
                      .includes(filters[key].toLowerCase()),
                  )
                  .map((option, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleSelect(key, option)}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
        <button className="clear-button" onClick={clearFilters}>
          Clear
        </button>
      </div>
      {filters.projectId && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Material</th>
              <th>Purchase Date</th>
              <th>Quantity</th>
              <th>Cost per Unit</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Project_ID}</td>
                  <td>{item.Material}</td>
                  <td>{item.Purchase_Date}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.Cost_per_Unit_INR}</td>
                  <td>{item.Supplier}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
