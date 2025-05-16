// src/pages/ApparatYaratish.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";

const ApparatYaratish = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomi: "",
    apparatId: "",
    manzil: "",
    qogozSigimi: 1000,
    joriyQogozSoni: 1000,
    kamQogozChegarasi: 200,
    holati: "faol",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "qogozSigimi" ||
        name === "joriyQogozSoni" ||
        name === "kamQogozChegarasi"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/vending-apparat", formData);
      toast.success("Yangi vending apparat muvaffaqiyatli qo'shildi");
      navigate(`/apparat/${response.data.malumot._id}`);
    } catch (error) {
      console.error("Apparat qo'shishda xatolik:", error);
      toast.error(
        "Apparat qo'shishda xatolik yuz berdi: " +
          (error.response?.data?.xabar || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yangi Vending Apparat</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apparat nomi *
              </label>
              <input
                type="text"
                name="nomi"
                value={formData.nomi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apparat ID *
              </label>
              <input
                type="text"
                name="apparatId"
                value={formData.apparatId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                placeholder="Masalan: VP001"
              />
              <p className="text-xs text-gray-500 mt-1">
                Noyob identifikator bo'lishi kerak
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil
              </label>
              <input
                type="text"
                name="manzil"
                value={formData.manzil}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Masalan: IT Park, 1-qavat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qog'oz sig'imi *
              </label>
              <input
                type="number"
                name="qogozSigimi"
                value={formData.qogozSigimi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joriy qog'oz soni *
              </label>
              <input
                type="number"
                name="joriyQogozSoni"
                value={formData.joriyQogozSoni}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max={formData.qogozSigimi}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kam qog'oz chegarasi *
              </label>
              <input
                type="number"
                name="kamQogozChegarasi"
                value={formData.kamQogozChegarasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Bu qiymatdan kamaysa, bildirishnoma yuboriladi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holati *
              </label>
              <select
                name="holati"
                value={formData.holati}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="faol">Faol</option>
                <option value="tamirlashda">Tamirlashda</option>
                <option value="ishlamayapti">Ishlamayapti</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApparatYaratish;
