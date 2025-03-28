import React from "react";
import "../assets/styles/addform.css"; // Update path based on your folder structure
import SubModuleBar from "../components/SubModuleBar";
import { Link } from 'react-router-dom'

const moduleBarData = [
  {url: "/work-progress", text: "Overview"},
  {url: "/add-work-progress", text: "Update Work Progress"},
  {url: "/work-progress-table", text: "View Full Work Progress Report Table →"}
]

export default function AddWorkProgressForm() {
  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />

    <div className="form-container">
      <h2>Add New Work Progress Report</h2>
      <form>
        <div>
          <label>Project ID:</label>
          <input type="text" placeholder="Enter Project ID" required />
        </div>
        <div>
          <label>Work Completed:</label>
          <input type="text" placeholder="e.g. Plumbing" required />
        </div>
        <div>
          <label>Progress Percentage:</label>
          <input type="number" placeholder="0 - 100" required />
        </div>
        <div>
          <label>Delays:</label>
          <input type="text" placeholder="None or delay reason" />
        </div>
        <div>
          <label>Comments:</label>
          <textarea placeholder="Add any notes"></textarea>
        </div>
        <div>
          <label>Safety Issues:</label>
          <input type="text" placeholder="None or issue details" />
        </div>
        <div>
          <label>Supervisor:</label>
          <input type="text" placeholder="Supervisor Name" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
}