import React from "react";
import "../assets/styles/dashboard-home.css";
import { Link } from "react-router-dom";

import ExpenseChart from "../components/ExpenseChart";
import WorkStatusPieChart from "../components/WorkStatusPieChart";
import TaskProgressTable from "../components/TaskProgressTable";

function Home() {
  const attendancePerc = 93;
  const weeklyProgress = 47;
  return (
    <div className="dashboard-container">
      <Link to="/attendance" className="box1">
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0",
            padding: "5px",
          }}
        >
          Workers attendance
        </p>
        <p style={{ fontSize: "5em", fontWeight: "bold", margin: "0" }}>
          {attendancePerc}%
        </p>
      </Link>

      <Link to="/work-progress" className="box2">
        <p
          style={{
            color: "#F5F5F5",
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0",
            padding: "5px",
            marginBottom: "0px",
          }}
        >
          Weekly Work Progress
        </p>
        <p
          style={{
            color: "#F5F5F5",
            fontSize: "5em",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          {weeklyProgress}%
        </p>
      </Link>

      <Link to="/sales-targets" className="box3">
        <h5 style={{ margin: 0, padding: 0 }}>Monthly Expense vs Budget</h5>
        <ExpenseChart />
      </Link>

      <Link to="/work-progress" className="box4">
        <h5 style={{ margin: 0, padding: 0 }}>Project Work Tasks Status</h5>
        <WorkStatusPieChart />
      </Link>

      <Link to="work-progress" className="box5">
        {/* <p style={{fontSize: "3em"}}>Dashboard placeholder</p> */}
        <TaskProgressTable />
      </Link>
    </div>
  );
}

export default Home;
