import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Oct", Projected: 5, Actual: 4.3 },
  { month: "Nov", Projected: 7, Actual: 6.5 },
  { month: "Dec", Projected: 6, Actual: 5.9 },
  { month: "Jan", Projected: 3, Actual: 4.6 },
  { month: "Feb", Projected: 7, Actual: 8.2 },
  { month: "Mar", Projected: 3, Actual: 7.7 },
];

function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "(₹ crores)", angle: -90 }} />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Line
          type="monotone"
          dataKey="Projected"
          stroke="#FF6347"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Actual"
          stroke="#008080"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ExpenseChart;
