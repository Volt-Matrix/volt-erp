import React from "react";
import "../assets/styles/task-progress-table-dashboard.css";

const tasks = [
  {
    name: "Foundation Work",
    startDate: "2024-03-01",
    dueDate: "2024-03-10",
    status: "Completed",
    progress: 100,
  },
  {
    name: "Electrical Setup",
    startDate: "2024-03-05",
    dueDate: "2024-03-15",
    status: "In Progress",
    progress: 60,
  },
  {
    name: "Plumbing",
    startDate: "2024-03-08",
    dueDate: "2024-03-18",
    status: "Pending",
    progress: 0,
  },
  {
    name: "Roofing",
    startDate: "2024-03-10",
    dueDate: "2024-03-20",
    status: "In Progress",
    progress: 40,
  },
  {
    name: "Interior Finishing",
    startDate: "2024-03-15",
    dueDate: "2024-03-30",
    status: "Pending",
    progress: 0,
  },
];

function TaskProgressTable() {
  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.name}</td>
              <td>{task.startDate}</td>
              <td>{task.dueDate}</td>
              <td
                className={`status ${task.status.replace(" ", "-").toLowerCase()}`}
              >
                {task.status}
              </td>
              <td>
                <div>{task.progress}%</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskProgressTable;
