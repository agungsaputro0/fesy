// src/components/TabSection.tsx
import React, { useState } from "react";
import Tabs from "../molecules/Tabs";
import TabCard from "../atoms/TabCard";

const sellerFeatures = [
  {
    image: "../../../assets/img/tab/upload.png",
    title: "UNGGAH PRODUK",
    description: "Ambil foto pakaian yang ingin dijual, berikan deskripsi, ukuran, kondisi, dan harga",
  },
  {
    image: "../../../assets/img/tab/share.png",
    title: "TAWARKAN PRODUK",
    description: "Bagikan melalui Fesy & sebarkan ke banyak calon pembeli",
  },
  {
    image: "../../../assets/img/tab/get_money.png",
    title: "DAPATKAN UANG",
    description: "Setelah dibayar, kirimkan pakaian ke pembeli dan dapatkan uang",
  },
];

const buyerFeatures = [
  {
    image: "../../../assets/img/tab/find.png",
    title: "CARI PRODUK",
    description: "Temukan pakaian yang sesuai dengan gaya dan kebutuhanmu.",
  },
  {
    image: "../../../assets/img/tab/pay.png",
    title: "LAKUKAN PEMBAYARAN",
    description: "Bayar dengan metode yang tersedia.!",
  },
  {
    image: "../../../assets/img/tab/wait.png",
    title: "TUNGGU PENGIRIMAN",
    description: "Penjual akan mengirimkan pakaian ke alamatmu",
  },
  {
    image: "../../../assets/img/tab/receive.png",
    title: "TERIMA DAN PAKAI",
    description: "Pastikan barang sesuai dan siap digunakan!",
  },
];

const switchFeatures = [
  {
    image: "../../../assets/img/tab/upload.png",
    title: "UNGGAH DATA PRODUK",
    description: "Pilih pakaian yang ingin ditukar, lengkapi dengan deskripsi, ukuran, dan kondisi",
  },
  {
    image: "../../../assets/img/tab/partner.png",
    title: "CARI PARTNER TUKAR",
    description: "Temukan pengguna lain yang ingin bertukar",
  },
  {
    image: "../../../assets/img/tab/deal.png",
    title: "BUAT KESEPAKATAN",
    description: "Setujui kesepakatan, apakah langsung tukar atau ada biaya tambahan",
  },
  {
    image: "../../../assets/img/tab/packet.png",
    title: "KIRIM DAN TERIMA",
    description: "Kirim baju dan terima baju dari partner tukarmu.",
  },
];

const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("PENJUAL");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 text-center font-extrabold">BAGAIMANA CARANYA</h2>
      {/* Tab Switching */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Card List Sesuai Tab */}
      <div className="flex justify-center gap-6">
        {(
          activeTab === "PENJUAL" ? sellerFeatures : 
          activeTab === "PEMBELI" ? buyerFeatures : 
          switchFeatures
        ).map((feature, index) => (
          <TabCard key={index} image={feature.image} title={feature.title} description={feature.description} />
        ))}
      </div>
    </div>
  );
};

export default TabSection;
