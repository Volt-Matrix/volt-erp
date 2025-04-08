import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../assets/styles/workprogress.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import SubModuleBar from "../components/SubModuleBar";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label"><strong>Project:</strong> {label}</p>
        <ul className="tooltip-list">
          {payload.map((entry, index) => (
            <li key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-task", text: "Add Task"},
  {url: "/task-list", text: "Update Work Progress"},
  {url:"/contractor-form", text: "Contractor"},
  {url: "/work-progress-table", text: "View Full Work Progress Report Table"},
  {url:"/contractor-progresstable", text:"Contractor Progress Table"}
]


export default function WorkProgress() {
  const [chartData, setChartData] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("All Projects");
 
  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const response = await fetch("/data/work_progress_main.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
 
        setExcelData(jsonData);
 
        const topProjects = [...new Set(jsonData.map(r => r.Project_ID))].slice(0, 5);
 
        const allWorkTypesSet = new Set();
        const projectMap = {};
 
        jsonData.forEach((row) => {
          const projectId = row.Project_ID;
          const workType = row["Category "];
          const progress = parseFloat(row.Progress_Percentage) || 0;
 
          if (!topProjects.includes(projectId)) return;
 
          allWorkTypesSet.add(workType);
 
          if (!projectMap[projectId]) {
            projectMap[projectId] = { project: projectId };
          }
 
          projectMap[projectId][workType] = progress;
        });
 
        setWorkTypes([...allWorkTypesSet]);
        setChartData(Object.values(projectMap));
      } catch (err) {
        console.error("Failed to load Excel data:", err);
      }
    };
 
    fetchExcelData();
  }, []);
 
  const projectOptions = ["All Projects", ...new Set(excelData.map((r) => r.Project_ID))];
 
  const filteredData =
    selectedProject === "All Projects"
      ? excelData
      : excelData.filter((r) => r.Project_ID === selectedProject);
     const getProgressColor = (percentage) => {
        if (percentage <= 20) return "progress-red";
        if (percentage <= 60) return "progress-orange";
      return "progress-green"; 
     };
 
  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
      <div className="project-selector">
        <p style={{margin: "0", marginRight: "10px  "}}>Choose Project: </p>
      <select
        className="filter-dropdown"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        {projectOptions.map((project, i) => (
          <option key={i} value={project}>
            {project}
          </option>
        ))}
      </select>
      </div>
      
  <div className="card-row-wp">
  <div className="card-wp card-half">
    <div className="card-header">
      <h2 className="card-title">Daily Work Summary</h2>
      
    </div>
 
    {filteredData.length > 0 ? (
      filteredData.map((report, index) => (
        <div key={index} className="progress-section">
          <p className="progress-label">
            {report.Project_ID} - {report.Work_Completed}
          </p>
          <div className="progress-inline">
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill ${getProgressColor(report.Progress_Percentage)}`}
                      style={{ width: `${report.Progress_Percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text-right">
                    {report.Progress_Percentage}%
                  </span>
                </div>
        </div>
      ))
    ) : (
      <p>No data available</p>
    )}
  </div>
 
  <div className="card-wp card-half">
    <h2 className="bar-card-title">Work Progress OverView</h2>
    <ResponsiveContainer width="100%" height={350}>
    <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="project" angle={-45} fontSize={10} interval={0} dy={10}/>
        <YAxis />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "none" }} />
        <Legend />
        {workTypes.map((type, index) => (
          <Bar
            key={type}
            dataKey={type}
            fill={
              [
                "#4ade80", "#f87171", "#fbbf24",
                "#60a5fa", "#a78bfa", "#f472b6", "#34d399"
              ][index % 7]
            }
            name={type}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="last">
<div className="card-wide1">
  <h2 className="card-title">Delays & Issues</h2>
  {filteredData.filter((r) => r.Delays && r.Delays !== "None").length > 0 ? (
    filteredData
      .filter((r) => r.Delays && r.Delays !== "None")
      .map((r, i) => (
        <div key={i} className="alert alert-warning">
          <p className="alert-title">{r.Project_ID} - {r.Delays}</p>
          <p className="alert-text">{r.Comments || "No additional comments."}</p>
        </div>
      ))
  ) : (
    <p>No delays reported.</p>
  )}
</div>
 
<div className="card-wide1">
  <h2 className="card-title">Safety Reports</h2>
  {filteredData.filter((r) => r.Safety_Issues && r.Safety_Issues !== "None").length > 0 ? (
    filteredData
      .filter((r) => r.Safety_Issues && r.Safety_Issues !== "None")
      .map((r, i) => (
        <div key={i} className="alert alert-danger">
          <p className="alert-title">
            {r.Project_ID} - Safety Issue: {r.Safety_Issues}
          </p>
          <p className="alert-text">Reported by {r.Supervisor || "N/A"}</p>
        </div>
      ))
  ) : (
    <p>No safety issues reported.</p>
  )}
</div>
</div>
 
</div>
 
  );
}