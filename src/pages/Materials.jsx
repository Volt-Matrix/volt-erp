import React from "react";
import "../assets/styles/material.css"
import { Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/materials", text:"Overview"},
  {url: "/stock-level", text: "Stock Level"},
  {url: "/add-new-stock", text: "Add New Stock"},
  {url: "/daily-material-usage", text: "Daily Material Usage"},
  {url: "/supplier-status", text: "Supplier Status"},
  {url: "/cost-analysis", text: "Cost Analysis"},
]

const data = [
    { material: "Cement", cost: 100, unit: "per bag (50kg)", color: "#B4B4B4" },
    { material: "Steel", cost: 275, unit: "per kg", color: "#748b97" },
    { material: "Bricks", cost: 47, unit: "per piece", color: "#FF8330" },
    { material: "Sand", cost: 35, unit: "per cubic ft", color: "#FFF98F" },
    { material: "Gravel", cost: 50, unit: "per cubic ft", color: "#FB6C6C" },
    { material: "Wood", cost: 110, unit: "per cubic ft", color: "#783721" },
    { material: "Glass", cost: 80, unit: "per sq ft", color: "#fff" },
  ];
const data1 = [
    { name: "Cement", quantity: 5500, unit: "kg", color: "#B4B4B4" },
    { name: "Sand", quantity: 7000, unit: "tons", color: "#FFF98F" },
    { name: "Glass", quantity: 400, unit: "tons", color: "#fff" },
    { name: "Steel", quantity: 2000, unit: "pieces", color: "#748b97" },
    { name: "Bricks", quantity: 5000, unit: "pieces", color: "#FF8330" },
    { name: "Wood", quantity: 3000, unit: "planks", color: "#783721" },
    { name: "Tiles", quantity: 2350, unit: "sq metres", color: "#A6C4D2" },
  ];
 
  const outOfStockItems = data1.filter(item => item.quantity < 1000);
 
 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "white", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p className="font-semibold">{payload[0].payload.material}</p>
          <p>Cost: Rs.{payload[0].value}</p>
          <p>Unit: {payload[0].payload.unit}</p>
        </div>
      );
    }
    return null;
  };
 
  const CustomTooltip1 = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "white", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p>{payload[0].payload.name} : {payload[0].value} {payload[0].payload.unit}</p>
        </div>
      );
    }
    return null;
  };
 
  const Materials = () => {
    return (
      <div>
      <SubModuleBar moduleData={moduleBarData} />
      <div className="main-container"> {/*use dashboard-container later*/}
      

      <div className="chart">
        <h4>Cost-per-Unit of Material</h4>
        <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="material" tick={{ fontWeight: 'bold' }} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
          <Bar dataKey="cost" fill="#4CAF50"
                shape = { (props) => {
                  const { x, y, width, height, payload} = props;
                  return <rect x={x} y={y} width={width} height={height} fill={payload.color} />
                }

                }
          />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="cards">
        
        <h3>Alerts</h3>
            
        {outOfStockItems.length > 0 && (
          <><h4>Low Stock (Less than 1000)</h4>
          <ul>
              {outOfStockItems.map(item => (
                    <li key={item.name}>{item.name} ({item.quantity} {item.unit})</li>
                    ))}
            </ul></>
        )}
      </div>

      <div className="chart-card">
        <h4>Construction Materials Quantity</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data1} style={{ backgroundColor: "transparent" }}>
            <XAxis dataKey="name" tick={{ fontWeight: 'bold' }} />
            <YAxis />
            <Tooltip content={<CustomTooltip1 />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="quantity" fill="#8884d8"
                  shape = { (props)=>{
                    const {x, y, width, height, payload} = props;
                    return <rect x={x} y={y} width={width} height={height} fill={payload.color} />
                  }

                  }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      </div>
      </div>
    );
  };
 
export default Materials;