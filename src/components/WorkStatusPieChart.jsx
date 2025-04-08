import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Completed", value: 40 },
  { name: "In Progress", value: 39 },
  { name: "Pending", value: 21 },
];

const COLORS = ["#66BB6A", "#FFB74D", "#E57373"]; // Softer Green, Yellow-Orange, Muted Red

function WorkStatusPieChart() {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default WorkStatusPieChart;
