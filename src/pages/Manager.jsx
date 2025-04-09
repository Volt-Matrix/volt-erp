import React, { useState } from "react";
import "../assets/styles/manager.css";
import { Link } from "react-router-dom";

const moduleBarData = [
    {url: "/attendance", text: "Dashboard"},
    {url: "/leave-request", text: "Leave Request"},
    {url: "/Manager", text: "Manager"},
    {url: "/Attenoverview", text: "Attendance Overview"},
    {url:"/History", text: "History"}
  ]

const employeeRecords = {
  "Project A": [
    { id: "E101", name: "Alice Johnson", attendance: 90, present: 90, absent: 5, halfDays: 3, leavesUsed: 2, leaveBalance: 8 },
    { id: "E102", name: "Bob Smith", attendance: 85, present: 85, absent: 8, halfDays: 4, leavesUsed: 3, leaveBalance: 7 },
    { id: "E103", name: "Charlie Brown", attendance: 92, present: 92, absent: 3, halfDays: 2, leavesUsed: 1, leaveBalance: 10 },
    { id: "E104", name: "Diana White", attendance: 88, present: 88, absent: 6, halfDays: 3, leavesUsed: 2, leaveBalance: 9 },
    { id: "E105", name: "Ethan Green", attendance: 95, present: 95, absent: 2, halfDays: 1, leavesUsed: 2, leaveBalance: 12 },
  ],
  "Project B": [
    { id: "E201", name: "Frank Black", attendance: 80, present: 80, absent: 10, halfDays: 5, leavesUsed: 4, leaveBalance: 6 },
    { id: "E202", name: "Grace Adams", attendance: 93, present: 93, absent: 2, halfDays: 2, leavesUsed: 1, leaveBalance: 11 },
    { id: "E203", name: "Henry Wilson", attendance: 75, present: 75, absent: 12, halfDays: 3, leavesUsed: 5, leaveBalance: 5 },
    { id: "E204", name: "Ivy Thomas", attendance: 85, present: 85, absent: 7, halfDays: 4, leavesUsed: 3, leaveBalance: 7 },
  ],
  "Project C": [
    { id: "E301", name: "Jack Davis", attendance: 89, present: 89, absent: 6, halfDays: 3, leavesUsed: 2, leaveBalance: 8 },
    { id: "E302", name: "Kate Miller", attendance: 91, present: 91, absent: 5, halfDays: 2, leavesUsed: 2, leaveBalance: 9 },
    { id: "E303", name: "Leo Scott", attendance: 78, present: 78, absent: 10, halfDays: 5, leavesUsed: 5, leaveBalance: 6 },
  ],
};

export default function EmployeeDashboard() {
  const [selectedProject, setSelectedProject] = useState("Project A");
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="Repeat">
        <div className="header">
        <Link to="/Mpage" className="risk"><h5>Manager page</h5></Link>
        <Link to="/Moverview" className="risk"><h5>Manager Overview</h5></Link>
        <Link to="/Biodetail" className="risk"><h5>Bio metric</h5></Link>
        </div>
      <div className="Regret">
        <h2 className="Rectangle">Employee Attendance Dashboard</h2>
        <select 
          className="Reverse" 
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {Object.keys(employeeRecords).map((project) => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>

      <div className="Reserve">
        {employeeRecords[selectedProject].map((employee) => (
          <div key={employee.id}>
            <div
              className="Repair"
              onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
            >
              <span className="Respect">{employee.name} ({employee.id})</span>
              <div className="Battery large-battery">
                <div className="BatteryLevel" style={{ width: `${employee.attendance}%` }}></div>
              </div>
            </div>
            {expandedRow === employee.id && (
              <div className="Requirement">
                <p><strong>Present %:</strong> {employee.present}% 
                  <span className="Battery large-battery present-battery">
                    <div className="BatteryLevel" style={{ width: `${employee.present}%` }}></div>
                  </span>
                </p>
                <p><strong>Absent %:</strong> {employee.absent}% 
                  <span className="Battery large-battery absent-battery">
                    <div className="BatteryLevel" style={{ width: `${employee.absent}%` }}></div>
                  </span>
                </p>
                <p><strong>Half Days:</strong> {employee.halfDays}</p>
                <p><strong>Leaves Used:</strong> {employee.leavesUsed} 
                  <span className="Battery large-battery leave-used-battery">
                    <div className="BatteryLevel" style={{ width: `${employee.leavesUsed * 10}%` }}></div>
                  </span>
                </p>
                <p><strong>Leave Balance:</strong> {employee.leaveBalance} 
                  <span className="Battery large-battery leave-balance-battery">
                    <div className="BatteryLevel" style={{ width: `${employee.leaveBalance * 10}%` }}></div>
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
