// src/components/Charts/QogozUsageChart.jsx
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QogozUsageChart = ({ davr }) => {
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
            acc[sana] = { qogoz: 0 };
          }

          acc[sana].qogoz += item.ishlatilganQogoz;
          return acc;
        }, {});

        // Grafik uchun ma'lumotlarni formatlash
        const labels = Object.keys(groupedData);
        const qogozlar = labels.map((sana) => groupedData[sana].qogoz);

        setChartData({
          labels,
          datasets: [
            {
              label: "Qog'oz soni",
              data: qogozlar,
              backgroundColor: "rgba(255, 159, 64, 0.5)",
              borderColor: "rgb(255, 159, 64)",
              borderWidth: 1,
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
        text: `${
          davr.charAt(0).toUpperCase() + davr.slice(1)
        }lik qog'oz foydalanish`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default QogozUsageChart;
