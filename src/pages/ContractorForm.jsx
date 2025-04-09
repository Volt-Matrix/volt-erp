
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "../assets/styles/contractor.css"; // Adjust as needed
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-task", text: "Add Task"},
  {url: "/task-list", text: "Update Task progress"},
  {url:"/contractor-form", text: "Contractor"},
  {url:"/contractor-progresstable", text:"Contractor Progress Table"},
  {url: "/work-progress-table", text: "View Full Work Progress Report Table →"}
]

export default function ContractorForm({ initialData = null }) {
  const [projectIDs, setProjectIDs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [formData, setFormData] = useState({
    projectID: "",
    category: "",
    supervisor: "",
    contractor: "",
    cost: "",
    startDate: "",
    deadline: "",
  });

  // Pre-fill fields if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        projectID: initialData.projectID || "",
        category: initialData.category || "",
        supervisor: initialData.supervisor || "",
        contractor: initialData.contractor || "",
        cost: initialData.cost || "",
        startDate: initialData.startDate || "",
        deadline: initialData.deadline || "",
      });
    }
  }, [initialData]);

  // Load dropdown options from Excel
  useEffect(() => {
    fetch("/data/work_progress_main.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const projectSet = [...new Set(data.map((r) => r.Project_ID).filter(Boolean))];
        const categorySet = [...new Set(data.map((r) => r["Category "]).filter(Boolean))];
        const supervisorSet = [...new Set(data.map((r) => r.Supervisor).filter(Boolean))];

        setProjectIDs(projectSet);
        setCategories(categorySet);
        setSupervisors(supervisorSet);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Backend submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://your-backend-api.com/projects", {
        method: initialData ? "PUT" : "POST", // Update if editing
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Project data submitted successfully!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data.");
    }
  };

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
    <div className="form-containerw1">
      <h2>{initialData ? "Edit Project Details" : "Contractor Details"}</h2>
      <form onSubmit={handleSubmit} className="grid-form">

        {/* Project ID */}
        <div className="form-gridw1">
          <label>Project ID:</label>
          <select name="projectID" value={formData.projectID} onChange={handleChange} required>
            <option value="">Select Project</option>
            {projectIDs.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="form-gridw1">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Supervisor */}
        <div className="form-gridw1">
          <label>Supervisor:</label>
          <select name="supervisor" value={formData.supervisor} onChange={handleChange} required>
            <option value="">Select Supervisor</option>
            {supervisors.map((sup) => (
              <option key={sup} value={sup}>{sup}</option>
            ))}
          </select>
        </div>

        {/* Contractor */}
        <div className="form-gridw1">
          <label>Contractor:</label>
          <input type="text" name="contractor" value={formData.contractor} onChange={handleChange} required />
        </div>

        {/* Cost */}
        <div className="form-gridw1">
          <label>Cost:</label>
          <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
        </div>

        {/* Start Date */}
        <div className="form-gridw1">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>

        {/* Deadline */}
        <div className="form-gridw1">
          <label>Deadline:</label>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-btnw1">
          {initialData ? "Update Project" : "Submit Project"}
        </button>
      </form>
    </div>
    </div>
  );
}
