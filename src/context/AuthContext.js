import { createContext } from "react";
export const AuthContext = createContext({ isLoginIn: false, role: "guest" });
