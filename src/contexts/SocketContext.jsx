// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket.io serverga ulandi");
    });

    newSocket.on("qogozKam", (data) => {
      const notification = {
        id: Date.now(),
        type: "qogozKam",
        message: data.xabar,
        apparatId: data.apparatId,
        vaqt: new Date(),
      };

      setNotifications((prev) => [notification, ...prev]);
      toast.error(data.xabar);
    });

    newSocket.on("tolovMuvaffaqiyatli", (data) => {
      const notification = {
        id: Date.now(),
        type: "tolov",
        message: `Yangi to'lov qabul qilindi: ${data.amount} so'm`,
        apparatId: data.apparatId,
        vaqt: new Date(),
      };

      setNotifications((prev) => [notification, ...prev]);
      toast.success(notification.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, clearNotification }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
