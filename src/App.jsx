import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
  const [logginIn, setLoggingIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const changeLogin = () => {
    setLoggingIn(true);
  };

  useEffect(() => {
    console.log("Login state---", logginIn, location.pathname == "/login");
    // if (location.pathname == "/login" && logginIn) {
    //   navigate("/trail/page1");
    // } else {
    //   navigate("/login");
    // }
  }, [logginIn]);

  return (
    <div>
      <AuthContext.Provider
        value={{ isLoginIn: logginIn, changeLogin: changeLogin }}
      >
        <AppRoutes />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
