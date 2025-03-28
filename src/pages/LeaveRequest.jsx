import React, { useState } from "react";
import SubModuleBar from "../components/SubModuleBar";
const moduleBarData = [
  {url: "/attendance", text: "Overview"},
  {url: "/leave-request", text: "Leave Request"},
]


const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    totalDays: 0,
    reason: "",
    reportTo: "",
  });
 
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "startDate" || name === "endDate") {
        updatedData.totalDays = calculateTotalDays(updatedData.startDate, updatedData.endDate);
      }
      return updatedData;
    });
  };
 
  // Calculate total leave days
  const calculateTotalDays = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate - startDate;
      return timeDiff >= 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1 : 0;
    }
    return 0;
  };
 
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.name || !formData.startDate || !formData.endDate || !formData.reportTo) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Leave Request Submitted:", formData);
    alert("Leave request submitted successfully!");
  };

  const optionsStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    border: "1px solid #ffc400",
    borderRadius: "7px",
    backgroundColor: "#faf3dd"
  }
 
  return (
    <div>
        <SubModuleBar moduleData={moduleBarData} />

      <div style={styles.container}>
        <h2 style={styles.heading}>Leave Request Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.labelSelector}>
              <label style={styles.label}>Employee ID:</label>
              <input type="text" name="employeeId" placeholder="Enter Employee ID" value={formData.employeeId} onChange={handleChange} style={styles.input} />
            </div>
 
            <div style={styles.labelSelector}>
              <label style={styles.label}>Full Name:</label>
              <input type="text" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} style={styles.input} />
            </div>
 
            <div style={styles.labelSelector}>
              <label style={styles.label}>Leave Type:</label>
              <select name="leaveType" value={formData.leaveType} onChange={handleChange} style={styles.input}>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>
 
            <div style={styles.labelSelector}>
              <label style={styles.label}>Report To:</label>
              <select name="reportTo" value={formData.reportTo} onChange={handleChange} style={styles.input}>
                <option value="">Select</option>
                <option value="Supervisor">Samiha Thaker</option>
                <option value="Supervisor">Prerak Ghosh</option>
                <option value="Supervisor">Rohan Srinivasan</option>
                <option value="Supervisor">Nehmat Rege</option>
                <option value="Manager">Ahana  Shankar</option>
                <option value="HR">Armaan Walia</option>
              </select>
            </div>
 
            <div style={styles.labelSelector}>
              <label style={styles.label}>Start Date:</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} style={styles.input} />
            </div>
 
            <div style={styles.labelSelector}>
              <label style={styles.label}>End Date:</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={styles.input} />
            </div>
            {/* <div>
              <label style={styles.label}>Report To:</label>
              <select name="reportTo" value={formData.reportTo} onChange={handleChange} style={styles.input}>
                <option value="">Select</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
              </select>
            </div> */}
            <div style={styles.labelSelector}>
              <label style={styles.label}>Total Days:</label>
              <input type="number" name="totalDays" value={formData.totalDays} readOnly style={styles.input} />
            </div>
          </div>
 
          <div style={styles.labelSelector}>
            <label style={styles.label}>Reason/Comments:</label>
            <textarea name="reason" placeholder="Enter Reason for Leave" value={formData.reason} onChange={handleChange} style={styles.textarea} />
          </div>
 
          <button type="submit" style={styles.button}><p style={{fontWeight:"bold", color:"black", margin: "0"}}>Submit</p></button>
        </form>
      </div>
    </div>
  );
};

// Centered page styles
const styles = {
  // page: {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "80vw",
  //   backgroundColor: "#f4f6f9",
  // },
  container: {
    width: "850px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "20px"
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "100px",
    marginTop: "10px",
    fontSize: "16px",
  },
  button: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#CFE1F0",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
  labelSelector: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
    gap: "20px"
  }
};
 
export default LeaveRequest;