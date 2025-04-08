import React from "react";
import SubModuleBar from "../components/SubModuleBar";
import "../assets/styles/sales.css";

import SalesChart from "../components/SalesChart";
import ReadySellUnits from "../components/ReadySellUnits";

const redirectURL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.iconfinder.com%2Fdata%2Ficons%2Fuser-interface-5-basic-outline%2F24%2Fshare_arrow_send_redirect_shortcut-512.png&f=1&nofb=1&ipt=78559a66be0cbe03a3b3c9d7c9a32a60f50771846595e90e63513d39affafb97&ipo=images";
const moduleBarData = [
  { url: "/sales-targets", text: "Analytics" },
  { url: { redirectURL }, text: "CRM" },
];

function SalesTargets() {
  return (
    <div>
      <SubModuleBar moduleData={moduleBarData} />
      <div className="sales-main-container">
        <div className="sales-trends">
          <div className="drop-down-row">
            <p style={{ margin: 0, fontSize: "1.2em" }}>
              Sales trends categorised by project and type
            </p>
          </div>

          <div className="line-chart-area">
            <SalesChart />
          </div>
        </div>

        <div className="ready-sell-units-unsold-units">
          <ReadySellUnits />

          {/* <div className="vertical-line">

                    </div> */}

          <div className="unsold-units-area"></div>
        </div>
      </div>
    </div>
  );
}

export default SalesTargets;
