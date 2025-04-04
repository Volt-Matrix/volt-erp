import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import { Navigate, Outlet, useLocation, redirect } from "react-router-dom";
import SideBar from "../SideBar";
import { AuthContext } from "../../context/AuthContext";
// import { red } from "@mui/material/colors";

function NavLayout() {
  const auth = useContext(AuthContext);

  if (auth.isLoginIn) {
    return (
      <div>
        <Header />
        <div className="main-content">
          <SideBar />
          <div className="center-content">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default NavLayout;
