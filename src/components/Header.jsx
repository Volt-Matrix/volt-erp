import React from "react";
import CurrentTime from "./CurrentTime";
import ClientLogo from "./ClientLogo";
const styles = {
  header: {
  

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
