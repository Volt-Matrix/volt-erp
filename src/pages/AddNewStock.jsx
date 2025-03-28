import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../assets/styles/AddNewStock.css"
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/materials", text:"Overview"},
  {url: "/stock-level", text: "Stock Level"},
  {url: "/add-new-stock", text: "Add New Stock"},
  {url: "/daily-material-usage", text: "Daily Material Usage"},
  {url: "/supplier-status", text: "Supplier Status"},
  {url: "/cost-analysis", text: "Cost Analysis"},
]


const AddNewStock = () => {
  const [stock, setStock] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [editableStock, setEditableStock] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
 
  useEffect(() => {
    fetch("/data/project_all_materials_updated.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setStock(jsonData);
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);
 
  const handleQuantityChange = (index, newQuantity) => {
    setEditableStock((prev) => ({ ...prev, [index]: newQuantity }));
  };
 
  const handleAddStock = () => {
    console.log("Updated Stock:", editableStock, "Date:", selectedDate);
  };
 
  const filteredStock = stock.filter(
    (item) =>
      selectedProjectId &&
      item.Project_ID === selectedProjectId &&
      (selectedSupplier ? item.Supplier === selectedSupplier : true)
  );
 
  return (
    <div className="stock-container">
      
      <SubModuleBar moduleData={moduleBarData} />

      <h2>Add New Stock Materials</h2>
      <div className="filters">
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Select Project ID</option>
          {[...new Set(stock.map((item) => item.Project_ID))].map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
          <option value="">Select Supplier</option>
          {[...new Set(stock.filter(item => item.Project_ID === selectedProjectId).map((item) => item.Supplier))].map((supplier) => (
            <option key={supplier} value={supplier}>{supplier}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>
     
      {filteredStock.length > 0 && (
        <>
          <h2>Stock List</h2>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item, index) => (
                <tr key={index}>
                  <td>{item.Material}</td>
                  <td>
                    <select
                      value={editableStock[index] || item.Quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    >
                      {[...Array(101).keys()].map((qty) => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>
                  </td>
                  <td>{item.Unit}</td>
                  <td>{item.Supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-stock-btn" onClick={handleAddStock}>Add Stock</button>
        </>
      )}
    </div>
  );
};
 
export default AddNewStock;