// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import ApparatList from "./ApparatList";
import Notifications from "./Notifications";
import DaromadChart from "./Charts/DaromadChart";
import FoydalanuvchilarChart from "./Charts/FoydalanuvchilarChart";
import QogozUsageChart from "./Charts/QogozUsageChart";
import api from "../services/api";

const Dashboard = () => {
  const { notifications } = useSocket();
  const [apparatlar, setApparatlar] = useState([]);
  const [statistics, setStatistics] = useState({
    umumiyDaromad: 0,
    bugungiDaromad: 0,
    foydalanuvchilarSoni: 0,
    faolApparatlar: 0,
    qogozKamApparatlar: 0,
  });
  const [davr, setDavr] = useState("kun");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/vending-apparat");
        setApparatlar(response.data.malumot);

        // Statistikani hisoblash
        const faolApparatlar = response.data.malumot.filter(
          (a) => a.holati === "faol"
        ).length;
        const qogozKamApparatlar = response.data.malumot.filter(
          (a) => a.joriyQogozSoni <= a.kamQogozChegarasi
        ).length;

        setStatistics((prev) => ({
          ...prev,
          faolApparatlar,
          qogozKamApparatlar,
        }));

        // Daromadni olish
        const statsResponse = await api.get(`/statistika?davr=${davr}`);
        const umumiyDaromad = statsResponse.data.malumot.reduce(
          (sum, item) => sum + item.daromad,
          0
        );

        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        const bugungiDaromad = statsResponse.data.malumot
          .filter((s) => new Date(s.sana) >= bugun)
          .reduce((sum, item) => sum + item.daromad, 0);

        const foydalanuvchilarSoni = statsResponse.data.malumot
          .filter((s) => new Date(s.sana) >= bugun)
          .reduce((sum, item) => sum + item.foydalanishSoni, 0);

        setStatistics((prev) => ({
          ...prev,
          umumiyDaromad,
          bugungiDaromad,
          foydalanuvchilarSoni,
        }));
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error);
      }
    };

    fetchData();

    // Ma'lumotlarni har 30 sekundda yangilash
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [davr]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Boshqaruv paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Bugungi daromad</h3>
          <p className="text-3xl font-bold">
            {statistics.bugungiDaromad.toLocaleString()} so'm
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Foydalanuvchilar soni</h3>
          <p className="text-3xl font-bold">
            {statistics.foydalanuvchilarSoni}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Faol apparatlar</h3>
          <p className="text-3xl font-bold">{statistics.faolApparatlar}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Qog'oz kam apparatlar</h3>
          <p className="text-3xl font-bold text-red-500">
            {statistics.qogozKamApparatlar}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Daromad statistikasi</h2>
          <div className="flex mb-4">
            <button
              onClick={() => setDavr("kun")}
              className={`mr-2 px-4 py-2 rounded ${
                davr === "kun" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Bugun
            </button>
            <button
              onClick={() => setDavr("hafta")}
              className={`mr-2 px-4 py-2 rounded ${
                davr === "hafta" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Hafta
            </button>
            <button
              onClick={() => setDavr("oy")}
              className={`mr-2 px-4 py-2 rounded ${
                davr === "oy" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Oy
            </button>
            <button
              onClick={() => setDavr("yil")}
              // src/components/Dashboard.jsx (davomi)
              className={`px-4 py-2 rounded ${
                davr === "yil" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Yil
            </button>
          </div>
          <DaromadChart davr={davr} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Bildirishnomalar</h2>
          <Notifications />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Foydalanuvchilar soni</h2>
          <FoydalanuvchilarChart davr={davr} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Qog'oz foydalanish</h2>
          <QogozUsageChart davr={davr} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Vending apparatlar</h2>
        <ApparatList apparatlar={apparatlar} />
      </div>
    </div>
  );
};

export default Dashboard;
