// src/components/PopularSection.tsx
import React, { useState } from "react";
import Popular from "../molecules/Popular";
import PopularCard from "../atoms/PopularCard";

const merkFeatures = [
  {
    image: "../../../assets/img/tab/hoka.jpg",
    title: "HOKA",
  },
  {
    image: "../../../assets/img/tab/rabbani.png",
    title: "RABBANI",
  },
  {
    image: "../../../assets/img/tab/cartenz.jpg",
    title: "CARTENZ",
  },
];

const kategoriFeatures = [
    {
      image: "../../../assets/img/tab/sport.jpg",
      title: "OLAHRAGA",
    },
    {
      image: "../../../assets/img/tab/women.jpg",
      title: "WANITA",
    },
    {
      image: "../../../assets/img/tab/men.jpg",
      title: "PRIA",
    },
  ];

const PopularSection: React.FC = () => {
  const [activePopular, setActivePopular] = useState("MERK");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 text-center font-extrabold">PALING DICARI</h2>
      {/* Popular Switching */}
      <Popular activeTab={activePopular} setActiveTab={setActivePopular} />

      {/* Card List Sesuai Popular */}
      <div className="flex justify-center gap-6">
        {(
          activePopular === "MERK" ? merkFeatures : 
          kategoriFeatures
        ).map((feature, index) => (
          <PopularCard key={index} image={feature.image} title={feature.title} />
        ))}
      </div>
    </div>
  );
};

export default PopularSection;
