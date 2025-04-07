import React, { useState } from "react";
import "../assets/styles/Biodetail.css";

const moduleBarData = [
    {url: "/attendance", text: "Dashboard"},
    {url: "/leave-request", text: "Leave Request"},
    {url: "/Manager", text: "Manager"},
    {url: "/Attenoverview", text: "Attendance Overview"},
    {url:"/History", text: "History"}
  ]

const EmployeeLeaveDetails = () => {
  const employees = [
    { 
      id: "E001", 
      name: "Alice", 
      leavesUsed: 5, 
      leavesBalance: 5, 
      halfDaysUsed: 2, 
      biometricDetails: [
        { date: "2023-03-01", checkIn: "09:00 AM", checkOut: "06:00 PM" },
        { date: "2023-03-02", checkIn: "09:15 AM", checkOut: "06:15 PM" },
        { date: "2023-03-03", checkIn: "09:05 AM", checkOut: "06:05 PM" },
        { date: "2023-03-04", checkIn: "09:30 AM", checkOut: "06:00 PM" },
        { date: "2023-03-05", checkIn: "09:00 AM", checkOut: "06:10 PM" }
      ] 
    },
    { 
      id: "E002", 
      name: "Bob", 
      leavesUsed: 7, 
      leavesBalance: 3, 
      halfDaysUsed: 1, 
      biometricDetails: [
        { date: "2023-03-01", checkIn: "09:00 AM", checkOut: "06:00 PM" },
        { date: "2023-03-02", checkIn: "09:05 AM", checkOut: "06:05 PM" },
        { date: "2023-03-03", checkIn: "09:10 AM", checkOut: "06:00 PM" },
        { date: "2023-03-04", checkIn: "09:15 AM", checkOut: "06:20 PM" },
        { date: "2023-03-05", checkIn: "09:20 AM", checkOut: "06:15 PM" }
      ]
    },
    { 
      id: "E003", 
      name: "Charlie", 
      leavesUsed: 4, 
      leavesBalance: 6, 
      halfDaysUsed: 0, 
      biometricDetails: [
        { date: "2023-03-01", checkIn: "09:00 AM", checkOut: "06:00 PM" },
        { date: "2023-03-02", checkIn: "09:10 AM", checkOut: "06:10 PM" },
        { date: "2023-03-03", checkIn: "09:05 AM", checkOut: "06:00 PM" },
        { date: "2023-03-04", checkIn: "09:00 AM", checkOut: "06:00 PM" },
        { date: "2023-03-05", checkIn: "09:20 AM", checkOut: "06:00 PM" }
      ]
    },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEmployeeClick = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    setSelectedEmployee(employee);
  };

  return (
    <div className="employee-leave-details">
      <div className="employee-filter">
        <h2>Employee ID- Employee Name </h2>
        <select onChange={(e) => handleEmployeeClick(e.target.value)}>
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.id} 
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee ? (
        <div className="employee-details">
          <h3>{selectedEmployee.name} </h3>
          <ul>
            <li><strong>Leaves Used:</strong> {selectedEmployee.leavesUsed}</li>
            <li><strong>Leaves Balance:</strong> {selectedEmployee.leavesBalance}</li>
            <li><strong>Half Days Used:</strong> {selectedEmployee.halfDaysUsed}</li>
          </ul>

          {/* Biometric Details Table */}
          <div className="biometric-table-container">
            <h4>Biometric Check-In/Check-Out Details</h4>
            <table className="biometric-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmployee.biometricDetails.map((biometric, index) => (
                  <tr key={index}>
                    <td>{biometric.date}</td>
                    <td>{biometric.checkIn}</td>
                    <td>{biometric.checkOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Please select an employee to view their details.</p>
      )}
    </div>
  );
};

export default EmployeeLeaveDetails;
