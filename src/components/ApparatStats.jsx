import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { formatSana, formatSumma } from "../utils/helpers";

const ApparatStats = ({ apparatId, davr }) => {
  const [stats, setStats] = useState({
    umumiyDaromad: 0,
    foydalanishSoni: 0,
    ishlatilganQogoz: 0,
    ortachaDaromad: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          `/vending-apparat/${apparatId}/statistika?davr=${davr}`
        );
        const statistika = response.data.malumot;

        // Statistikani hisoblash
        const umumiyDaromad = statistika.reduce(
          (sum, item) => sum + item.daromad,
          0
        );
        const foydalanishSoni = statistika.reduce(
          (sum, item) => sum + item.foydalanishSoni,
          0
        );
        const ishlatilganQogoz = statistika.reduce(
          (sum, item) => sum + item.ishlatilganQogoz,
          0
        );
        const ortachaDaromad =
          foydalanishSoni > 0 ? umumiyDaromad / foydalanishSoni : 0;

        setStats({
          umumiyDaromad,
          foydalanishSoni,
          ishlatilganQogoz,
          ortachaDaromad,
        });
        setLoading(false);
      } catch (error) {
        console.error("Statistikani olishda xatolik:", error);
        toast.error("Statistikani olishda xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchStats();
  }, [apparatId, davr]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm">Umumiy daromad</h3>
        <p className="text-2xl font-bold">{formatSumma(stats.umumiyDaromad)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm">Foydalanish soni</h3>
        <p className="text-2xl font-bold">{stats.foydalanishSoni}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm">Ishlatilgan qog'oz</h3>
        <p className="text-2xl font-bold">{stats.ishlatilganQogoz} varaq</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm">O'rtacha daromad</h3>
        <p className="text-2xl font-bold">
          {formatSumma(stats.ortachaDaromad)}
        </p>
        <p className="text-xs text-gray-500">har bir foydalanishga</p>
      </div>
    </div>
  );
};

export default ApparatStats;
