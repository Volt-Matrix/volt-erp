import React from "react";
import CurrentTime from "./CurrentTime";
import ClientLogo from "./ClientLogo";
const styles = {
  header: {
    width: "100%",
    zIndex: 1000,
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
