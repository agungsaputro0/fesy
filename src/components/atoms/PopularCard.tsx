// src/components/PopularCard.tsx
import React from "react";

interface PopularCardProps {
  image: string;
  title: string;
}

const PopularCard: React.FC<PopularCardProps> = ({ image, title }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 text-center w-[300px] h-[230px] flex flex-col">
      {/* Gambar dengan ukuran tetap */}
      <img src={image} alt={title} className="w-full h-[150px] object-cover rounded-lg mb-4" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
};

export default PopularCard;
