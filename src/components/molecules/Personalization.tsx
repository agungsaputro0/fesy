import { useState, useEffect } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { Switch, Input, Button, Card, notification } from "antd";
import { ArrowLeftOutlined, CheckCircleFilled, ControlOutlined, BgColorsOutlined, FormatPainterOutlined, HighlightOutlined, SaveOutlined } from "@ant-design/icons";
import usersData from "../../pseudo-db/users.json";
import AddressPanel from "../atoms/AddressPanel";
import { useNavigate } from "react-router-dom";


const themes = {
  original: { name: "Royal Plum", color: "#7f0353", icon: <BgColorsOutlined /> },
  teal: { name: "Cool Teal", color: "#008080", icon: <FormatPainterOutlined /> },
  forestGreen: { name: "Evergreen Forest", color: "#228B22", icon: <HighlightOutlined /> },
};

interface Address {
  id: number;
  label: string;
  provinsi: string;
  kabupaten: string; // Menampung data Kabupaten atau Kota
  detail: string;
  kodePos: string;
  alamatDipilih: boolean;
}

  interface User {
    id: number;
    nama: string;
    telepon: string;
    alamat: Address[];
    email: string;
    password: string;
    fotoProfil: string;
    role: number;
  }

const Personalization = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState<keyof typeof themes>("original");
  const [address, setAddress] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [customColor, setCustomColor] = useState("");
  useEffect(() => {
    const foundUser = usersData.find((u) => u.id === currentUser.id) || null;
    setUser(foundUser);
  
    const storedSettings = localStorage.getItem("fesySettings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      
      // Ambil pengaturan berdasarkan user ID
      const userSettings = parsedSettings[currentUser.id];
  
      if (userSettings) {
        const { darkMode, theme, address, notifications, preferences } = userSettings;
        setDarkMode(darkMode);
        setTheme(theme as keyof typeof themes);
        setAddress(address);
        setNotifications(notifications);
        setSelectedOptions(preferences || {});
      }
    }
  }, []);
  

  const getPrimaryAddress = () => {
    if (!currentUser || currentUser.alamat.length === 0) return null;
    return currentUser.alamat.find((addr: Address) => addr.alamatDipilih) || currentUser.alamat[0];
  };

  const handleSave = () => {
    if (!currentUser || !currentUser.id) {
      notification.error({ message: "Error", description: "User tidak valid" });
      return;
    }
  
    const settings = {
      darkMode,
      theme,
      address,
      notifications,
      preferences: selectedOptions
    };
  
    // Simpan dengan ID user sebagai kunci utama
    const storedSettings = {
      [currentUser.id]: settings
    };
  
    localStorage.setItem("fesySettings", JSON.stringify(storedSettings));
    notification.success({ message: "Selamat!", description: "Pengaturan berhasil disimpan" });
  };
  

  const toggleOption = (category: string, option: string) => {
    setSelectedOptions((prev) => {
      const selected = prev[category] || [];
      const newSelection = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
      return { ...prev, [category]: newSelection };
    });
  };

  
  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-gray-300 pb-3">
        <h2  style={{ color: themes[theme].color }} className="flex items-center text-2xl text-[#7f0353]">
        <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#7f0353] transition-all duration-200"
            >
              <ArrowLeftOutlined className="text-xl" /><span className="mt-[-5px]">|</span>&nbsp;
            </button>
              <ControlOutlined />&nbsp;Personalisasi
            </h2>
            </div>
        <div className="mt-4 space-y-4">
        {user && (
            <div className="flex justify-center space-x-6 mt-10 mb-10">
            <img
              src={user.fotoProfil}
              alt={user.nama}
              className="w-24 h-24 supernarrow:w-16 supernarrow:h-16 sm:w-28 sm:h-28 rounded-full border border-gray-300 transition-all duration-300 hover:w-20 hover:h-20 sm:hover:w-32 sm:hover:h-32"
              onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
            />
                            <div className="min-w-0">
                              <h2 className="text-lg sm:text-xl font-semibold truncate">
                                {user.nama}
                              </h2>
                              <p className="flex text-sm sm:text-lg items-center text-gray-700">
                                <FaPhoneAlt className="text-[#7f0353] mr-2" /> {user.telepon}
                              </p>
                              <p className="flex text-sm sm:text-lg items-center text-gray-700">
                                <FaEnvelope className="text-[#7f0353] mr-2" /> {user.email}
                              </p>
                              {getPrimaryAddress() && (
                                <p className="flex text-sm sm:text-lg items-center text-gray-700">
                                  <FaMapMarkerAlt className="text-[#7f0353] mr-2" /> {getPrimaryAddress()?.detail}
                                </p>
                              )}
                            </div>
                    </div>
          )}

          <div className="border-b pb-2">
            <label className="block mb-1 font-bold">Pilihan Tema</label>
            <div className="flex justify-evenly gap-4 flex-wrap w-full">
            {Object.entries(themes).map(([key, value]) => (
                <Card
                key={key}
                className={`cursor-pointer flex-1 max-w-1/3 h-20 text-center border-2 rounded-lg flex flex-col items-center justify-center
                    transition-all transform ${theme === key ? "border-black shadow-md" : "border-gray-300 hover:shadow-md hover:-translate-y-1"}`}
                style={{ backgroundColor: value.color, color: "white" }}
                onClick={() => setTheme(key as keyof typeof themes)}
                >
                <div className="text-xs sm:text-sm md:text-base">{value.icon}</div>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium mt-1">{value.name}&nbsp;</span>
                {theme === key && <CheckCircleFilled className="text-white text-[8px] sm:text-xs md:text-sm mt-1 animate-bounce" />}
                </Card>
            ))}
            </div>
          </div>
          <AddressPanel />

          <div className="flex justify-between items-center border-b pb-2 pt-4">
            <span className="font-bold">Notifikasi</span>
            <Switch checked={notifications} onChange={setNotifications} />
          </div>

          {/* Pertanyaan interaktif */}
          {[
            { title: "Apa alasan utama kamu menggunakan Fesy?", options: ["🌎 Peduli lingkungan", "💰 Lebih hemat", "🎨 Unik & tidak pasaran", "🔄 Pakaian bisa ditukar lagi nanti"], category: "reason" },
            { title: "Apa gaya fashion favoritmu?", options: ["🏙 Casual", "🏢 Formal", "🏝 Bohemian", "🎸 Vintage", "🏋️‍♂️ Sporty", "👗 Chic"], category: "fashionStyle" },
            { title: "Warna apa yang paling sering kamu pakai?", options: ["🌿 Hijau", "⚫ Hitam", "⚪ Putih", "🔵 Biru", "🔴 Merah", "🌸 Pastel", "✨ Lainnya"], category: "color" },
            { title: "Apa jenis pakaian yang paling sering kamu cari?", options: ["👚 Atasan", "👖 Celana", "🧥 Outerwear", "👗 Dress", "👞 Sepatu", "🎒 Aksesori"], category: "clothingType" },
            { title: "Apakah kamu punya preferensi bahan pakaian?", options: ["🍃 Katun", "🏔 Wol", "🧵 Linen", "♻️ Bahan Daur Ulang", "🚫 Tidak ada preferensi"], category: "material" },
          ].map(({ title, options, category }) => (
            <div key={category} className="border-b pb-4 pt-4">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <div className="grid grid-cols-1 gap-3">
                    {options.map((option) => {
                    const isSelected = selectedOptions[category]?.includes(option);
                    return (
                        <div
                        key={option}
                        className={`cursor-pointer p-3 rounded-lg flex items-center justify-start text-left transition-all 
                        border-2 shadow-md font-medium 
                        ${isSelected ? "text-white border-transparent shadow-lg" : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-lg"}`}
                        style={
                            isSelected
                            ? { background: `linear-gradient(135deg, ${themes[theme].color}, #6a5acd)` }
                            : {}
                        }
                        onClick={() => toggleOption(category, option)}
                        >
                        {option}
                        </div>
                    );
                    })}
                </div>
                
                {category === "color" && selectedOptions.color?.includes("✨ Lainnya") && (
                    <Input
                    className="mt-3 border-blue-400"
                    placeholder="Masukkan warna favoritmu"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    />
                )}
                </div>

          ))}

          <Button type="primary" className="w-full mt-4 flex gap-1 h-10" style={{ backgroundColor: themes[theme].color }} onClick={handleSave}>
            <SaveOutlined /> Simpan Pengaturan
          </Button>
        </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Personalization;
