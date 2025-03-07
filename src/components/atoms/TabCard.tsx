import React from "react";

interface TabCardProps {
  image: string;
  title: string;
  description: string;
}

const TabCard: React.FC<TabCardProps> = ({ image, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 text-center max-w-sm w-full flex flex-col items-center h-full transition duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
      {/* Gambar lebih fleksibel */}
      <div className="w-full flex justify-center">
        <img src={image} alt={title} className="w-3/4 sm:w-4/5 max-h-40 object-contain rounded-lg" />
      </div>

      {/* Wrapper untuk memastikan tinggi seragam */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold mt-4">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm min-h-[48px]">{description}</p> {/* Min height untuk seragam */}
      </div>
    </div>
  );
};

export default TabCard;
