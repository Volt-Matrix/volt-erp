import React,{useEffect,useState} from "react";
import "../assets/styles/addtask.css"; // Update path based on your folder structure
import SubModuleBar from "../components/SubModuleBar";
import { Link } from 'react-router-dom';

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-task", text: "Add Task"},
  {url: "/task-list", text: "Update Task progress"},
  {url:"/contractor-form", text: "Contractor"},
  {url: "/work-progress-table", text: "View Full Work Progress Report Table"},
  {url:"/contractor-progresstable", text:"Contractor Progress Table"}
]

export default function AddTask() {
  const [projectIDs, setProjectIDs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [formData, setFormData] = useState({
    projectID: "",
    category: "",
    task: "",
    supervisor: "",
    materials: [{ name: "", quantity: "", unit: "Units" }],
  });

  useEffect(() => {
    fetch("/data/work_progress_main.xlsx")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log("raw json data: ", data.slice(0, 5))
        const projects = [...new Set(data.map((r) => r.Project_ID).filter(Boolean))];
        const categories = [...new Set(data.map((r) => r["category "]).filter(Boolean))];
        const supervisors = [...new Set(data.map((r) => r.Supervisor).filter(Boolean))];
        console.log("categories: ", categories)
        console.log("projects: ", projects)
        setProjectIDs(projects);
        setCategories(categories);
        setSupervisors(supervisors);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index][field] = value;
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const addMaterialField = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { name: "", quantity: "", unit: "Units" }],
    });
  };

  const removeMaterialField = (index) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials.splice(index, 1);
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const handleTaskChange = (e) => {
    setFormData({ ...formData, task: e.target.value });
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    for (const mat of formData.materials) {
      if (!mat.name.trim() || isNaN(mat.quantity) || mat.quantity <= 0) {
        alert("Please provide valid material details.");
        return;
      }
    }

    const response = await fetch("https://your-backend-api.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Task submitted successfully!");
      setFormData({
        projectID: "",
        category: "",
        task: "",
        supervisor: "",
        materials: [{ name: "", quantity: "", unit: "Units" }],
      });
    } else {
      alert("Error submitting task!");
    }
  };

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
    <div className="form-containerw1">
      {/* <Link to="/work-progress">
        <button className="top-btn1">← Back to Summary</button>
      </Link> */}

      <h2>Add Task Form</h2>

     

      <form onSubmit={handleSubmit}>

        
        <div className="form-gridw1">
          <label>Project_ID:</label>
          <select name="projectID" value={formData.projectID} onChange={handleChange} required>
            <option value="">Select Project</option>
            {projectIDs.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-gridw1 ">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
           <option value="">Select Category</option>
           {categories.length > 0 ? (
            categories.map((cat) => (
             <option key={cat} value={cat}>
             {cat}
             </option>
              ))
             ) : (
              <option disabled>Loading categories...</option>
             )}
            </select>

        </div>

        <div className="form-gridw1">
          <label>Supervisor:</label>
          <select name="supervisor" value={formData.supervisor} onChange={handleChange} required>
            <option value="">Select Supervisor</option>
            {supervisors.map((sup) => (
              <option key={sup} value={sup}>
                {sup}
              </option>
            ))}
          </select>
        </div>

        <div className="form-gridw1">
          <label>Task:</label>
          <textarea
            name="task"
            value={formData.task}
            onChange={handleTaskChange}
            className="auto-expandw1"
            required
          />
        </div>
      

        <label>Material Usage:</label>
        {formData.materials.map((mat, index) => (
          <div key={index} className="material-roww1">
            <input
              type="text"
              placeholder="Material"
              value={mat.name}
              onChange={(e) => handleMaterialChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              min="0"
              value={mat.quantity}
              onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
              required
            />

          
          
            <select 
              value={mat.unit}
              onChange={(e) => handleMaterialChange(index, "Units", e.target.value)}
              required
            >
              <option value="kgs">Kgs</option>
              <option value="cubic meters">Cubic Meters</option>
              <option value="tons">Tons</option>
              <option value="pieces">Pieces</option>
            </select>
            <button type="button1" className="remove-btnw1" onClick={() => removeMaterialField(index)}>
              ✖
            </button>
          </div>
        ))}
        <button type="button1" onClick={addMaterialField}>
          Add Material
        </button>

        <button type="submit" className="submit-btnw1">
          Submit
        </button>
      </form>
    </div>
    </div>
    
  );
}