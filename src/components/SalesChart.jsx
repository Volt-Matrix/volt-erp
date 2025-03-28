import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const salesData = {
  aggregated: [
    { week: "Week 1", "Project A": 15, "Project B": 20, "Project C": 10 },
    { week: "Week 2", "Project A": 18, "Project B": 25, "Project C": 15 },
    { week: "Week 3", "Project A": 12, "Project B": 15, "Project C": 20 },
    { week: "Week 4", "Project A": 10, "Project B": 13, "Project C": 11 },
    { week: "Week 5", "Project A": 9, "Project B": 35, "Project C": 15 },
    { week: "Week 6", "Project A": 25, "Project B": 19, "Project C": 22 }
  ],
  projects: {
    "Project A": [
      { week: "Week 1", "2 BHK": 8, "3 BHK": 5, "4 BHK": 2 },
      { week: "Week 2", "2 BHK": 10, "3 BHK": 6, "4 BHK": 2 },
      { week: "Week 3", "2 BHK": 5, "3 BHK": 3, "4 BHK": 4 },
      { week: "Week 4", "2 BHK": 14, "3 BHK": 8, "4 BHK": 2 },
      { week: "Week 5", "2 BHK": 2, "3 BHK": 4, "4 BHK": 3 },
      { week: "Week 6", "2 BHK": 15, "3 BHK": 7, "4 BHK": 3 }
    ],
    "Project B": [
      { week: "Week 1", "2 BHK": 10, "3 BHK": 7, "4 BHK": 3 },
      { week: "Week 2", "2 BHK": 12, "3 BHK": 8, "4 BHK": 5 },
      { week: "Week 3", "2 BHK": 8, "3 BHK": 5, "4 BHK": 2 },
      { week: "Week 4", "2 BHK": 16, "3 BHK": 12, "4 BHK": 7 },
      { week: "Week 5", "2 BHK": 20, "3 BHK": 10, "4 BHK": 5 },
      { week: "Week 6", "2 BHK": 11, "3 BHK": 4, "4 BHK": 4 }
    ],
    "Project C": [
      { week: "Week 1", "2 BHK": 5, "3 BHK": 3, "4 BHK": 2 },
      { week: "Week 2", "2 BHK": 7, "3 BHK": 4, "4 BHK": 4 },
      { week: "Week 3", "2 BHK": 9, "3 BHK": 6, "4 BHK": 5 },
      { week: "Week 4", "2 BHK": 10, "3 BHK": 8, "4 BHK": 4 },
      { week: "Week 5", "2 BHK": 9, "3 BHK": 2, "4 BHK": 4 },
      { week: "Week 6", "2 BHK": 11, "3 BHK": 7, "4 BHK": 5 }
    ]
  }
};


const colorMapping = {
  "Project A": "#26547c",
  "Project B": "#01befe",
  "Project C": "#ff7d00",
  "2 BHK": "#ef767a",
  "3 BHK": "#456990",
  "4 BHK": "#49beaa"
}

const SalesChart = () => {
  const [selectedProject, setSelectedProject] = useState("");

  const chartData = selectedProject ? salesData.projects[selectedProject] : salesData.aggregated;
  const keys = selectedProject ? Object.keys(chartData[0]).filter(k => k !== "week") : Object.keys(salesData.aggregated[0]).filter(k => k !== "week");

  return (
    <div>
      
      <div style={{ marginBottom: "10px", textAlign:"left", marginLeft: "60px" }}>
        <label>Project: </label>
        <select onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
          <option value="">All Projects</option>
          {Object.keys(salesData.projects).map((project) => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="98%" height={170}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis label={{value: "Quantity", angle: -90}} />
          <Tooltip />
          <Legend />
          {keys.map((key) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colorMapping[key]} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SalesChart;
