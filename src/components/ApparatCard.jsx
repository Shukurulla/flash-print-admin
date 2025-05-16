// src/components/ApparatCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ApparatCard = ({ apparat }) => {
  const qogozFoiz = (apparat.joriyQogozSoni / apparat.qogozSigimi) * 100;

  // Qog'oz miqdoriga qarab rang belgilash
  const getQogozRang = () => {
    if (qogozFoiz <= 20) return "bg-red-500";
    if (qogozFoiz <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Apparat holatiga qarab rang belgilash
  const getHolatiRang = () => {
    switch (apparat.holati) {
      case "faol":
        return "bg-green-100 text-green-800";
      case "tamirlashda":
        return "bg-yellow-100 text-yellow-800";
      case "ishlamayapti":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">{apparat.nomi}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getHolatiRang()}`}
          >
            {apparat.holati}
          </span>
        </div>

        <p className="text-gray-600 mb-3">ID: {apparat.apparatId}</p>
        <p className="text-gray-600 mb-3">
          Manzil: {apparat.manzil || "Ko'rsatilmagan"}
        </p>

        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">
              Qog'oz: {apparat.joriyQogozSoni} / {apparat.qogozSigimi}
            </span>
            <span className="text-sm font-medium">
              {Math.round(qogozFoiz)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getQogozRang()}`}
              style={{ width: `${qogozFoiz}%` }}
            ></div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Oxirgi to'ldirilgan:{" "}
          {new Date(apparat.oxirgiToladirishVaqti).toLocaleDateString()}
        </div>
      </div>

      <div className="border-t px-5 py-3 bg-gray-50 flex justify-end">
        <Link
          to={`/apparat/${apparat._id}`}
          className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 transition"
        >
          Batafsil
        </Link>
      </div>
    </div>
  );
};

export default ApparatCard;
