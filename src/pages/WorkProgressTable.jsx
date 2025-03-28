import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {Link} from "react-router-dom";
import "../assets/styles/workprogresstable.css";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-work-progress", text: "Update Work Progress"},
  {url: "/work-progress-table", text: "View Full Work Progress Report Table →"}
]

export default function WorkProgressTable() {
    const [excelData, setExcelData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
 
    const [filters, setFilters] = useState({
      projectId: "Select Project",
      workCompleted: "Select Category",
      delays: "Select Delay reason",
      supervisorSearch: "",
    });
 
    const [visibleRows, setVisibleRows] = useState(50);
 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("/data/work-progress-report-table.xlsx");
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setExcelData(jsonData);
          setFilteredData(jsonData);
        } catch (error) {
          console.error("Failed to load Excel data:", error);
        }
      };
      fetchData();
    }, []);
 
   
    const projectIds = ["Select Project", ...new Set(excelData.map(r => r.Project_ID))];
    const workTypes = ["Select Category", ...new Set(excelData.map(r => r["category "]))];
    const delayOptions = ["Select Delay reason", ...new Set(excelData.map(r => r.Delays || "None"))];
 
    useEffect(() => {
      let data = [...excelData];
 
      if (filters.projectId !== "Select Project") {
        data = data.filter(d => d.Project_ID === filters.projectId);
      }
      if (filters.workCompleted !== "Select Category") {
        data = data.filter(d => d["category "] === filters.workCompleted);
      }
      if (filters.delays !== "Select Delay reason") {
        data = data.filter(d => (d.Delays || "None") === filters.delays);
      }
      if (filters.supervisorSearch.trim() !== "") {
        data = data.filter(d =>
          d.Supervisor?.toLowerCase().includes(filters.supervisorSearch.toLowerCase())
        );
      }
 
      setFilteredData(data);
      setVisibleRows(50);
    }, [filters, excelData]);
 
    const resetFilters = () => {
      setFilters({
        projectId: "Select Project",
        workCompleted: "Select Category",
        delays: "Select Delay reason",
        supervisorSearch: "",
      });
    };
 
    const visibleData = filteredData.slice(0, visibleRows);
 
    return (
      <div>
        <SubModuleBar moduleData={moduleBarData} />
      <div className="table-container">
        {/* <div className="top-buttons">
               <Link to="/work-progress">
                <button className="top-btn">← Back to Summary</button>
               </Link>
        </div> */}
 
        <h2>Work Progress Report Table</h2>
 
        {/* Filters */}
        <div className="filters">
          <select
            value={filters.projectId}
            onChange={e => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
          >
            {projectIds.map((id, i) => (
              <option key={i} value={id}>{id}</option>
            ))}
          </select>
 
          <select
            value={filters.workCompleted}
            onChange={e => setFilters(prev => ({ ...prev, workCompleted: e.target.value }))}
          >
            {workTypes.map((type, i) => (
              <option key={i} value={type}>{type}</option>
            ))}
          </select>
 
          <select
            value={filters.delays}
            onChange={e => setFilters(prev => ({ ...prev, delays: e.target.value }))}
          >
            {delayOptions.map((delay, i) => (
              <option key={i} value={delay}>{delay}</option>
            ))}
          </select>
 
          <input
            type="text"
            placeholder="Search Supervisor"
            value={filters.supervisorSearch}
            onChange={e =>
              setFilters(prev => ({ ...prev, supervisorSearch: e.target.value }))
            }
          />
 
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
 
       
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Work Category</th>
              <th>Progress %</th>
              <th>Delays</th>
              <th>Comments</th>
              <th>Safety Issues</th>
              <th>Supervisor</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.length > 0 ? (
              visibleData.map((row, i) => (
                <tr key={i}>
                  <td>{row.Project_ID}</td>
                  <td>{row["category "]}</td>
                  <td>{row.Progress_Percentage}%</td>
                  <td>{row.Delays || "None"}</td>
                  <td>{row.Comments || "-"}</td>
                  <td>{row.Safety_Issues || "-"}</td>
                  <td>{row.Supervisor || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No matching data found.</td>
              </tr>
            )}
          </tbody>
        </table>
 
        {visibleRows < filteredData.length && (
          <button
            className="view-more-btn"
            onClick={() => setVisibleRows(prev => prev + 50)}
          >
            View More
          </button>
        )}
      </div>
      </div>
    );
  }