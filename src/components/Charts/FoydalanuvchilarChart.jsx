// src/components/Charts/FoydalanuvchilarChart.jsx
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

const FoydalanuvchilarChart = ({ davr }) => {
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
            acc[sana] = { foydalanuvchilar: 0 };
          }

          acc[sana].foydalanuvchilar += item.foydalanishSoni;
          return acc;
        }, {});

        // Grafik uchun ma'lumotlarni formatlash
        const labels = Object.keys(groupedData);
        const foydalanuvchilar = labels.map(
          (sana) => groupedData[sana].foydalanuvchilar
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Foydalanuvchilar soni",
              data: foydalanuvchilar,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgb(75, 192, 192)",
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
        }lik foydalanuvchilar`,
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

export default FoydalanuvchilarChart;
