import React from "react";
import { Link } from "react-router-dom";
import SideBarOption from "./SideBarOpton";
import {
  MdHome,
  MdCalendarMonth,
  MdTrendingUp,
  MdConstruction,
  MdAssessment,
  MdLocalShipping,
  MdHelp,
  MdManageAccounts,
} from "react-icons/md";
const styles = {
  sidebar: {
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "4px 3px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#F4F8F7",
    overFlow: "auto",
  },
};

function SideBar() {
  return (
    <div style={styles.sidebar}>
      <h3>Menu</h3>
      <SideBarOption optionUrl="/" optionName="Home" icon={<MdHome />} />
      <SideBarOption
        optionUrl="/labour-management"
        optionName="Employee Management"
        icon={<MdManageAccounts />}
      />
      <SideBarOption
        optionUrl="/attendance"
        optionName="Attendance"
        icon={<MdCalendarMonth />}
      />
      <SideBarOption
        optionUrl="/sales-targets"
        optionName="Sales Targets"
        icon={<MdTrendingUp />}
      />
      <SideBarOption
        optionUrl="/materials"
        optionName="Materials & Inventory"
        icon={<MdConstruction />}
      />
      <SideBarOption
        optionUrl="/work-progress"
        optionName="Work Progress"
        icon={<MdAssessment />}
      />
      {/* <SideBarOption optionUrl="/site-visits" optionName="Site Visits"/> */}
      <SideBarOption
        optionUrl="/equipment"
        optionName="Equipment"
        icon={<MdLocalShipping />}
      />
      {/* <SideBarOption
        optionUrl="/trail"
        optionName="trail"
        icon={<MdLocalShipping />}
      />
      <SideBarOption
        optionUrl="/trail/page1"
        optionName="trail1"
        icon={<MdLocalShipping />}
      />
      <SideBarOption
        optionUrl="/trail/page2"
        optionName="trail2"
        icon={<MdLocalShipping />}
      /> */}
      <SideBarOption optionUrl="/help" optionName="Help" icon={<MdHelp />} />
    </div>
  );
}

export default SideBar;
