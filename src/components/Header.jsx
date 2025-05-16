import React, { useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { Link } from "react-router-dom";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { notifications } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search logic (if needed)
    console.log("Qidirilmoqda:", searchQuery);
  };

  return (
    <div className="bg-white h-16 shadow-sm flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      {/* Qidiruv */}
      <form onSubmit={handleSearch} className="relative w-1/3">
        <div className="relative">
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </form>

      {/* O'ng tarafdagi tugmalar */}
      <div className="flex items-center space-x-4">
        {/* Bildirishnomalar */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            onClick={toggleNotifications}
          >
            <BellIcon className="h-6 w-6 text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          {/* Bildirishnomalar menyusi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-medium">Bildirishnomalar</h3>
                <Link
                  to="/bildirishnomalar"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Hammasini ko'rish
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Yangi bildirishnomalar yo'q
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b ${
                        notification.type === "qogozKam"
                          ? "hover:bg-red-50"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.vaqt).toLocaleTimeString()} -{" "}
                        {notification.apparatId}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Foydalanuvchi */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full"
            onClick={toggleUserMenu}
          >
            <UserCircleIcon className="h-8 w-8 text-gray-500" />
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>

          {/* Foydalanuvchi menyusi */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <div className="p-3 border-b">
                <h3 className="font-medium">Admin</h3>
                <p className="text-xs text-gray-500">admin@flashprint.uz</p>
              </div>

              <div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </Link>
                <Link
                  to="/sozlamalar"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sozlamalar
                </Link>
                <div className="border-t">
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Chiqish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
