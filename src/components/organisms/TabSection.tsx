import React, { useState } from "react";
import Tabs from "../molecules/Tabs";
import TabCard from "../atoms/TabCard";

const sellerFeatures = [
  { image: "../../../assets/img/tab/upload.png", title: "UNGGAH PRODUK", description: "Ambil foto pakaian yang ingin dijual, berikan deskripsi, ukuran, kondisi, dan harga" },
  { image: "../../../assets/img/tab/share.png", title: "TAWARKAN PRODUK", description: "Bagikan melalui Fesy & sebarkan ke banyak calon pembeli" },
  { image: "../../../assets/img/tab/get_money.png", title: "DAPATKAN UANG", description: "Setelah dibayar, kirimkan pakaian ke pembeli dan dapatkan uang" },
];

const buyerFeatures = [
  { image: "../../../assets/img/tab/find.png", title: "CARI PRODUK", description: "Temukan pakaian yang sesuai dengan gaya dan kebutuhanmu." },
  { image: "../../../assets/img/tab/pay.png", title: "LAKUKAN PEMBAYARAN", description: "Bayar dengan metode yang tersedia.!" },
  { image: "../../../assets/img/tab/wait.png", title: "TUNGGU PENGIRIMAN", description: "Penjual akan mengirimkan pakaian ke alamatmu" },
  { image: "../../../assets/img/tab/receive.png", title: "TERIMA DAN PAKAI", description: "Pastikan barang sesuai dan siap digunakan!" },
];

const switchFeatures = [
  { image: "../../../assets/img/tab/upload.png", title: "UNGGAH DATA PRODUK", description: "Pilih pakaian yang ingin ditukar, lengkapi dengan deskripsi, ukuran, dan kondisi" },
  { image: "../../../assets/img/tab/partner.png", title: "CARI PARTNER TUKAR", description: "Temukan pengguna lain yang ingin bertukar" },
  { image: "../../../assets/img/tab/deal.png", title: "BUAT KESEPAKATAN", description: "Setujui kesepakatan, apakah langsung tukar atau ada biaya tambahan" },
  { image: "../../../assets/img/tab/packet.png", title: "KIRIM DAN TERIMA", description: "Kirim baju dan terima baju dari partner tukarmu." },
];

const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("PENJUAL");

  const currentFeatures =
    activeTab === "PENJUAL" ? sellerFeatures : activeTab === "PEMBELI" ? buyerFeatures : switchFeatures;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 text-center font-extrabold">
        BAGAIMANA CARANYA
      </h2>

      {/* Tab Switching */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tampilan Desktop (Jika ada 3, tetap di tengah) */}
      <div
        className={`hidden sm:grid gap-6 mt-8 ${
          currentFeatures.length === 3
            ? "grid-cols-3 justify-center" // Jika 3 item, tetap di tengah
            : "grid-cols-1 sm:grid-cols-3 lg:grid-cols-4" // Jika lebih dari 3, buat grid normal
        }`}
      >
        {currentFeatures.map((feature, index) => (
          <div className="flex justify-center" key={index}>
            <TabCard image={feature.image} title={feature.title} description={feature.description} />
          </div>
        ))}
      </div>

      {/* Tampilan Mobile (Carousel) */}
      <div className="sm:hidden overflow-x-auto flex gap-4 mt-8 px-6 py-4 scrollbar-hide snap-x snap-mandatory relative">
        {/* Scroller Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-transparent z-0"></div>

        {currentFeatures.map((feature, index) => (
          <div key={index} className="flex-shrink-0 w-4/5 snap-center px-2">
            <TabCard image={feature.image} title={feature.title} description={feature.description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSection;
