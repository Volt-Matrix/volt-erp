import React, { useState } from "react";
import "../assets/styles/mpage.css";

const moduleBarData = [
  {url: "/attendance", text: "Dashboard"},
  {url: "/leave-request", text: "Leave Request"},
  {url: "/Manager", text: "Manager"},
  {url: "/Attenoverview", text: "Attendance Overview"},
  {url:"/History", text: "History"}
]

const LeaveApproval = () => {
  const [selectedProject, setSelectedProject] = useState("Project A");
  const [filter, setFilter] = useState("pending");

  const initialLeaves = [
    // Project A
    { id: 1, name: "Alice", project: "Project A", from: "2025-04-10", to: "2025-04-12", reason: "Vacation", comment: "Family trip", status: "pending", managerComment: "" },
    { id: 2, name: "Bob", project: "Project A", from: "2025-04-15", to: "2025-04-16", reason: "Medical", comment: "Checkup", status: "pending", managerComment: "" },
    { id: 3, name: "Charlie", project: "Project A", from: "2025-04-18", to: "2025-04-19", reason: "Festival", comment: "Cultural", status: "pending", managerComment: "" },
    { id: 4, name: "David", project: "Project A", from: "2025-04-20", to: "2025-04-22", reason: "Function", comment: "Family event", status: "pending", managerComment: "" },
    { id: 5, name: "Eva", project: "Project A", from: "2025-04-25", to: "2025-04-26", reason: "Travel", comment: "Conference", status: "pending", managerComment: "" },

    // Project B
    { id: 6, name: "Frank", project: "Project B", from: "2025-04-10", to: "2025-04-12", reason: "Medical", comment: "Surgery", status: "pending", managerComment: "" },
    { id: 7, name: "Grace", project: "Project B", from: "2025-04-13", to: "2025-04-15", reason: "Festival", comment: "Holiday", status: "pending", managerComment: "" },
    { id: 8, name: "Hannah", project: "Project B", from: "2025-04-17", to: "2025-04-18", reason: "Function", comment: "Wedding", status: "pending", managerComment: "" },
    { id: 9, name: "Ian", project: "Project B", from: "2025-04-19", to: "2025-04-20", reason: "Vacation", comment: "Traveling", status: "pending", managerComment: "" },
    { id: 10, name: "Jane", project: "Project B", from: "2025-04-22", to: "2025-04-24", reason: "Medical", comment: "Doctor rest", status: "pending", managerComment: "" },

    // Project C
    { id: 11, name: "Kyle", project: "Project C", from: "2025-04-10", to: "2025-04-11", reason: "Festival", comment: "Diwali", status: "pending", managerComment: "" },
    { id: 12, name: "Lily", project: "Project C", from: "2025-04-13", to: "2025-04-14", reason: "Vacation", comment: "Tour", status: "pending", managerComment: "" },
    { id: 13, name: "Mike", project: "Project C", from: "2025-04-15", to: "2025-04-17", reason: "Medical", comment: "Surgery", status: "pending", managerComment: "" },
    { id: 14, name: "Nina", project: "Project C", from: "2025-04-18", to: "2025-04-19", reason: "Festival", comment: "Event", status: "pending", managerComment: "" },
    { id: 15, name: "Oscar", project: "Project C", from: "2025-04-20", to: "2025-04-21", reason: "Function", comment: "Ceremony", status: "pending", managerComment: "" }
  ];

  const [leaves, setLeaves] = useState(initialLeaves);

  const handleAction = (id, action, managerComment = "") => {
    const updated = leaves.map((leave) =>
      leave.id === id ? { ...leave, status: action, managerComment } : leave
    );
    setLeaves(updated);
  };

  const filteredLeaves = leaves.filter(
    (l) => l.project === selectedProject && l.status === filter
  );

  return (
    <div className="manager-container">
      <h2>Leave Approval Dashboard</h2>

      <div className="selectors">
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="Project A">Project A</option>
          <option value="Project B">Project B</option>
          <option value="Project C">Project C</option>
        </select>

        <div className="filters">
          <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</button>
          <button className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>Approved</button>
          <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>Rejected</button>
        </div>
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Employee Comment</th>
            {filter === "pending" && <th>Action</th>}
            {(filter === "approved" || filter === "rejected") && <th>Manager Comment</th>}
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave.id} className={leave.status}>
              <td>{leave.name}</td>
              <td>{leave.id}</td>
              <td>{leave.from}</td>
              <td>{leave.to}</td>
              <td>{leave.reason}</td>
              <td><textarea value={leave.comment} readOnly className="emp-comment" /></td>
              {filter === "pending" && (
                <td>
                  <div className="action-box">
                    <button onClick={() => handleAction(leave.id, "approved", prompt("Enter manager comment for approval:"))} className="approve">Approve</button>
                    <button onClick={() => handleAction(leave.id, "rejected", prompt("Enter manager comment for rejection:"))} className="reject">Reject</button>
                  </div>
                </td>
              )}
              {(filter === "approved" || filter === "rejected") && (
                <td><textarea value={leave.managerComment} readOnly className="mgr-comment" /></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApproval;
