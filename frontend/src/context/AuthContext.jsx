import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axiosInstance.post("/api/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await axiosInstance.post("/api/auth/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axiosInstance.get("/api/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
