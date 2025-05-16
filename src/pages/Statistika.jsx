import React, { useState, useEffect } from "react";
import StatistikaFilter from "../components/StatistikaFilter";
import { useStatistika } from "../hooks/useStatistika";
import { formatSana, formatSumma } from "../utils/helpers";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Chart.js komponentlarini ro'yxatdan o'tkazish
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Statistika = () => {
  const {
    statistika,
    summary,
    loading,
    filters,
    updateFilters,
    getGroupedStatistika,
  } = useStatistika();
  const [activeTab, setActiveTab] = useState("daromad");
  const [groupedData, setGroupedData] = useState(null);

  useEffect(() => {
    const fetchGroupedData = async () => {
      try {
        const result = await getGroupedStatistika(
          filters.davr,
          filters.apparatId
        );
        setGroupedData(result);
      } catch (error) {
        console.error("Guruhlangan ma'lumotlarni olishda xatolik:", error);
      }
    };

    fetchGroupedData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const prepareDaromadChart = () => {
    if (!groupedData) return null;

    const labels = groupedData.map((item) => {
      // Formatni davr bo'yicha moslashtirish
      if (filters.davr === "kun") {
        return formatSana(item._id, "short");
      } else if (filters.davr === "oy") {
        return item._id; // YYYY-MM formatida
      } else if (filters.davr === "yil") {
        return item._id; // YYYY formatida
      } else {
        return formatSana(item._id, "short");
      }
    });

    const data = groupedData.map((item) => item.daromad);

    return {
      labels,
      datasets: [
        {
          label: "Daromad (so'm)",
          data,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const prepareFoydalanuvchilarChart = () => {
    if (!groupedData) return null;

    const labels = groupedData.map((item) => {
      if (filters.davr === "kun") {
        return formatSana(item._id, "short");
      } else if (filters.davr === "oy") {
        return item._id;
      } else if (filters.davr === "yil") {
        return item._id;
      } else {
        return formatSana(item._id, "short");
      }
    });

    const data = groupedData.map((item) => item.foydalanishSoni);

    return {
      labels,
      datasets: [
        {
          label: "Foydalanuvchilar soni",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
    };
  };
  // pages/Statistika.jsx (davomi)
  const prepareQogozChart = () => {
    if (!groupedData) return null;

    const labels = groupedData.map((item) => {
      if (filters.davr === "kun") {
        return formatSana(item._id, "short");
      } else if (filters.davr === "oy") {
        return item._id;
      } else if (filters.davr === "yil") {
        return item._id;
      } else {
        return formatSana(item._id, "short");
      }
    });

    const data = groupedData.map((item) => item.ishlatilganQogoz);

    return {
      labels,
      datasets: [
        {
          label: "Ishlatilgan qog'oz (varaq)",
          data,
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          borderColor: "rgb(255, 159, 64)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          activeTab === "daromad"
            ? "Daromad statistikasi"
            : activeTab === "foydalanuvchilar"
            ? "Foydalanuvchilar statistikasi"
            : "Qog'oz foydalanish statistikasi",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (activeTab === "daromad") {
              return formatSumma(value);
            }
            return value;
          },
        },
      },
    },
  };

  const handleExport = () => {
    // PDF yoki Excel formatida eksport qilish logikasi
    alert("Eksport qilish funksiyasi ishlab chiqilmoqda");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Statistika</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 print:py-2">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold">Statistika</h1>

        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {/* <DownloadIcon className="h-5 w-5 mr-2" /> */}
            Eksport
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Chop etish
          </button>
        </div>
      </div>

      <div className="print:hidden">
        <StatistikaFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Statistika xulosa kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Umumiy daromad</h3>
          <p className="text-3xl font-bold">
            {formatSumma(summary.umumiyDaromad)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Foydalanishlar soni</h3>
          <p className="text-3xl font-bold">{summary.foydalanishSoni}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Ishlatilgan qog'oz</h3>
          <p className="text-3xl font-bold">{summary.ishlatilganQogoz} varaq</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">O'rtacha daromad</h3>
          <p className="text-3xl font-bold">
            {formatSumma(summary.ortachaDaromad)}
          </p>
          <p className="text-xs text-gray-500">har bir foydalanishga</p>
        </div>
      </div>

      {/* Grafik turlari */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex border-b mb-4 print:hidden">
          <button
            className={`px-4 py-2 ${
              activeTab === "daromad"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("daromad")}
          >
            Daromad
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "foydalanuvchilar"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("foydalanuvchilar")}
          >
            Foydalanuvchilar
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "qogoz"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("qogoz")}
          >
            Qog'oz foydalanish
          </button>
        </div>

        <div className="h-80">
          {activeTab === "daromad" && prepareDaromadChart() && (
            <Line data={prepareDaromadChart()} options={chartOptions} />
          )}

          {activeTab === "foydalanuvchilar" &&
            prepareFoydalanuvchilarChart() && (
              <Bar
                data={prepareFoydalanuvchilarChart()}
                options={chartOptions}
              />
            )}

          {activeTab === "qogoz" && prepareQogozChart() && (
            <Bar data={prepareQogozChart()} options={chartOptions} />
          )}

          {!groupedData && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">
                Bu davr uchun ma'lumotlar mavjud emas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Batafsil ma'lumotlar jadvali */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Batafsil ma'lumotlar</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Sana</th>
                <th className="py-2 px-4 border-b text-left">Apparat</th>
                <th className="py-2 px-4 border-b text-right">
                  Foydalanishlar
                </th>
                <th className="py-2 px-4 border-b text-right">
                  Qog'oz (varaq)
                </th>
                <th className="py-2 px-4 border-b text-right">Daromad</th>
              </tr>
            </thead>
            <tbody>
              {statistika.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Bu davr uchun ma'lumotlar mavjud emas
                  </td>
                </tr>
              ) : (
                statistika.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {formatSana(item.sana)}
                    </td>
                    <td className="py-2 px-4 border-b">{item.apparatId}</td>
                    <td className="py-2 px-4 border-b text-right">
                      {item.foydalanishSoni}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {item.ishlatilganQogoz}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {formatSumma(item.daromad)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td colSpan="2" className="py-2 px-4 border-t">
                  Jami:
                </td>
                <td className="py-2 px-4 border-t text-right">
                  {summary.foydalanishSoni}
                </td>
                <td className="py-2 px-4 border-t text-right">
                  {summary.ishlatilganQogoz}
                </td>
                <td className="py-2 px-4 border-t text-right">
                  {formatSumma(summary.umumiyDaromad)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistika;
