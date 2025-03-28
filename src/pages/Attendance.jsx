import "../assets/styles/attendance.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, RadialBarChart, RadialBar 
} from "recharts";

import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/attendance", text: "Overview"},
  {url: "/leave-request", text: "Leave Request"},
]

const data = [
  { month: "Jan", attendance: 85.4 },
  { month: "Feb", attendance: 88.1 },
  { month: "Mar", attendance: 90.2 },
  { month: "Apr", attendance: 86.5 },
  { month: "May", attendance: 89.7 },
  { month: "Jun", attendance: 91.3 },
  { month: "Jul", attendance: 87.9 },
  { month: "Aug", attendance: 85.6 },
  { month: "Sep", attendance: 88.4 },
  { month: "Oct", attendance: 90.1 },
  { month: "Nov", attendance: 92.5 },
  { month: "Dec", attendance: 94.0 },
];

const AttendanceChart = () => {
  return (
    <div className="attendance-chart-container">
      <h2 className="chart-title">Overall Attendance (Yearly)</h2>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[80, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const GaugeChart = () => {
  const percentage = 85;
  const gaugeData = [
    { name: "Low", value: 30, fill: "#FFC107" },
    { name: "Medium", value: 40, fill: "#EF6C00" },
    { name: "High", value: 30, fill: "#4CAF50" },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={15}
          data={gaugeData}
        >
          <RadialBar minAngle={15} background clockWise dataKey="value" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="needle" style={{ transform: `rotate(${(percentage / 100) * 180 - 90}deg)` }}></div>
      <div className="percentage-label">{percentage}%</div>
    </div>
  );
};

function Attendance() {
  const [activeIndex, setActiveIndex] = useState(0);

  const pieData = [
    { name: "Present", value: 60, color: "#4CAF50" },
    { name: "Absent", value: 20, color: "#F44336" },
    { name: "Leave", value: 20, color: "#FF9800" },
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />

      <AttendanceChart />
      
      <div className="stat-container">
      <div className="stats">
              <p style={{ margin: "0", fontSize: "1em" }}>Leaves Used</p>
              <p style={{ margin: "0" }}>
                <span style={{ margin: "0", fontSize: "5em" }}>5</span> days
              </p>
        </div>
        <div className="stats">
              <p style={{ margin: "0", fontSize: "1em" }}>Leaves Available</p>
              <p style={{ margin: "0" }}>
                <span style={{ margin: "0", fontSize: "5em" }}>7</span> days
              </p>
        </div>
        <div className="stats">
              <p style={{ margin: "0", fontSize: "1em" }}>Hours Worked (this week)</p>
              <p style={{ margin: "0" }}>
                <span style={{ margin: "0", fontSize: "5em" }}>35</span> Hours
              </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h4>Attendance Summary</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                onMouseEnter={onPieEnter}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Performance Level</h4> 
          <GaugeChart />
        </div>
      </div>

      {/* Adding AttendanceChart */}
      
    </div>
  );
}

export default Attendance;
