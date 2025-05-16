// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/SocketContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ApparatDetail from "./pages/ApparatDetail";
import ApparatYaratish from "./pages/ApparatYaratish";
import Statistika from "./pages/Statistika";
import Sozlamalar from "./pages/Sozlamalar";
import Notifications from "./components/Notifications";

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="ml-64 flex-1">
            <Header />
            <main className="pt-20 pb-6 px-6 bg-gray-100 min-h-screen">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/apparatlar" element={<Dashboard />} />
                <Route path="/apparat/:id" element={<ApparatDetail />} />
                <Route path="/apparat/yangi" element={<ApparatYaratish />} />
                <Route path="/statistika" element={<Statistika />} />
                <Route path="/bildirishnomalar" element={<Notifications />} />
                <Route path="/sozlamalar" element={<Sozlamalar />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </Router>
    </SocketProvider>
  );
};

export default App;
