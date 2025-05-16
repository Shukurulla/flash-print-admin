// src/contexts/AuthContext.jsx (yangi fayl)
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage dan token va admin ma'lumotlarini olish
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        // API uchun default header o'rnatish
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAdmin(JSON.parse(adminData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth xatolik:", error);
        // Token xato bo'lsa, tizimdan chiqarish
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/api/admin/login", {
        username,
        password,
      });

      const { token, admin } = response.data.malumot;

      // LocalStorage ga saqlash
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));

      // API uchun default header o'rnatish
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAdmin(admin);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Login xatolik:", error);
      throw error;
    }
  };

  const logout = () => {
    // LocalStorage dan o'chirish
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    // API headerlarini tozalash
    delete api.defaults.headers.common["Authorization"];

    setAdmin(null);
    setIsAuthenticated(false);

    // Login sahifasiga yo'naltirish
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ admin, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
