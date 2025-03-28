import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/side-bar-option.css";

import { useLocation } from "react-router-dom";

const page2ModuleMapping = {
  "/": "/",
  "/labour-management": "/labour-management",
  "/add-employee": "/labour-management",
  "/attendance": "/attendance",
  "/leave-request": "/attendance",
  "/sales-targets": "/sales-targets",
  "/materials": "/materials",
  "/stock-level": "/materials",
  "/add-new-stock": "/materials",
  "/work-progress": "/work-progress",
  "/add-work-progress": "/work-progress",
  "/equipment": "/equipment",
  "/help": "/help",
};

function SideBarOption(props) {
  const location = useLocation();
  const currPath = location.pathname;
  const pageModule = page2ModuleMapping[currPath];

  const isActive = pageModule === props.optionUrl;

  return (
    <Link
      to={props.optionUrl}
      className={`sidebar-option ${isActive ? "active" : ""}`}
    >
      <div className="sidebar-icon">
        {React.cloneElement(props.icon, { style: { fontSize: 25 } })}
      </div>
      <div className="sidebar-option-text">{props.optionName}</div>
    </Link>
  );
}

export default SideBarOption;
