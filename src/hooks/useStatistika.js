import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";

export const useStatistika = (
  initialFilters = { davr: "kun", apparatId: "all" }
) => {
  const [statistika, setStatistika] = useState([]);
  const [summary, setSummary] = useState({
    umumiyDaromad: 0,
    foydalanishSoni: 0,
    ishlatilganQogoz: 0,
    ortachaDaromad: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchStatistika = async () => {
      setLoading(true);

      try {
        let endpoint = "/statistika";
        let params = { davr: filters.davr };

        if (filters.apparatId && filters.apparatId !== "all") {
          params.apparatId = filters.apparatId;
        }

        if (
          filters.davr === "custom" &&
          filters.boshlanishSana &&
          filters.tugashSana
        ) {
          params.boshlanishSana = filters.boshlanishSana;
          params.tugashSana = filters.tugashSana;
        }

        const response = await api.get(endpoint, { params });
        const data = response.data.malumot;

        setStatistika(data);

        // Umumiy statistikani hisoblash
        const umumiyDaromad = data.reduce((sum, item) => sum + item.daromad, 0);
        const foydalanishSoni = data.reduce(
          (sum, item) => sum + item.foydalanishSoni,
          0
        );
        const ishlatilganQogoz = data.reduce(
          (sum, item) => sum + item.ishlatilganQogoz,
          0
        );
        const ortachaDaromad =
          foydalanishSoni > 0 ? umumiyDaromad / foydalanishSoni : 0;

        setSummary({
          umumiyDaromad,
          foydalanishSoni,
          ishlatilganQogoz,
          ortachaDaromad,
        });

        setLoading(false);
      } catch (error) {
        console.error("Statistikani olishda xatolik:", error);
        setError("Statistikani olishda xatolik yuz berdi");
        setLoading(false);
        toast.error("Statistikani olishda xatolik yuz berdi");
      }
    };

    fetchStatistika();
  }, [filters]);

  // Guruhlangan statistikani olish (kunlik/oylik/yillik)
  const getGroupedStatistika = async (davr = "kun", apparatId = null) => {
    try {
      let params = { davr };

      if (apparatId && apparatId !== "all") {
        params.apparatId = apparatId;
      }

      const response = await api.get("/statistika/guruh", { params });
      return response.data.malumot;
    } catch (error) {
      console.error("Guruhlangan statistikani olishda xatolik:", error);
      toast.error("Guruhlangan statistikani olishda xatolik yuz berdi");
      throw error;
    }
  };

  // Apparat statistikasini olish
  const getApparatStatistika = async (apparatId, davr = "kun") => {
    try {
      const response = await api.get(
        `/vending-apparat/${apparatId}/statistika`,
        {
          params: { davr },
        }
      );
      return response.data.malumot;
    } catch (error) {
      console.error("Apparat statistikasini olishda xatolik:", error);
      toast.error("Apparat statistikasini olishda xatolik yuz berdi");
      throw error;
    }
  };

  // Filtrlash
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return {
    statistika,
    summary,
    loading,
    error,
    filters,
    updateFilters,
    getGroupedStatistika,
    getApparatStatistika,
  };
};
