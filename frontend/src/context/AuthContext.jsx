import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axios.post("/api/auth/login", credentials);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await axios.post("/api/auth/register", data);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
