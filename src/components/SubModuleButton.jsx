import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/submodule-button.css";

import { useLocation } from "react-router-dom";

// const optionStyle = {
//     textDecoration: "none",
//     color: "white",
//     fontWeight: "bold",
//     background: "#4EA7D1",
//     borderRadius: "25px",
//     fontSize: "14px",
//     height: "fit-content",
//     display: "inline-block",
//     whiteSpace: "nowrap",
//     margin: "10px",
//     padding: "5px",
//     width: '150px',
//     boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.25)"
// }

function SubModuleOption(props) {
  const location = useLocation();
  const currPath = location.pathname;
  const isActive = currPath === props.url;
  return (
    <Link to={props.url} className={`sub-button ${isActive ? "active" : ""}`}>
      {props.text}
    </Link>
  );
}

export default SubModuleOption;
