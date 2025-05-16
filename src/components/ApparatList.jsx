// src/components/ApparatList.jsx
import React from "react";
import ApparatCard from "./ApparatCard";
import { Link } from "react-router-dom";

const ApparatList = ({ apparatlar }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Vending Apparatlar ({apparatlar?.length})
        </h2>
        <Link
          to="/apparat/yangi"
          className="inline-flex items-center px-4 py-2 bg-green-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-600 active:bg-green-700 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-200 transition"
        >
          + Yangi Apparat
        </Link>
      </div>

      {apparatlar.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Hozircha vending apparatlar mavjud emas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apparatlar.map((apparat) => (
            <ApparatCard key={apparat._id} apparat={apparat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApparatList;
