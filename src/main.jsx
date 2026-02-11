import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./service/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import TraderPage from "./pages/Trader/TraderPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          <Route path="/admin" element={<AdminPage />} />
          <Route path="/trader" element={<TraderPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
