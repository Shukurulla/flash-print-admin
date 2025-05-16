// src/App.jsx (tuzatilgan versiya - Layout komponentini ishlatib)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/SocketContext";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ApparatDetail from "./pages/ApparatDetail";
import ApparatYaratish from "./pages/ApparatYaratish";
import Statistika from "./pages/Statistika";
import Sozlamalar from "./pages/Sozlamalar";
import Notifications from "./components/Notifications";
import TolovlarPage from "./pages/TolovlarPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Himoyalangan yo'nalishlar */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/apparatlar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/apparat/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ApparatDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/apparat/yangi"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ApparatYaratish />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tolovlar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TolovlarPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/statistika"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Statistika />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bildirishnomalar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/sozlamalar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Sozlamalar />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </SocketProvider>
    </Router>
  );
};

export default App;
