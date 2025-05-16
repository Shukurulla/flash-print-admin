// pages/Boshqaruv.jsx (davomi)
import React, { useState, useEffect } from "react";
import { useApparatlar } from "../hooks/useApparatlar";
import { useStatistika } from "../hooks/useStatistika";
import { useSocket } from "../contexts/SocketContext";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  RefreshIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { formatSumma, formatSana } from "../utils/helpers";
import ApparatList from "../components/ApparatList";

const Boshqaruv = () => {
  const { apparatlar, loading: apparatlarLoading } = useApparatlar();
  const { summary, loading: statistikaLoading } = useStatistika({
    davr: "kun",
  });
  const { notifications } = useSocket();
  const [qogozKamApparatlar, setQogozKamApparatlar] = useState([]);
  const [faolApparatlar, setFaolApparatlar] = useState(0);
  const [umumiyQogoz, setUmumiyQogoz] = useState(0);

  useEffect(() => {
    if (apparatlar.length > 0) {
      const faollar = apparatlar.filter(
        (apparat) => apparat.holati === "faol"
      ).length;
      const qogozKamlar = apparatlar.filter(
        (apparat) => apparat.joriyQogozSoni <= apparat.kamQogozChegarasi
      );
      const qogozJami = apparatlar.reduce(
        (sum, apparat) => sum + apparat.joriyQogozSoni,
        0
      );

      setFaolApparatlar(faollar);
      setQogozKamApparatlar(qogozKamlar);
      setUmumiyQogoz(qogozJami);
    }
  }, [apparatlar]);

  if (apparatlarLoading || statistikaLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Boshqaruv paneli</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Boshqaruv paneli</h1>

        <Link
          to="/apparat/yangi"
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yangi Apparat
        </Link>
      </div>

      {/* Ko'rsatkichlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-gray-500 text-sm">Bugungi daromad</h3>
          </div>
          <p className="text-3xl font-bold">
            {formatSumma(summary.umumiyDaromad)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <DocumentTextIcon className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-gray-500 text-sm">Foydalanuvchilar soni</h3>
          </div>
          <p className="text-3xl font-bold">{summary.foydalanishSoni}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <RefreshIcon className="h-6 w-6 text-indigo-500 mr-2" />
            <h3 className="text-gray-500 text-sm">Faol apparatlar</h3>
          </div>
          <p className="text-3xl font-bold">
            {faolApparatlar} / {apparatlar.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <ExclamationCircleIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-gray-500 text-sm">Jami qog'oz</h3>
          </div>
          <p className="text-3xl font-bold">{umumiyQogoz} varaq</p>
        </div>
      </div>

      {/* Qog'oz kam qolgan apparatlar */}
      {qogozKamApparatlar.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Diqqat! {qogozKamApparatlar.length} ta apparatda qog'oz kam
                qoldi
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {qogozKamApparatlar.map((apparat) => (
                    <li key={apparat._id}>
                      <Link
                        to={`/apparat/${apparat._id}`}
                        className="hover:underline"
                      >
                        {apparat.nomi}: {apparat.joriyQogozSoni} ta qog'oz qoldi
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apparatlar ro'yxati */}
      <div className="mb-8">
        <ApparatList apparatlar={apparatlar} />
      </div>

      {/* So'nggi bildirishnomalar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">So'nggi bildirishnomalar</h2>
          <Link
            to="/bildirishnomalar"
            className="text-blue-500 hover:underline text-sm"
          >
            Barchasini ko'rish
          </Link>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Yangi bildirishnomalar yo'q
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-md ${
                  notification.type === "qogozKam"
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "bg-green-50 border-l-4 border-green-500"
                }`}
              >
                <p className="font-medium mb-1">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.vaqt).toLocaleTimeString()} -{" "}
                  {notification.apparatId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* So'nggi faoliyat */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">So'nggi faoliyatlar</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Sana/Vaqt</th>
                <th className="py-2 px-4 border-b text-left">Apparat</th>
                <th className="py-2 px-4 border-b text-left">Hodisa</th>
                <th className="py-2 px-4 border-b text-right">Miqdor</th>
              </tr>
            </thead>
            <tbody>
              {/* Bu joyda so'nggi faoliyatlar ro'yxati bo'lishi kerak */}
              {/* Hozircha namuna ma'lumotlar ko'rsatiladi */}
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {formatSana(new Date(), "full")}
                </td>
                <td className="py-2 px-4 border-b">VP001</td>
                <td className="py-2 px-4 border-b">To'lov</td>
                <td className="py-2 px-4 border-b text-right">
                  {formatSumma(5000)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {formatSana(new Date(), "full")}
                </td>
                <td className="py-2 px-4 border-b">VP002</td>
                <td className="py-2 px-4 border-b">Qog'oz to'ldirildi</td>
                <td className="py-2 px-4 border-b text-right">500 varaq</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {formatSana(new Date(), "full")}
                </td>
                <td className="py-2 px-4 border-b">VP003</td>
                <td className="py-2 px-4 border-b">Fayl yuklandi</td>
                <td className="py-2 px-4 border-b text-right">test.pdf</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Boshqaruv;
