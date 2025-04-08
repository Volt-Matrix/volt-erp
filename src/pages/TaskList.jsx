import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import "../assets/styles/tasklist.css";
import { Link } from "react-router-dom";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  { url: "/work-progress", text: "Overview" },
  { url: "/add-task", text: "Add Task" },
  { url: "/task-list", text: "Update Task progress" },
  { url: "/contractor-form", text: "Contractor" },
  { url: "/work-progress-table", text: "View Full Work Progress Report Table" },
  { url: "/contractor-progresstable", text: "Contractor Progress Table" },
];
export default function TaskList() {
  const [data, setData] = useState([]);
  const [projectIDs, setProjectIDs] = useState([]);
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [notification, setNotification] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    fetch("/data/work_progress_task.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const updatedData = jsonData.map((task) => ({
          ...task,
          Task_Status: getStatus(task.Progress_Percentage),
          Last_Updated: new Date().toLocaleString(),
        }));

        setData(updatedData);
        setProjectIDs([
          "All",
          ...new Set(jsonData.map((row) => row.Project_ID)),
        ]);
      });
  }, []);

  const getStatus = (percentage) => {
    if (percentage >= 100) return "Completed";
    if (percentage >= 21) return "In Progress";
    return "Pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "red";
      case "In Progress":
        return "orange";
      case "Completed":
        return "green";
      default:
        return "black";
    }
  };

  const filteredData =
    selectedProject === "All"
      ? data.filter((task) => task.Progress_Percentage < 100)
      : data.filter(
          (task) =>
            task.Project_ID === selectedProject &&
            task.Progress_Percentage < 100,
        );

  const handleCardClick = (task) => {
    setSelectedTask(task);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prev) => ({
      ...prev,
      [name]: value,
      Task_Status: getStatus(value),
      Last_Updated: new Date().toLocaleString(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = data
      .map((task) =>
        task.Project_ID === selectedTask.Project_ID &&
        task.Task === selectedTask.Task
          ? {
              ...selectedTask,
              Task_Status: getStatus(selectedTask.Progress_Percentage),
              Last_Updated: new Date().toLocaleString(),
            }
          : task,
      )
      .filter((task) => task.Progress_Percentage < 100);

    setData(updatedData);
    setSelectedTask(null);
    setNotification("Task updated successfully!");
    setTimeout(() => setNotification(""), 2000);
  };

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
      <div className="dashboard-container2">
        {notification && <div className="notification">{notification}</div>}
        <h2>Pending Tasks</h2>

        <div className="filter-section2">
          <label className="filter-label2">Filter by Project ID:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="dropdown2"
          >
            {projectIDs.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="task-grid2">
          {filteredData.map((task, index) => (
            <div
              key={index}
              className={`task-card2 ${task.category?.toLowerCase()}`}
              onClick={() => handleCardClick(task)}
            >
              <h4 className="task-project2">{task.Project_ID}</h4>
              <div className="task-category2">{task.category}</div>
              <p className="task-desc2">{task.Task}</p>
              <span
                className="task-progress2"
                style={{ color: getStatusColor(task.Task_Status) }}
              >
                {task.Progress_Percentage}% - {task.Task_Status}
              </span>
              <div className="task-updated">
                Last Updated: {task.Last_Updated}
              </div>
            </div>
          ))}
        </div>

        {selectedTask && (
          <div className="modal-overlay2">
            <form
              className="task-form2 edit-form2"
              ref={modalRef}
              onSubmit={handleSubmit}
            >
              <button
                type="button"
                className="close-btn2"
                onClick={() => setSelectedTask(null)}
              >
                ✖
              </button>
              <div className="form-grid2">
                <div className="form-group2">
                  <label>Project ID</label>
                  <input type="text" value={selectedTask.Project_ID} readOnly />
                </div>
                <div className="form-group2">
                  <label>Supervisor</label>
                  <input type="text" value={selectedTask.Supervisor} readOnly />
                </div>
                <div className="form-group2">
                  <label>Task</label>
                  <textarea value={selectedTask.Task} readOnly />
                </div>
                <div className="form-group2">
                  <label>Progress %</label>
                  <input
                    type="number"
                    name="Progress_Percentage"
                    value={selectedTask.Progress_Percentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className="form-group2">
                  <label>Delays</label>
                  <input
                    type="text"
                    name="Delays"
                    value={selectedTask.Delays}
                    onChange={handleInputChange}
                    disabled={selectedTask.Progress_Percentage >= 100}
                  />
                </div>

                <div className="form-group2">
                  <label>Safety Issues</label>
                  <input
                    type="text"
                    name="Safety_Issues"
                    value={selectedTask.Safety_Issues}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group2">
                  <label>Comments</label>
                  <textarea
                    name="Comments"
                    value={selectedTask.Comments}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <button className="sub-btn1" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
