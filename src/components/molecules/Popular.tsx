// src/components/Popular.tsx
import React from "react";

interface PopularProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Popular: React.FC<PopularProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center space-x-8 border-b-2 border-gray-200 mb-6 relative">
      {["MERK", "KATEGORI"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-lg font-semibold relative ${
            activeTab === tab ? "text-black" : "text-gray-400"
          }`}
        >
          {tab}
          {/* Underline animasi */}
          <span
            className={`absolute left-0 bottom-[-2px] h-[3px] w-full bg-black transition-all duration-300 ${
              activeTab === tab ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default Popular;
