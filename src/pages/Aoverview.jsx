import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/styles/aoverview.css";

const moduleBarData = [
  {url: "/attendance", text: "Dashboard"},
  {url: "/leave-request", text: "Leave Request"},
  {url: "/Manager", text: "Manager"},
  {url: "/Attenoverview", text: "Attendance Overview"},
  {url:"/History", text: "History"}
]
const holidays = [
  { name: "New Year's Day :", date: "2025-01-01" },
  { name: "Republic Day", date: "2025-01-26" },
  { name: "Holi", date: "2025-03-14" },
  { name: "Eid-ul-Fitr (Ramzan)", date: "2025-03-31" },
  { name: "Mahavir Jayanti", date: "2025-04-10" },
  { name: "Dr. B.R. Ambedkar Jayanti", date: "2025-04-14" },
  { name: "Good Friday", date: "2025-04-18" },
  { name: "Buddha Purnima", date: "2025-05-12" },
  { name: "Bakrid / Eid al-Adha", date: "2025-06-07" },
  { name: "Independence Day", date: "2025-08-15" },
  { name: "Mahatma Gandhi Jayanti", date: "2025-10-02" },
  { name: "Dussehra (Vijaya Dashami)", date: "2025-10-20" },
  { name: "Diwali (Deepavali)", date: "2025-10-21" },
  { name: "Christmas Day", date: "2025-12-25" }
];

const formatDate = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

const employeeData = {
  name: "John Doe",
  sessions: [
    { checkIn: "08:45 AM", checkOut: "12:30 PM" },
    { checkIn: "01:15 PM", checkOut: "03:30 PM" },
    { checkIn: "03:45 PM", checkOut: "05:30 PM" }
  ],
  totalTimeSpent: "8h 45m",
  faceRecognition: "Verified",
  thumbVerification: "Verified",
};

const Dashboard = () => {
  return (
    <div className="dashboard-container-at">
      <h1 className="dashboard-title">Employee Biometric Details</h1>
      <div className="bio-container">
        <div className="row">
          {employeeData.sessions.map((session, index) => (
            <div key={index} className="bio-session">
              Session {index + 1}: {session.checkIn} - {session.checkOut}
            </div>
          ))}
        </div>
        <div className="row">
          <div className="bio time-spent">Total Time Spent: {employeeData.totalTimeSpent}</div>
          <div className="bio face-recognition">Face Recognition: {employeeData.faceRecognition}</div>
          <div className="bio thumb-verification">Thumb Verification: {employeeData.thumbVerification}</div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [date, setDate] = useState(new Date());
  const formattedDate = formatDate(date);
  const holiday = holidays.find((h) => h.date === formattedDate);

  return (
    <div className="container">
      <h1>Calendar and Holiday List</h1>
      <div className="content">
        <div className="calcard">
          <div className="Card1">
            <h2>Calendar</h2>
          </div>
          <Calendar onChange={setDate} value={date} />
        </div>
        <div className="calcard">
          <div className="Card1">
            <h2>Upcoming Holidays</h2>
          </div>
          <div className="holiday-list">
            {holidays.map((h, index) => (
              <div key={index} className="holiday-card">
                <div className="hol"><h4>{h.name}</h4>
                <p className="dat">{h.date}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default App;
