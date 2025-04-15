import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom"; // For navigation
import "../assets/styles/History.css";

const moduleBarData = [
  {url: "/attendance", text: "Dashboard"},
  {url: "/leave-request", text: "Leave Request"},
  {url: "/Manager", text: "Manager"},
  {url: "/Attenoverview", text: "Attendance Overview"},
  {url:"/History", text: "History"}
]
const BiometricDetails = () => {
  const [biometricData, setBiometricData] = useState([]);
  const [filter, setFilter] = useState("week1");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data/biometric_data.xlsx");
        if (!response.ok) {
          throw new Error("File not found");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const formattedData = sheetData.map((row, index) => ({
          id: index + 1,
          date: row["DATE"] || row["Date"] || row["date"],
          checkIn: row["CHECK-IN"] || row["Check-In"] || row["check-in"],
          checkOut: row["CHECK-OUT"] || row["Check-Out"] || row["check-out"],
        }));

        setBiometricData(formattedData);
      } catch (error) {
        console.error("Error loading biometric data:", error);
      }
    };

    fetchData();
  }, []);

  const getDay = (dateStr) => {
    if (!dateStr) return NaN;
    const parts = dateStr.split("-");
    return parts.length === 3 ? parseInt(parts[0].length === 4 ? parts[2] : parts[0]) : NaN;
  };

  const filterData = () => {
    if (!biometricData || biometricData.length === 0) return [];

    let startDay, endDay;
    if (filter === "week1") {
      startDay = 1;
      endDay = 7;
    } else if (filter === "week2") {
      startDay = 8;
      endDay = 14;
    } else if (filter === "week3") {
      startDay = 15;
      endDay = 21;
    } else if (filter === "week4") {
      startDay = 22;
      endDay = 31;
    } else {
      return biometricData; // Show all data if "monthly" is selected
    }

    return biometricData.filter((entry) => {
      const day = getDay(entry.date);
      return !isNaN(day) && day >= startDay && day <= endDay;
    });
  };

  const filteredData = filterData();

  return (
    <div className="biometric-container">
      {/* Back Button */}
      <button className="back-buttons" onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Employee Biometric Details</h2>

      <div className="filter-container">
        <label>Filter by: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="week1">Week 1</option>
          <option value="week2">Week 2</option>
          <option value="week3">Week 3</option>
          <option value="week4">Week 4</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <table className="biometric-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date || "N/A"}</td>
                <td>{entry.checkIn || "N/A"}</td>
                <td>{entry.checkOut || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BiometricDetails;
