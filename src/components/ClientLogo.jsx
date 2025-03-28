import React from "react";
const IMAGE_URL = "/data/sphere-logo.png";

const pStyle = {
  fontWeight: "bold",
  color: "white",
};

function ClientLogo() {
  return (
    <div className="logo-container">
      <img src={IMAGE_URL} width={"55px"} />
      <p style={pStyle}>CONSTRUCTIONS</p>
    </div>
  );
}

export default ClientLogo;
