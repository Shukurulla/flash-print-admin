// src/pages/ApparatDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import DaromadChart from "../components/Charts/DaromadChart";
import FoydalanuvchilarChart from "../components/Charts/FoydalanuvchilarChart";
import QogozUsageChart from "../components/Charts/QogozUsageChart";

const ApparatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apparat, setApparat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qogozSoni, setQogozSoni] = useState("");
  const [davr, setDavr] = useState("kun");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nomi: "",
    manzil: "",
    qogozSigimi: "",
    kamQogozChegarasi: "",
    holati: "faol",
  });

  useEffect(() => {
    const fetchApparatData = async () => {
      try {
        const response = await api.get(`/vending-apparat/${id}`);
        setApparat(response.data.malumot);
        setFormData({
          nomi: response.data.malumot.nomi,
          manzil: response.data.malumot.manzil || "",
          qogozSigimi: response.data.malumot.qogozSigimi,
          kamQogozChegarasi: response.data.malumot.kamQogozChegarasi,
          holati: response.data.malumot.holati,
        });
        setQogozSoni(response.data.malumot.joriyQogozSoni.toString());
        setLoading(false);
      } catch (error) {
        console.error("Apparat ma'lumotlarini olishda xatolik:", error);
        toast.error("Apparat ma'lumotlarini olishda xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchApparatData();
  }, [id]);

  const handleQogozUpdate = async (e) => {
    e.preventDefault();

    if (!qogozSoni || isNaN(qogozSoni) || parseInt(qogozSoni) < 0) {
      toast.error("Iltimos, to'g'ri qog'oz sonini kiriting");
      return;
    }

    try {
      const sonInt = parseInt(qogozSoni);
      await api.put(`/vending-apparat/${id}/qogoz`, { soni: sonInt });
      toast.success("Qog'oz soni muvaffaqiyatli yangilandi");

      // Apparat ma'lumotlarini yangilash
      setApparat({
        ...apparat,
        joriyQogozSoni: sonInt,
        oxirgiToladirishVaqti: new Date(),
      });
    } catch (error) {
      console.error("Qog'oz sonini yangilashda xatolik:", error);
      toast.error("Qog'oz sonini yangilashda xatolik yuz berdi");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleApparatUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/vending-apparat/${id}`, formData);
      toast.success("Apparat ma'lumotlari muvaffaqiyatli yangilandi");
      setApparat({ ...apparat, ...response.data.malumot });
      setEditMode(false);
    } catch (error) {
      console.error("Apparat ma'lumotlarini yangilashda xatolik:", error);
      toast.error("Apparat ma'lumotlarini yangilashda xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Haqiqatan ham bu apparatni o'chirib tashlamoqchimisiz?")
    ) {
      try {
        await api.delete(`/vending-apparat/${id}`);
        toast.success("Apparat muvaffaqiyatli o'chirildi");
        navigate("/");
      } catch (error) {
        console.error("Apparatni o'chirishda xatolik:", error);
        toast.error("Apparatni o'chirishda xatolik yuz berdi");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!apparat) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-500">Apparat topilmadi</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const qogozFoiz = (apparat.joriyQogozSoni / apparat.qogozSigimi) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{apparat.nomi}</h1>
        <div>
          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Bekor qilish
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Tahrirlash
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            O'chirish
          </button>
        </div>
      </div>

      {editMode ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            Apparat ma'lumotlarini tahrirlash
          </h2>
          <form onSubmit={handleApparatUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apparat nomi
                </label>
                <input
                  type="text"
                  name="nomi"
                  value={formData.nomi}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manzil
                </label>
                <input
                  type="text"
                  name="manzil"
                  value={formData.manzil}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qog'oz sig'imi
                </label>
                <input
                  type="number"
                  name="qogozSigimi"
                  value={formData.qogozSigimi}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kam qog'oz chegarasi
                </label>
                <input
                  type="number"
                  name="kamQogozChegarasi"
                  value={formData.kamQogozChegarasi}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holati
                </label>
                <select
                  name="holati"
                  value={formData.holati}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="faol">Faol</option>
                  <option value="tamirlashda">Tamirlashda</option>
                  <option value="ishlamayapti">Ishlamayapti</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Apparat ma'lumotlari</h2>
              <p className="mb-2">
                <span className="font-medium">ID:</span> {apparat.apparatId}
              </p>
              <p className="mb-2">
                <span className="font-medium">Nomi:</span> {apparat.nomi}
              </p>
              <p className="mb-2">
                <span className="font-medium">Manzil:</span>{" "}
                {apparat.manzil || "Ko'rsatilmagan"}
              </p>
              <p className="mb-2">
                <span className="font-medium">Holati:</span> {apparat.holati}
              </p>
              <p className="mb-2">
                <span className="font-medium">Yaratilgan sana:</span>{" "}
                {new Date(apparat.yaratilganVaqt).toLocaleString()}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Qog'oz holati</h2>
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>
                    Joriy qog'oz soni: {apparat.joriyQogozSoni} /{" "}
                    {apparat.qogozSigimi}
                  </span>
                  <span>{Math.round(qogozFoiz)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${
                      qogozFoiz <= 20
                        ? "bg-red-500"
                        : qogozFoiz <= 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${qogozFoiz}%` }}
                  ></div>
                </div>

                <p className="mb-4">
                  <span className="font-medium">Kam qog'oz chegarasi:</span>{" "}
                  {apparat.kamQogozChegarasi}
                </p>

                <p className="mb-4">
                  <span className="font-medium">Oxirgi to'ldirilgan vaqt:</span>{" "}
                  {new Date(apparat.oxirgiToladirishVaqti).toLocaleString()}
                </p>

                <form
                  onSubmit={handleQogozUpdate}
                  className="flex items-end space-x-2"
                >
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yangi qog'oz soni
                    </label>
                    <input
                      type="number"
                      value={qogozSoni}
                      onChange={(e) => setQogozSoni(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      min="0"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Yangilash
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Statistika</h2>
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
            // src/pages/ApparatDetail.jsx (davomi)
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
            className={`px-4 py-2 rounded ${
              davr === "yil" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Yil
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <DaromadChart davr={davr} apparatId={apparat.apparatId} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <FoydalanuvchilarChart davr={davr} apparatId={apparat.apparatId} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QogozUsageChart davr={davr} apparatId={apparat.apparatId} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Faol fayllar</h2>
        {/* Bu yerga apparat fayllarini ko'rsatish kerak */}
      </div>
    </div>
  );
};

export default ApparatDetail;
