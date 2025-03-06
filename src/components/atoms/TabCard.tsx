// src/components/TabCard.tsx
import React from "react";

interface TabCardProps {
  image: string;
  title: string;
  description: string;
}

const TabCard: React.FC<TabCardProps> = ({ image, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 text-center w-[300px] h-[450px] flex flex-col">
      {/* Gambar dengan ukuran tetap */}
      <img src={image} alt={title} className="w-full h-[250px] object-cover rounded-lg mb-4" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{description}</p>
    </div>
  );
};

export default TabCard;
