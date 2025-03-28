import React from "react";
import "../assets/styles/labourmanagement.css"
import SubModuleOption from "../components/SubModuleButton";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/labour-management", text: "Overview"},
  {url: "/add-employee", text: "Add Employee"},
]

const LabourManagement = () => {
  const labourData = [
    { Employee_ID: "LAB-1001", Name: "Lavanya Chaudhari", Age: 46, Gender: "Male", Project_ID: "PRJ-1205", Skill_Level: "Semi-Skilled", Department: "Masonry", Daily_Wage_INR: 428, Joining_Date: "2024-03-31", Contract_Type: "Permanent", Supervisor: "Heer Kumer", Shift_Timing: "Day", Work_Hours: 12, Performance_Score: 2 },
    { Employee_ID: "LAB-1002", Name: "Saksham Tak", Age: 29, Gender: "Female", Project_ID: "PRJ-1207", Skill_Level: "Unskilled", Department: "Carpentry", Daily_Wage_INR: 1276, Joining_Date: "2024-05-31", Contract_Type: "Daily Wages", Supervisor: "Samiha Thaker", Shift_Timing: "Day", Work_Hours: 9, Performance_Score: 2 },
    { Employee_ID: "LAB-1003", Name: "Hazel Thakur", Age: 25, Gender: "Female", Project_ID: "PRJ-1060", Skill_Level: "Unskilled", Department: "Masonry", Daily_Wage_INR: 1114, Joining_Date: "2024-11-05", Contract_Type: "Daily Wages", Supervisor: "Prerak Ghosh", Shift_Timing: "Day", Work_Hours: 7, Performance_Score: 3 },
    { Employee_ID: "LAB-1004", Name: "Nirvi Banik", Age: 34, Gender: "Male", Project_ID: "PRJ-1220", Skill_Level: "Unskilled", Department: "Masonry", Daily_Wage_INR: 1296, Joining_Date: "2024-02-24", Contract_Type: "Contract", Supervisor: "Advika Dada", Shift_Timing: "Night", Work_Hours: 9, Performance_Score: 2 },
    { Employee_ID: "LAB-1005", Name: "Hridaan Kulkarni", Age: 34, Gender: "Male", Project_ID: "PRJ-1281", Skill_Level: "Skilled", Department: "Electrical", Daily_Wage_INR: 365, Joining_Date: "2024-03-29", Contract_Type: "Contract", Supervisor: "Rohan Srinivasan", Shift_Timing: "Day", Work_Hours: 11, Performance_Score: 5 },
  ];
 
  return (
    <div>
      <SubModuleBar moduleData = {moduleBarData}/>
    <div className="table-container-lm">
      <h2 className="table-title">Employee Information</h2>
      <div className="table-wrapper">
        <table className="labour-table">
          <thead>
            <tr>
              {Object.keys(labourData[0]).map((key) => (
                <th key={key}>{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labourData.map((labour, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                {Object.values(labour).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
 
export default LabourManagement;