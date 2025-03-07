import { useState, useEffect } from "react";

interface Achievement {
  name: string;
  progress: number;
  max: number;
  icon: string;
  reward: string;
}

const LevelingPanel = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Ambil data orders dari localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        
    const orders = allOrders.filter((order: any) => order.userID === currentUser.id);
    
    // Hitung jumlah produk yang dibeli
    const itemsBought = orders.reduce((total: number, order: any) => {
      return total + order.orders.reduce((sum: number, sellerOrder: any) => sum + sellerOrder.products.length, 0);
    }, 0);

    // Hitung jumlah transaksi
    const totalTransactions = orders.length;

    // Data pencapaian user
    const newAchievements: Achievement[] = [
      { name: "Sampah Berkurang 🌱", progress: itemsBought, max: 50, icon: "🌍", reward: "Diskon 10% setelah mencapai 50 produk" },
      { name: "Transaksi Berhasil 💳", progress: totalTransactions, max: 30, icon: "💰", reward: "Gratis ongkir setelah 30 transaksi" },
    ];

    setAchievements(newAchievements);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-full">
      <h2 className="text-lg font-semibold mb-3">🏆 Pencapaian Kamu</h2>
      <div className="space-y-3">
        {achievements.map((ach, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-medium">{ach.icon} {ach.name} ({ach.progress}/{ach.max})</span>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(ach.progress / ach.max) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 mt-1">🎁 {ach.reward}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelingPanel;
