// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  PrinterIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: "Boshqaruv paneli", path: "/", icon: HomeIcon },
    { name: "Vending apparatlar", path: "/apparatlar", icon: PrinterIcon },
    { name: "To'lovlar", path: "/tolovlar", icon: CurrencyDollarIcon }, // Yangi qo'shildi
    { name: "Statistika", path: "/statistika", icon: ChartBarIcon },
    { name: "Bildirishnomalar", path: "/bildirishnomalar", icon: BellIcon },
    { name: "Sozlamalar", path: "/sozlamalar", icon: Cog6ToothIcon },
  ];
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-6">Flash Print</h1>

        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-md ${
                    location.pathname === item.path
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="absolute bottom-0 p-5 w-full border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
            A
          </div>
          <div>
            <p className="font-medium">Admin</p>
            <p className="text-xs text-gray-400">admin@flashprint.uz</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
