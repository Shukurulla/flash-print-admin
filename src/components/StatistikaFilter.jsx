import React, { useState, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import api from "../services/api";

const StatistikaFilter = ({ onFilterChange }) => {
  const [apparatlar, setApparatlar] = useState([]);
  const [filters, setFilters] = useState({
    apparatId: "all",
    davr: "kun",
    boshlanishSana: "",
    tugashSana: "",
  });

  useEffect(() => {
    const fetchApparatlar = async () => {
      try {
        const response = await api.get("/vending-apparat");
        setApparatlar(response.data.malumot);
      } catch (error) {
        console.error("Apparatlarni olishda xatolik:", error);
      }
    };

    fetchApparatlar();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Statistika filtrlari</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Apparat tanlash */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vending Apparat
          </label>
          <select
            name="apparatId"
            value={filters.apparatId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha apparatlar</option>
            {apparatlar.map((apparat) => (
              <option key={apparat._id} value={apparat.apparatId}>
                {apparat.nomi}
              </option>
            ))}
          </select>
        </div>

        {/* Davr tanlash */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Davr
          </label>
          <select
            name="davr"
            value={filters.davr}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="kun">Bugun</option>
            <option value="hafta">Shu hafta</option>
            <option value="oy">Shu oy</option>
            <option value="yil">Shu yil</option>
            <option value="custom">Maxsus davr</option>
          </select>
        </div>

        {/* Maxsus davr uchun sana tanlash */}
        {filters.davr === "custom" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boshlanish sanasi
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="boshlanishSana"
                  value={filters.boshlanishSana}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={filters.davr === "custom"}
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tugash sanasi
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tugashSana"
                  value={filters.tugashSana}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={filters.davr === "custom"}
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </>
        )}

        {/* Filter tugmasi */}
        <div
          className={`${
            filters.davr === "custom" ? "md:col-span-4" : "md:col-span-2"
          } flex items-end`}
        >
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Filtrlash
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatistikaFilter;
