// src/pages/TolovlarPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { useSocket } from "../contexts/SocketContext";
import { formatSana, formatSumma } from "../utils/helpers";

const TolovlarPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "prepare", "complete"
  const { socket } = useSocket();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/api/paid/all");
        setPayments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("To'lovlarni olishda xatolik:", error);
        toast.error("To'lovlarni olishda xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchPayments();

    // Socket orqali yangi to'lovlarni kuzatish
    if (socket) {
      // Yangi to'lov qo'shilganda
      socket.on("yangiTolov", (newPayment) => {
        setPayments((prev) => [newPayment, ...prev]);
      });

      // To'lov statusi o'zgarganda
      socket.on("tolovStatusYangilandi", ({ id, status }) => {
        setPayments((prev) =>
          prev.map((payment) => {
            if (payment._id === id) {
              return { ...payment, status };
            }
            return payment;
          })
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("yangiTolov");
        socket.off("tolovStatusYangilandi");
      }
    };
  }, [socket]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "prepare":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Tayyorlanmoqda
          </span>
        );
      case "complete":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Tugallangan
          </span>
        );
      case "paid":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            To'langan
          </span>
        );
      case "canceled":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Bekor qilingan
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Noma'lum
          </span>
        );
    }
  };

  // Filter qilingan to'lovlar
  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((payment) => payment.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">To'lovlar</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">To'lovlar ro'yxati</h2>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setFilter("prepare")}
              className={`px-4 py-2 rounded-md ${
                filter === "prepare" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Tayyorlanmoqda
            </button>
            <button
              onClick={() => setFilter("complete")}
              className={`px-4 py-2 rounded-md ${
                filter === "complete" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Tugallangan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sana
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Summa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ma'lumotlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    To'lovlar mavjud emas
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment._id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatSana(payment.date, "full")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {formatSumma(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.serviceData && (
                        <div>
                          {payment.serviceData.fileName && (
                            <p>Fayl: {payment.serviceData.fileName}</p>
                          )}
                          {payment.serviceData.apparatId && (
                            <p>Apparat: {payment.serviceData.apparatId}</p>
                          )}
                          {payment.serviceData.user &&
                            payment.serviceData.user.username && (
                              <p>
                                Foydalanuvchi:{" "}
                                {payment.serviceData.user.username}
                              </p>
                            )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Umumiy statistika</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Jami to'lovlar soni</p>
            <p className="text-2xl font-bold">{payments.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Jami to'langan summa</p>
            <p className="text-2xl font-bold">
              {formatSumma(
                payments.reduce((total, payment) => total + payment.amount, 0)
              )}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">O'rtacha to'lov</p>
            <p className="text-2xl font-bold">
              {formatSumma(
                payments.length > 0
                  ? payments.reduce(
                      (total, payment) => total + payment.amount,
                      0
                    ) / payments.length
                  : 0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TolovlarPage;
