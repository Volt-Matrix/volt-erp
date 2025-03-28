// import zIndex from "@mui/material/styles/zIndex";
import React, { useState, useEffect } from "react";

const timeTextStyle = {
  fontWeight: "bold",
  fontSize: "16px",
  margin: 0,
  color: "white",
}; // gray

function CurrentTime() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setFormattedDate(
        date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit", // Added seconds for real-time updates
        })
      );
    };

    updateTime(); // Update immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <p style={timeTextStyle}>{formattedDate}</p>
    </div>
  );
}

export default CurrentTime;
