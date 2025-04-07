import React, { useEffect, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
  useLocation,
} from "react-router-dom";
import Home from "../pages/Home";
import Help from "../pages/Help";
import Attendance from "../pages/Attendance";
import NotFound from "../pages/NotFound";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

import Equipment from "../pages/Equipment";
import Materials from "../pages/Materials";
import SalesTargets from "../pages/SalesTargets";
import SiteVisits from "../pages/SiteVisits";
import WorkProgress from "../pages/WorkProgress";
import WorkUpdates from "../pages/WorkUpdates";

import History from "../pages/History";
import Aoverview from "../pages/Aoverview";
import Manager from "../pages/Manager";
import Mpage from "../pages/Mpage";
import Moverview from "../pages/Moverview";
import Biodetail from "../pages/Biodetail";

import CurrentTime from "../components/CurrentTime";
import LabourManagement from "../pages/LabourManagement";
import LeaveRequest from "../pages/LeaveRequest";
import AddNewStock from "../pages/AddNewStock";
import AddEmployee from "../pages/AddEmployee";
import AddWorkProgressForm from "../pages/AddWorkProgressForm";
import WorkProgressTable from "../pages/WorkProgressTable";
import StockLevel from "../pages/StockLevel";
import StockHistory from "../pages/StockHistory";
import AddNewMaterial from "../pages/AddNewMaterial";
import DailyMaterialUsage from "../pages/DailyMaterialUsage";
import AddUsedStock from "../pages/AddUsedStock";


import ClientLogo from "../components/ClientLogo";

import StockLevelTemp from "../pages/SL-temp";
import NavLayout from "../components/NavLayout/NavLayout";
import LoginPage from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
function AppRoutes() {
  return (
    <div>
      <Header />
      <div className="main-content">
        <SideBar />
        <div className="center-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/labour-management" element={<LabourManagement />} />
            <Route path="/leave-request" element={<LeaveRequest />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/sales-targets" element={<SalesTargets />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/add-new-stock" element={<AddNewStock />} />
            <Route path="/used-stock" element={<AddUsedStock />} />
            <Route path="/add-new-material" element={<AddNewMaterial />} />
            <Route path="/stock-history" element={<StockHistory />} />
            <Route path="/daily-usage" element={<DailyMaterialUsage />} />
            <Route path="stock-level" element={<StockLevel />} />
            <Route path="stock-level-temp" element={<StockLevelTemp />} />
            <Route path="/work-progress" element={<WorkProgress />} />
            <Route
              path="/add-work-progress"
              element={<AddWorkProgressForm />}
            />
            <Route
              path="/work-progress-table"
              element={<WorkProgressTable />}
            />
            <Route path="/work-updates" element={<WorkUpdates />} />
            <Route path="/site-visits" element={<SiteVisits />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route path="trail" element={<NavLayout />}>
              <Route path="page1" element={<SiteVisits />} />
              <Route path="page2" element={<Equipment />} />
            </Route> */}
            <Route path="login" element={<LoginPage />} />

            <Route path="History" element={<History />} />
            <Route path="Aoverview" element={<Aoverview />} />
            <Route path="Manager" element={<Manager />} />
            <Route path="Mpage" element={<Mpage />} />
            <Route path="Moverview" element={<Moverview />} />
            <Route path="Biodetail" element={<Biodetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AppRoutes;
