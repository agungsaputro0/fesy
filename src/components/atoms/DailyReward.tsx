import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { FaCoins, FaCheck } from "react-icons/fa";
import { MdCardGiftcard } from "react-icons/md";
import useWindowSize from "react-use/lib/useWindowSize";
import { notification } from "antd";
interface DailyRewardProps {
  onClaim?: () => void; // Tambahkan callback untuk update koin di Dashboard
}

const DailyReward: React.FC<DailyRewardProps> = ({ onClaim }) => {
  const [coins, setCoins] = useState(2405);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [lastClaimDate, setLastClaimDate] = useState<number | null>(null);
  const { width, height } = useWindowSize();

  const rewards = [10, 20, 15, 30, 25, 50, 200];

  // Dapatkan tanggal hari ini dalam bentuk angka (misal: 20250308)
  const getCurrentDate = () => {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  };

  useEffect(() => {
    const savedCoins = localStorage.getItem("userCoins");
    const savedClaims = localStorage.getItem("claimedDays");
    const savedLastClaim = localStorage.getItem("lastClaimDate");
  
    setCoins(savedCoins ? parseInt(savedCoins, 10) : 2405); // Default 2405 jika tidak ada data
    if (savedClaims) setClaimedDays(JSON.parse(savedClaims));
    if (savedLastClaim) setLastClaimDate(parseInt(savedLastClaim, 10));
  }, []);
  

  useEffect(() => {
    localStorage.setItem("userCoins", coins.toString());
    localStorage.setItem("claimedDays", JSON.stringify(claimedDays));
    if (lastClaimDate !== null) localStorage.setItem("lastClaimDate", lastClaimDate.toString());
  }, [coins, claimedDays, lastClaimDate]);

  const claimReward = (dayIndex: number) => {
    const today = getCurrentDate();

    if (!claimedDays.includes(dayIndex) && (lastClaimDate === null || today > lastClaimDate)) {
      const newCoins = coins + rewards[dayIndex];
      setCoins(newCoins);
      setClaimedDays([...claimedDays, dayIndex]);
      setLastClaimDate(today);

      localStorage.setItem("userCoins", newCoins.toString());
      localStorage.setItem("claimedDays", JSON.stringify([...claimedDays, dayIndex]));
      localStorage.setItem("lastClaimDate", today.toString());

      setShowConfetti(true);
      setFadeOut(false);

      setTimeout(() => setFadeOut(true), 4000);
      setTimeout(() => setShowConfetti(false), 5000);
    
      notification.success({ message: "Selamat", description: `Anda mendapatkan ${rewards[dayIndex]} koin!` });

      if (onClaim) onClaim(); 
    }
  };

  return (
    <>
      {showConfetti && (
        <div
          className={`fixed top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          style={{ zIndex: 9999 }}
        >
          <Confetti width={width} height={height} numberOfPieces={200} recycle={false} gravity={0.3} wind={0.01} tweenDuration={5000} />
        </div>
      )}

      <span
        onClick={() => setIsOpen(true)}
        className="bg-[#ffb703] text-white text-xs p-[6px] sm:p-[8px] rounded-full hover:bg-[#fda502] transition-all duration-200 shadow-md flex items-center animate-pulse"
      >
        <MdCardGiftcard size={16} className="animate-bounce" />
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white py-6 sm:p-8 rounded-2xl shadow-2xl text-center relative transform transition-all scale-95 animate-slide-up 
            w-[95%] max-w-[600px] bg-opacity-95 backdrop-blur-lg border border-gray-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors text-lg"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-4">🎁 Daily Reward</h2>
            <div className="grid grid-cols-7 gap-3 w-full px-3">
              {[...Array(7)].map((_, index) => {
                const isClaimed = claimedDays.includes(index);
                const canClaim =
                !isClaimed &&
                (index === 0 || claimedDays.includes(index - 1)) &&
                (lastClaimDate === null || getCurrentDate() > lastClaimDate); 

                return (
                    <button
                    key={index}
                    className={`p-3 sm:p-4 rounded-lg font-bold transition-all transform active:scale-90 text-sm sm:text-base flex flex-col items-center justify-center
                      ${
                        isClaimed
                          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg border-2 border-yellow-500 scale-95"
                          : canClaim
                          ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white border-2 border-yellow-300 shadow-xl animate-glow pulse-effect"
                          : "bg-gradient-to-r from-red-400 to-orange-500 text-gray-200 cursor-not-allowed opacity-80 shadow-inner"
                      }`}
                    disabled={!canClaim}
                    onClick={() => claimReward(index)}
                  >
                    <p className="text-base sm:text-lg font-bold">{index + 1}</p>
                    {isClaimed ? (
                      <FaCheck className="text-white text-lg sm:text-xl mt-1 animate-pop" />
                    ) : (
                      <FaCoins className="text-yellow-200 text-lg sm:text-xl mt-1 animate-bounce" />
                    )}
                    <p className="text-xs sm:text-sm font-semibold mt-1">+{rewards[index]}</p>
                  </button>
                  
                );
              })}
            </div>
            <p className="mt-6 mx-12 bg-[#7f0353] text-white text-sm align-center font-semibold px-2 py-1 rounded-full">
              Total Koin: <span className="text-lg sm:text-xl font-bold text-yellow-300">{coins}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyReward;
