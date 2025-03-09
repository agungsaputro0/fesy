import React, { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { useParams } from "react-router-dom";
import productsData from "../../pseudo-db/product.json";

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

const BackgroundRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const { productId } = useParams();
 // const navigate = useNavigate();
  const products: ProductProps[] = (productsData as unknown as ProductProps[]).map((p) => ({
    ...p,
    images: p.images || [],
    description: p.description || "",
    media: p.media || [],
  }));

  let product = products.find((p) => p.productID === productId);
  
    if (!product) {
      const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
      product = additionalProducts.find((p: ProductProps) => p.productID === productId);
    }
  
    const updatedProducts: ProductProps[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
    const updatedProduct = updatedProducts.find((p) => p.productID === productId);
    
    if (updatedProduct) {
      product = updatedProduct;
    }
    
    // const getDefaultMedia = () => {
    //   // Gabungkan images dan media menjadi satu array
    //   const allMedia = [
    //     ...(product?.images || []), 
    //     ...(product?.media?.map(m => m.url) || [])
    //   ];
    
    //   if (!allMedia.length) {
    //     return "../assets/img/produk/dummy.jpg"; // Jika kosong, pakai dummy image
    //   }
    
    //   // Cek apakah ada video di daftar media
    //   const video = allMedia.find(media => media.startsWith("data:video/"));
    
    //   return video || allMedia[0]; // Prioritas video, jika tidak ada pakai media pertama
    // };
    
    // State utama untuk menampilkan gambar/video
    // const [mainImage, setMainImage] = useState(() => 
    //   getDefaultMedia().startsWith("blob:") ? "../assets/img/produk/dummy.jpg" : getDefaultMedia()
    // );
    
    
  
    if (!product) {
      return <p className="text-center text-gray-500">Produk tidak ditemukan.</p>;
    }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);

    const imageBitmap = await createImageBitmap(file);

    try {
      const removedBackground: Blob = await removeBackground(imageBitmap, {
        output: { format: "image/png" }, // ✅ Format harus di dalam objek output
      });

      const processedUrl = URL.createObjectURL(removedBackground);
      setProcessedImage(processedUrl);
    } catch (error) {
      console.error("Error removing background:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div className="flex gap-4">
        {originalImage && <img src={originalImage} alt="Original" className="w-40 border" />}
        {processedImage && <img src={processedImage} alt="Processed" className="w-40 border bg-gray-200" />}
      </div>
    </div>
  );
};

export default BackgroundRemover;
