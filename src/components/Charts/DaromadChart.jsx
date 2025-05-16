// src/components/Charts/DaromadChart.jsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/api";

// ChartJS ni ro'yxatdan o'tkazish
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DaromadChart = ({ davr }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/statistika?davr=${davr}`);
        const statistika = response.data.malumot;

        // Ma'lumotlarni sana bo'yicha guruhlash
        const groupedData = statistika.reduce((acc, item) => {
          const sana = new Date(item.sana).toLocaleDateString();

          if (!acc[sana]) {
            acc[sana] = { daromad: 0 };
          }

          acc[sana].daromad += item.daromad;
          return acc;
        }, {});

        // Grafik uchun ma'lumotlarni formatlash
        const labels = Object.keys(groupedData);
        const daromadlar = labels.map((sana) => groupedData[sana].daromad);

        setChartData({
          labels,
          datasets: [
            {
              label: "Daromad (so'm)",
              data: daromadlar,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Statistikani olishda xatolik:", error);
      }
    };

    fetchData();
  }, [davr]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${davr.charAt(0).toUpperCase() + davr.slice(1)}lik daromad`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + " so'm";
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DaromadChart;
