import React from "react";
import CurrentTime from "./CurrentTime";
import ClientLogo from "./ClientLogo";
const styles = {
  header: {
    // width: "fit-content",

    width: "100%",
    textAlign: "center",

    // top: "0px",
    // left: "calc(50vw + 80px)", // position left edge at 50vw + (width of side bar)/2
    // left: "0px",
    // transform: "translateX(-50%)",
    zIndex: 1000,
    padding: "9px 20px 9px 20px",
    boxShadow: "0px 2px 2px rgba(0,0,0,0.25)",
    borderRadius: "3px",
    backgroundColor: "#006400", // "#196f5d", /* "#0077b6",*/ //"#0096c7",
    borderBottom: "1.2px solid #5e548e", //
  },

  h2Style: {
    margin: "0",
    color: "white",
  },
};

const Header = () => {
  return (
    <header className="top-header" style={styles.header}>
      <ClientLogo />
      <h2 style={styles.h2Style}>Dashboard overview</h2>
      <CurrentTime />
    </header>
  );
};

export default Header;
