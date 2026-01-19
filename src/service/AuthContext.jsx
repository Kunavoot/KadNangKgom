import React, { createContext, useState, useContext } from 'react';

// 1. สร้าง Context
const AuthContext = createContext(null);

// 2. สร้าง Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. สร้าง Custom Hook เพื่อเรียกใช้ง่ายๆ
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);