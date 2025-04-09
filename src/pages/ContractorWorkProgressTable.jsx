import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../assets/styles/workprogresstable.css";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-task", text: "Add Task"},
  {url: "/task-list", text: "Update Work Progress"},
  {url:"/contractor-form", text: "Contractor"},
  {url:"/contractor-progresstable", text:"Contractor Progress Table"},
   {url: "/work-progress-table", text: "View Full Work Progress Report Table"}
]

export default function ContactorWorkProgressTable() {
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    projectId: "Project_Id",
    contractor: "Contractor",
    supervisorSearch: "",
    category: "Category",
    delays: "Delay",
  });

  const [visibleRows, setVisibleRows] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/work_progress_contractor.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("sample excel data:",jsonData[0,5]);

        setExcelData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error("Failed to load Excel data:", error);
      }
    };
    fetchData();
  }, []);

  const projectIds = ["Project_Id", ...new Set(excelData.map(r => r.Project_ID))];
  const workTypes = ["Category", ...new Set(excelData.map(r => r.Category))];
  const contractorOptions = ["Contractor", ...new Set(excelData.map(r => r.Contractor))];
  const delayOptions = ["Delay", ...new Set(excelData.map(r => r.Delays || "None"))];

  useEffect(() => {
    let data = [...excelData];

    if (filters.projectId !== "Project_Id") {
      data = data.filter(d => d.Project_ID === filters.projectId);
    }

    if (filters.category !== "Category") {
      data = data.filter(d => d.Category === filters.category);
    }

    if (filters.contractor !== "Contractor") {
      data = data.filter(d => d.Contractor === filters.contractor);
    }

    if (filters.delays !== "Delay") {
      data = data.filter(d => (d.Delays || "None") === filters.delays);
    }

    if (filters.supervisorSearch.trim() !== "") {
      data = data.filter(d =>
        d.Supervisor?.toLowerCase().includes(filters.supervisorSearch.toLowerCase())
      );
    }

    setFilteredData(data);
    setVisibleRows(30);
  }, [filters, excelData]);

  const resetFilters = () => {
    setFilters({
      projectId: "Project_Id",
      category: "Category",
      contractor: "Contractor",
      delays: "Delay",
      supervisorSearch: "",
    });
  };

  const visibleData = filteredData.slice(0, visibleRows);

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
    <div className="table-container">
      {/* <div className="top-buttons3">
        <Link to="/work-progress-table">
          <button className="top-btnn3">← Back to Summary</button>
        </Link>
      </div> */}

      <h2>Work Progress Report Table</h2>

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
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          {workTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={filters.contractor}
          onChange={e => setFilters(prev => ({ ...prev, contractor: e.target.value }))}
        >
          {contractorOptions.map((contractor, i) => (
            <option key={i} value={contractor}>{contractor}</option>
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
        

        <button  onClick={resetFilters}>Reset Filters</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Contractor</th>
            <th>Supervisor</th>
            <th>Cost</th>
            <th>Start_Date</th>
            <th>Dead_line</th>
            <th>Category</th>
            <th>Progress %</th>
            <th>Delays</th>
            <th>Comments</th>
         </tr>
        </thead>
        <tbody>
          {visibleData.length > 0 ? (
            visibleData.map((row, i) => (
              <tr key={i}>
                <td>{row.Project_ID}</td>
                <td>{row.Contractor}</td>
                <td>{row.Supervisor || "-"}</td>
                <td>{row.Cost}</td>
                <td>{row.Start_Date}</td>
                <td>{row.Deal_line}</td>
                <td>{row.Category}</td>
                <td>{row.Progress_Percentage}%</td>
                <td>{row.Delays || "None"}</td>
                <td>{row.Comments || "-"}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No matching data found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {visibleRows < filteredData.length && (
        <button
          className="view-more-btn"
          onClick={() => setVisibleRows(prev => prev + 30)}
        >
          View More
        </button>
      )}
    </div>
    </div>
  );
}
