import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // เริ่มต้น State จาก localStorage ถ้ามีข้อมูลอยู่
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // บันทึกลง localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // ล้างข้อมูลใน localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
