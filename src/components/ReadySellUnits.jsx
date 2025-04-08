import React, { useState } from "react";
import "../assets/styles/ready-sell.css";

const ReadySellUnits = () => {
  const projectData = {
    "Project A": { "2BHK": 46, "3BHK": 29, "4BHK": 19 },
    "Project B": { "2BHK": 32, "3BHK": 14, "4BHK": 8 },
    "Project C": { "2BHK": 55, "3BHK": 24, "4BHK": 12 },
  };

  const [selectedProject, setSelectedProject] = useState("Project A");

  return (
    <div className="ready-sell-box">
      <div className="ready-sell-title">
        <p
          style={{
            margin: "0",
            fontSize: "1em",
            paddingBottom: "7px",
            marginRight: "5px",
          }}
        >
          Ready to sell units quantity:
        </p>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px" }}
        >
          {Object.keys(projectData).map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      <div className="ready-sell-area">
        {Object.entries(projectData[selectedProject]).map(([bhk, count]) => {
          const className = `BHK${bhk.charAt(0)}`; // Extracts the number and prefixes "BHK"
          return (
            <div key={bhk} className={className}>
              <p style={{ margin: "0", fontSize: "1em" }}>{bhk}</p>
              <p style={{ margin: "0" }}>
                <span style={{ margin: "0", fontSize: "5em" }}>{count}</span>{" "}
                units
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadySellUnits;
