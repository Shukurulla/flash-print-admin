/**
 * Sanani formatlash uchun funksiya
 * @param {Date|string} sana - formatlanadigan sana
 * @param {string} format - format turi: 'short', 'medium', 'full'
 * @returns {string} Formatlangan sana
 */
export const formatSana = (sana, format = "medium") => {
  if (!sana) return "Noma'lum sana";

  const date = new Date(sana);

  // Sananing to'g'riligini tekshirish
  if (isNaN(date.getTime())) {
    return "Noto'g'ri sana";
  }

  const options = {};

  switch (format) {
    case "short":
      options.day = "numeric";
      options.month = "numeric";
      break;
    case "medium":
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      break;
    case "full":
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      break;
    default:
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
  }

  return new Intl.DateTimeFormat("uz-UZ", options).format(date);
};

/**
 * Summani formatlash uchun funksiya
 * @param {number} summa - formatlanadigan summa
 * @returns {string} Formatlangan summa
 */
export const formatSumma = (summa) => {
  if (summa === null || summa === undefined) return "0 so'm";

  // Sonni butun songa aylantirib olish
  const roundedSum = Math.round(summa);

  // Sonni formatlash (ming, million ajratuvchilari bilan)
  const formattedSum = new Intl.NumberFormat("uz-UZ").format(roundedSum);

  return `${formattedSum} so'm`;
};

/**
 * Apparat holati rangini aniqlash funksiyasi
 * @param {string} holati - apparat holati
 * @returns {string} Rang klassi
 */
export const getHolatiRang = (holati) => {
  switch (holati) {
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

/**
 * Qog'oz miqdoriga qarab rang aniqlash funksiyasi
 * @param {number} foiz - qog'oz foizi
 * @returns {string} Rang klassi
 */
export const getQogozRang = (foiz) => {
  if (foiz <= 20) return "bg-red-500";
  if (foiz <= 50) return "bg-yellow-500";
  return "bg-green-500";
};

/**
 * Fayl turini aniqlash funksiyasi
 * @param {string} fileType - fayl MIME turi
 * @returns {string} Fayl turi nomi
 */
export const getFileType = (fileType) => {
  if (!fileType) return "Noma'lum";

  if (fileType.includes("pdf")) return "PDF";
  if (fileType.includes("word")) return "Word";
  if (fileType.includes("excel") || fileType.includes("spreadsheet"))
    return "Excel";

  return "Fayl";
};

/**
 * Apparatlarni holati bo'yicha filtrlash
 * @param {Array} apparatlar - apparatlar ro'yxati
 * @param {string} holati - filtrlash uchun holat
 * @returns {Array} Filtrlangan apparatlar
 */
export const filterApparatlarByHolati = (apparatlar, holati) => {
  if (!holati || holati === "barchasi") return apparatlar;

  return apparatlar.filter((apparat) => apparat.holati === holati);
};

/**
 * Tokenni LocalStorage'ga saqlash
 * @param {string} token - saqlash uchun token
 */
export const setAuthToken = (token) => {
  localStorage.setItem("auth_token", token);
};

/**
 * Tokenni LocalStorage'dan olish
 * @returns {string|null} Saqlangan token
 */
export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

/**
 * Foydalanuvchini tizimdan chiqarish
 */
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
