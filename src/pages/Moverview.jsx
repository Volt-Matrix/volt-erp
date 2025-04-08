import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../assets/styles/moverview.css";

const moduleBarData = [
  { url: "/attendance", text: "Dashboard" },
  { url: "/leave-request", text: "Leave Request" },
  { url: "/Manager", text: "Manager" },
  { url: "/Attenoverview", text: "Attendance Overview" },
  { url: "/History", text: "History" },
];
const LeaveOverview = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Jan");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const leaveData = {
    Jan: { total: 10, breakdown: { SL: 3, CL: 2, PL: 2, AL: 2, PWC: 1 } },
    Feb: { total: 14, breakdown: { SL: 5, CL: 3, PL: 2, AL: 3, PWC: 1 } },
    Mar: { total: 8, breakdown: { SL: 2, CL: 2, PL: 1, AL: 2, PWC: 1 } },
    Apr: { total: 12, breakdown: { SL: 4, CL: 3, PL: 2, AL: 2, PWC: 1 } },
    May: { total: 9, breakdown: { SL: 3, CL: 2, PL: 2, AL: 1, PWC: 1 } },
    Jun: { total: 11, breakdown: { SL: 4, CL: 2, PL: 2, AL: 2, PWC: 1 } },
    Jul: { total: 7, breakdown: { SL: 2, CL: 2, PL: 1, AL: 1, PWC: 1 } },
    Aug: { total: 15, breakdown: { SL: 5, CL: 4, PL: 3, AL: 2, PWC: 1 } },
    Sep: { total: 20, breakdown: { SL: 6, CL: 5, PL: 3, AL: 3, PWC: 3 } },
    Oct: { total: 18, breakdown: { SL: 5, CL: 5, PL: 4, AL: 2, PWC: 2 } },
    Nov: { total: 16, breakdown: { SL: 4, CL: 4, PL: 3, AL: 3, PWC: 2 } },
    Dec: { total: 13, breakdown: { SL: 4, CL: 3, PL: 2, AL: 2, PWC: 2 } },
  };

  const employees = [
    { id: "E001", name: "Alice", department: "HR" },
    { id: "E002", name: "Bob", department: "Engineering" },
    { id: "E003", name: "Charlie", department: "Sales" },
    { id: "E004", name: "David", department: "Marketing" },
    { id: "E005", name: "Eve", department: "Engineering" },
    { id: "E006", name: "Frank", department: "HR" },
    { id: "E007", name: "Grace", department: "Finance" },
    { id: "E008", name: "Hannah", department: "Sales" },
    { id: "E009", name: "Isaac", department: "Engineering" },
    { id: "E010", name: "Jack", department: "Marketing" },
    { id: "E011", name: "Kate", department: "HR" },
    { id: "E012", name: "Leo", department: "Finance" },
    { id: "E013", name: "Mona", department: "Engineering" },
    { id: "E014", name: "Nathan", department: "Sales" },
    { id: "E015", name: "Olivia", department: "HR" },
    { id: "E016", name: "Paul", department: "Engineering" },
    { id: "E017", name: "Quinn", department: "Finance" },
    { id: "E018", name: "Rachel", department: "Sales" },
    { id: "E019", name: "Steve", department: "Marketing" },
    { id: "E020", name: "Tina", department: "HR" },
  ];

  // Dynamically set the number of employees based on the total leaves for the selected month
  const employeeList = employees.slice(0, leaveData[selectedMonth]?.total || 0);

  const data = Object.entries(leaveData[selectedMonth]?.breakdown || {}).map(
    ([key, value]) => ({
      name: key,
      value,
    }),
  );

  const colors = ["#76B7B2", "#E15759", "#F28E2B", "#59A14F", "#EDC948"];

  const barData = months.map((month) => ({
    month,
    leaves: leaveData[month]?.total || 0,
  }));

  return (
    <div className="leave-overview">
      <h2>Leave Overview</h2>
      {/* Month Selector */}
      <div className="month-scroll">
        {months.map((month) => (
          <div
            key={month}
            className={`month-item ${selectedMonth === month ? "active" : ""}`}
            onClick={() => setSelectedMonth(month)}
          >
            <h3>{month}</h3>
            <p>2023</p>
          </div>
        ))}
      </div>

      {/* Pie Chart & Employee List */}
      <div className="summary">
        {/* Pie Chart Card */}
        <div className="card chart-card">
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <div className="center-text">
            <span>{leaveData[selectedMonth]?.total || 0}</span>
            <p>Leaves</p>
          </div>
          <div className="legend">
            {data.map((entry, index) => (
              <div key={index} className="legend-item">
                <div
                  className="color-box"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee List Card */}
        <div className="card employee-card">
          <h3>Employees on Leave - {selectedMonth}</h3>
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {employeeList.length > 0 ? (
                  employeeList.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{selectedMonth} 2023</td>
                      <td>{emp.department}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart">
        <h3>Total Leaves Taken This Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leaves" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeaveOverview;
