import React, { useState } from "react";
import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  productID: string;
  userID: number;
  images: string[];
  name: string;
  price: number;
  merk: string;
  condition: string;
  category: string[];
  bisaTukar: boolean;
  dikirimDari: string;
  size: string;
  description?: string;
  media?: { url: string; type: string }[];
}

const MixAndMatch: React.FC<{ product: ProductProps; relatedProducts: ProductProps[] }> = ({ product, relatedProducts }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(relatedProducts[0] || null);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Mix and Match</h1>
      <div className="relative w-64 h-64 mb-4">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
        {selectedProduct && (
          <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="absolute top-0 left-0 w-full h-full object-contain opacity-80" />
        )}
      </div>

      <Carousel
        dots={false}
        infinite
        slidesToShow={3}
        centerMode
        afterChange={(index) => setSelectedProduct(relatedProducts[index])}
      >
        {relatedProducts.map((related) => (
          <div key={related.productID} className="p-2 flex justify-center">
            <img src={related.images[0]} alt={related.name} className="w-32 h-32 cursor-pointer object-contain" />
          </div>
        ))}
      </Carousel>
      
      <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">Kembali</button>
    </div>
  );
};

export default MixAndMatch;
