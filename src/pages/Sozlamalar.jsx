import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Sozlamalar = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Flash Print",
    adminEmail: "admin@flashprint.uz",
    language: "uz",
    defaultPaperPrice: 500,
    lowPaperThreshold: 200,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableTelegramNotifications: true,
    notifyOnLowPaper: true,
    notifyOnPayment: true,
    notifyOnError: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    changePassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [backupSettings, setBackupSettings] = useState({
    enableAutomaticBackups: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    backupLocation: "local",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBackupSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBackupSettings({
      ...backupSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveSettings = (settingsType) => {
    // Aslida bu ma'lumotlar backend API ga yuborilishi kerak
    // Hozircha shunchaki toast xabari ko'rsatamiz
    toast.success(`${settingsType} sozlamalari muvaffaqiyatli saqlandi`);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error("Yangi parol va tasdiq parol mos kelmayapti");
      return;
    }

    // Parolni o'zgartirish logikasi
    toast.success("Parol muvaffaqiyatli o'zgartirildi");

    setSecuritySettings({
      ...securitySettings,
      changePassword: false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleBackupNow = () => {
    toast.success("Zaxira nusxa yaratish boshlandi");
    // Zaxira nusxa yaratish logikasi
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sozlamalar</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 ${
              activeTab === "general"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("general")}
          >
            Umumiy
          </button>
          <button
            className={`px-6 py-3 ${
              activeTab === "notifications"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Bildirishnomalar
          </button>
          <button
            className={`px-6 py-3 ${
              activeTab === "security"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Xavfsizlik
          </button>
          <button
            className={`px-6 py-3 ${
              activeTab === "backup"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("backup")}
          >
            Zaxira nusxa
          </button>
        </div>

        <div className="p-6">
          {/* Umumiy sozlamalar */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Umumiy sozlamalar</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kompaniya nomi
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin elektron pochta
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Til
                  </label>
                  <select
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Ruscha</option>
                    <option value="en">Inglizcha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Standart qog'oz narxi (so'm)
                  </label>
                  <input
                    type="number"
                    name="defaultPaperPrice"
                    value={generalSettings.defaultPaperPrice}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kam qog'oz chegarasi
                  </label>
                  <input
                    type="number"
                    name="lowPaperThreshold"
                    value={generalSettings.lowPaperThreshold}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Bu qiymatdan kamaysa, bildirishnoma yuboriladi
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSaveSettings("Umumiy")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Saqlash
                </button>
              </div>
            </div>
          )}

          {/* Bildirishnoma sozlamalari */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Bildirishnoma sozlamalari
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableEmailNotifications"
                    name="enableEmailNotifications"
                    checked={notificationSettings.enableEmailNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="enableEmailNotifications"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Elektron pochta bildirishnomalari
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableTelegramNotifications"
                    name="enableTelegramNotifications"
                    checked={notificationSettings.enableTelegramNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="enableTelegramNotifications"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Telegram bildirishnomalari
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnLowPaper"
                    name="notifyOnLowPaper"
                    checked={notificationSettings.notifyOnLowPaper}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notifyOnLowPaper"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Qog'oz kam qolganda xabar berish
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnPayment"
                    name="notifyOnPayment"
                    checked={notificationSettings.notifyOnPayment}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notifyOnPayment"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    To'lovlar haqida xabar berish
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnError"
                    name="notifyOnError"
                    checked={notificationSettings.notifyOnError}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notifyOnError"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Xatoliklar haqida xabar berish
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSaveSettings("Bildirishnoma")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Saqlash
                </button>
              </div>
            </div>
          )}

          {/* Xavfsizlik sozlamalari */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Xavfsizlik sozlamalari
              </h2>

              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="changePassword"
                    name="changePassword"
                    checked={securitySettings.changePassword}
                    onChange={handleSecuritySettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="changePassword"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Parolni o'zgartirish
                  </label>
                </div>

                {securitySettings.changePassword && (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joriy parol
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={securitySettings.currentPassword}
                        onChange={handleSecuritySettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yangi parol
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecuritySettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yangi parolni tasdiqlash
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecuritySettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Parolni o'zgartirish
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Zaxira nusxa sozlamalari */}
          {activeTab === "backup" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Zaxira nusxa sozlamalari
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAutomaticBackups"
                    name="enableAutomaticBackups"
                    checked={backupSettings.enableAutomaticBackups}
                    onChange={handleBackupSettingsChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="enableAutomaticBackups"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Avtomatik zaxira nusxa olish
                  </label>
                </div>

                {backupSettings.enableAutomaticBackups && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zaxira nusxa olish chastotasi
                      </label>
                      <select
                        name="backupFrequency"
                        value={backupSettings.backupFrequency}
                        onChange={handleBackupSettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Har kuni</option>
                        <option value="weekly">Har hafta</option>
                        <option value="monthly">Har oy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zaxira nusxa olish vaqti
                      </label>
                      <input
                        type="time"
                        name="backupTime"
                        value={backupSettings.backupTime}
                        onChange={handleBackupSettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zaxira nusxa olish joylashuvi
                      </label>
                      <select
                        name="backupLocation"
                        value={backupSettings.backupLocation}
                        onChange={handleBackupSettingsChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="local">Mahalliy server</option>
                        <option value="cloud">Bulutli saqlash</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleBackupNow}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Hozir zaxira nusxa olish
                </button>

                <button
                  onClick={() => handleSaveSettings("Zaxira nusxa")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Saqlash
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sozlamalar;
