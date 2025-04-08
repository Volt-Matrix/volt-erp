import React, { useState } from "react";
import SubModuleBar from "../components/SubModuleBar";

const moduleBarData = [
  { url: "/attendance", text: "Dashboard" },
  { url: "/leave-request", text: "Leave Request" },
  { url: "/Manager", text: "Manager" },
  { url: "/Attenoverview", text: "Attendance Overview" },
  { url: "/History", text: "History" },
];

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

  const [selectedMonth, setSelectedMonth] = useState("January");
  const leaveHistory = [
    {
      month: "January",
      employeeId: "EMP001",
      name: "John Doe",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      totalDays: 3,
      reason: "Fever",
    },
    {
      month: "February",
      employeeId: "EMP002",
      name: "Jane Smith",
      startDate: "2024-02-03",
      endDate: "2024-02-05",
      totalDays: 3,
      reason: "Personal",
    },
    {
      month: "January",
      employeeId: "EMP003",
      name: "Mark Twain",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      totalDays: 3,
      reason: "Travel",
    },
    {
      month: "March",
      employeeId: "EMP004",
      name: "Lisa Ray",
      startDate: "2024-03-15",
      endDate: "2024-03-18",
      totalDays: 4,
      reason: "Family Function",
    },
    {
      month: "February",
      employeeId: "EMP005",
      name: "Tom Hardy",
      startDate: "2024-02-20",
      endDate: "2024-02-21",
      totalDays: 2,
      reason: "Emergency",
    },
  ];

  const filteredHistory = leaveHistory.filter(
    (entry) => entry.month === selectedMonth,
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "startDate" || name === "endDate") {
        updatedData.totalDays = calculateTotalDays(
          updatedData.startDate,
          updatedData.endDate,
        );
      }
      return updatedData;
    });
  };

  const calculateTotalDays = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate - startDate;
      return timeDiff >= 0
        ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
        : 0;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.employeeId ||
      !formData.name ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reportTo
    ) {
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
    backgroundColor: "#faf3dd",
  };

  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />

      <div style={styles.container}>
        <h2 style={styles.heading}>Leave Request Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.labelSelector}>
              <label style={styles.label}>Employee ID:</label>
              <input
                type="text"
                name="employeeId"
                placeholder="Enter Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>Full Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>Leave Type:</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>Report To:</label>
              <select
                name="reportTo"
                value={formData.reportTo}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="Supervisor">Samiha Thaker</option>
                <option value="Supervisor">Prerak Ghosh</option>
                <option value="Supervisor">Rohan Srinivasan</option>
                <option value="Supervisor">Nehmat Rege</option>
                <option value="Manager">Ahana Shankar</option>
                <option value="HR">Armaan Walia</option>
              </select>
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.labelSelector}>
              <label style={styles.label}>Total Days:</label>
              <input
                type="number"
                name="totalDays"
                value={formData.totalDays}
                readOnly
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.labelSelector}>
            <label style={styles.label}>Reason/Comments:</label>
            <textarea
              name="reason"
              placeholder="Enter Reason for Leave"
              value={formData.reason}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>
            <p style={{ fontWeight: "bold", color: "black", margin: "0" }}>
              Submit
            </p>
          </button>
        </form>
      </div>

      <div style={{ ...styles.container, marginTop: "30px" }}>
        <h2 style={styles.heading}>Leave History</h2>
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label style={styles.label}>Filter by Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={styles.input}
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
          </select>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#CFE1F0" }}>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Start Date</th>
              <th style={styles.th}>End Date</th>
              <th style={styles.th}>Total Days</th>
              <th style={styles.th}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry, index) => (
              <tr key={index}>
                <td style={styles.td}>{entry.employeeId}</td>
                <td style={styles.td}>{entry.name}</td>
                <td style={styles.td}>{entry.startDate}</td>
                <td style={styles.td}>{entry.endDate}</td>
                <td style={styles.td}>{entry.totalDays}</td>
                <td style={styles.td}>{entry.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "850px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "20px",
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
    gap: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f0f8ff",
    color: "#333",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
};

export default LeaveRequest;
