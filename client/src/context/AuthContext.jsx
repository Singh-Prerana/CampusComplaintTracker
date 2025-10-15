import { createContext, useState, useEffect } from "react";
import API from "@/api/axios";

export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);
  const login = ({ accessToken, refreshToken, role }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setUser(null);
    window.location.href = "/";
    };
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>

            {children}
        </AuthContext.Provider>
    )
}
