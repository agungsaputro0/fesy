import { useState, useEffect } from "react";
import { FaWallet, FaCoins, FaTags } from "react-icons/fa";
import DailyReward from "./DailyReward"; // Tidak perlu mengontrol modal dari sini

const DashboardPanel = () => {
  // Langsung inisialisasi state dari localStorage jika ada, atau gunakan 2405
  const [coins, setCoins] = useState<number>(() => {
    const savedCoins = localStorage.getItem("userCoins");
    return savedCoins ? parseInt(savedCoins, 10) : 2405;
  });

  // Fungsi untuk mengambil jumlah koin dari localStorage
  const fetchCoins = () => {
    const savedCoins = localStorage.getItem("userCoins");
    setCoins(savedCoins ? parseInt(savedCoins, 10) : 2405);
  };

  // Dengarkan perubahan koin di localStorage (saat DailyReward mengubahnya)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userCoins") {
        fetchCoins();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center bg-white py-2 shadow-md w-full 
          h-[50px] sm:h-[55px] border border-gray-200 overflow-x-auto whitespace-nowrap overflow-y-hidden">
        
        {/* Saldo */}
        <div className="flex-1 flex items-center justify-center space-x-2 py-2  
            hover:bg-gradient-to-r hover:from-[#ff9a9e] hover:to-[#fad0c4] transition-all duration-300 cursor-pointer">
          <FaWallet className="text-[#7f0353] text-sm sm:text-lg" />
          <div className="text-center">
            <p className="text-[10px] text-xs sm:text-sm text-gray-600">Saldo Anda</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">Rp1.225.000</p>
          </div>
        </div>

        <div className="h-[60%] border-l border-dashed border-gray-300"></div>

        {/* Koin (Diklik untuk membuka modal) */}
        <div className="flex-1 flex items-center justify-center space-x-2 py-2 relative  
            hover:bg-gradient-to-r hover:from-[#ffdd94] hover:to-[#fecd1a] transition-all duration-300 cursor-pointer">
          <FaCoins className="text-[#ffb703] text-sm sm:text-lg" />
          <div className="text-center flex items-center space-x-1">
            <div>
              <p className="text-[10px] text-xs sm:text-sm text-gray-600">Koin</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center">
                {coins}
              </p>
            </div>
            <DailyReward onClaim={fetchCoins} /> {/* Kirim fungsi update ke DailyReward */}
          </div>
        </div>

        <div className="h-[60%] border-l border-dashed border-gray-300"></div>

        {/* Promo */}
        <div className="flex-1 flex items-center justify-center space-x-2 py-2  
            hover:bg-gradient-to-r hover:from-[#a1c4fd] hover:to-[#c2e9fb] transition-all duration-300 cursor-pointer">
          <FaTags className="text-[#007bff] text-sm sm:text-lg" />
          <div className="text-center">
            <p className="text-[10px] text-xs sm:text-sm text-gray-600">Promo Spesial</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">Diskon 40RB</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPanel;
