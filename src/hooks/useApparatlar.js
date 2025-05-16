import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { useSocket } from "../contexts/SocketContext";

export const useApparatlar = () => {
  const [apparatlar, setApparatlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchApparatlar = async () => {
      try {
        const response = await api.get("/vending-apparat");
        setApparatlar(response.data.malumot);
        setLoading(false);
      } catch (error) {
        console.error("Apparatlarni olishda xatolik:", error);
        setError("Apparatlarni olishda xatolik yuz berdi");
        setLoading(false);
        toast.error("Apparatlarni olishda xatolik yuz berdi");
      }
    };

    fetchApparatlar();

    // Socket orqali yangilanishlarni kuzatish
    if (socket) {
      // Qog'oz soni yangilanganda
      socket.on("qogozYangilandi", ({ apparatId, joriyQogozSoni }) => {
        setApparatlar((prev) =>
          prev.map((apparat) => {
            if (apparat.apparatId === apparatId) {
              return { ...apparat, joriyQogozSoni };
            }
            return apparat;
          })
        );
      });

      // Qog'oz kam qolganda
      socket.on("qogozKam", ({ apparatId, joriyQogozSoni }) => {
        setApparatlar((prev) =>
          prev.map((apparat) => {
            if (apparat.apparatId === apparatId) {
              return { ...apparat, joriyQogozSoni };
            }
            return apparat;
          })
        );
      });

      // Yangi apparat qo'shilganda
      socket.on("yangiApparat", (apparat) => {
        setApparatlar((prev) => [...prev, apparat]);
      });

      // Apparat o'chirilganda
      socket.on("apparatOchirildi", (apparatId) => {
        setApparatlar((prev) =>
          prev.filter((apparat) => apparat.apparatId !== apparatId)
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("qogozYangilandi");
        socket.off("qogozKam");
        socket.off("yangiApparat");
        socket.off("apparatOchirildi");
      }
    };
  }, [socket]);

  // Yangi apparat qo'shish
  const addApparat = async (apparatData) => {
    try {
      const response = await api.post("/vending-apparat", apparatData);
      setApparatlar((prev) => [...prev, response.data.malumot]);
      toast.success("Vending apparat muvaffaqiyatli qo'shildi");
      return response.data.malumot;
    } catch (error) {
      console.error("Apparat qo'shishda xatolik:", error);
      toast.error(
        "Apparat qo'shishda xatolik: " +
          (error.response?.data?.xabar || error.message)
      );
      throw error;
    }
  };

  // Apparatni yangilash
  const updateApparat = async (id, apparatData) => {
    try {
      const response = await api.put(`/vending-apparat/${id}`, apparatData);
      setApparatlar((prev) =>
        prev.map((apparat) => {
          if (apparat._id === id) {
            return response.data.malumot;
          }
          return apparat;
        })
      );
      toast.success("Apparat ma'lumotlari muvaffaqiyatli yangilandi");
      return response.data.malumot;
    } catch (error) {
      console.error("Apparatni yangilashda xatolik:", error);
      toast.error(
        "Apparatni yangilashda xatolik: " +
          (error.response?.data?.xabar || error.message)
      );
      throw error;
    }
  };

  // Qog'oz sonini yangilash
  const updateQogozSoni = async (id, soni) => {
    try {
      const response = await api.put(`/vending-apparat/${id}/qogoz`, { soni });
      setApparatlar((prev) =>
        prev.map((apparat) => {
          if (apparat._id === id) {
            return {
              ...apparat,
              joriyQogozSoni: soni,
              oxirgiToladirishVaqti: new Date(),
            };
          }
          return apparat;
        })
      );
      toast.success("Qog'oz soni muvaffaqiyatli yangilandi");
      return response.data.malumot;
    } catch (error) {
      console.error("Qog'oz sonini yangilashda xatolik:", error);
      toast.error(
        "Qog'oz sonini yangilashda xatolik: " +
          (error.response?.data?.xabar || error.message)
      );
      throw error;
    }
  };

  // Apparatni o'chirish
  const deleteApparat = async (id) => {
    try {
      await api.delete(`/vending-apparat/${id}`);
      setApparatlar((prev) => prev.filter((apparat) => apparat._id !== id));
      toast.success("Apparat muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.error("Apparatni o'chirishda xatolik:", error);
      toast.error(
        "Apparatni o'chirishda xatolik: " +
          (error.response?.data?.xabar || error.message)
      );
      throw error;
    }
  };

  // Bitta apparatni ID bo'yicha olish
  const getApparatById = async (id) => {
    try {
      const response = await api.get(`/vending-apparat/${id}`);
      return response.data.malumot;
    } catch (error) {
      console.error("Apparatni olishda xatolik:", error);
      toast.error(
        "Apparatni olishda xatolik: " +
          (error.response?.data?.xabar || error.message)
      );
      throw error;
    }
  };

  return {
    apparatlar,
    loading,
    error,
    addApparat,
    updateApparat,
    updateQogozSoni,
    deleteApparat,
    getApparatById,
  };
};
