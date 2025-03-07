import { useState, useEffect } from "react";
import { EnvironmentOutlined, SwapOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import usersData from "../../pseudo-db/users.json";
import useIsMobile from "../hooks/useMobile";

interface ProductProps {
  productID: string;
  images: string[];
  name: string;
  price: number;
  merk: string;
  condition: string;
  category: string[];
  color?: string;
  bisaTukar: boolean;
  userID: number;
  size: string;
  media?: { url: string; type: string }[];
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sellerLocation, setSellerLocation] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    const seller = usersData.find((user) => user.id === product.userID);
    if (seller && Array.isArray(seller.alamat)) {
      const selectedAddress = seller.alamat.find(addr => addr.alamatDipilih);
      setSellerLocation(selectedAddress ? selectedAddress.provinsi : seller.alamat[0]?.provinsi || "Alamat tidak tersedia");
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const pendingProducts = new Set(
      orders.flatMap((order: any) =>
        order.orders.flatMap((seller: any) =>
          seller.products.map((p: any) => p.productID)
        )
      )
    );
    setIsPending(pendingProducts.has(product.productID));
  }, [product.productID, product.userID]);

  const handleClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role === 2) {
      navigate(`/Product/${product.productID}`);
    } else {
      navigate(`/ProductDetail/${product.productID}`);
    }
  };

  const {
    images,
    name,
    price,
    merk,
    condition,
    category,
    bisaTukar,
    size,
    media
  } = product;

  const image = images.length > 0 
  ? images[0] 
  : media?.find(m => m.type.startsWith("image/"))?.url || "assets/img/produk/dummy.jpg";


  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md w-full sm:w-60 lg:w-60 xl:w-64 relative mb-6 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-2 hover:border-[#7f0353]"
    >
      {isPending && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
          <ClockCircleOutlined /> MENUNGGU DIPROSES
        </div>
      )}

      <img 
        src={image} 
        alt={name} 
        onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")} 
        className="w-full h-40 sm:h-48 lg:h-52 object-cover rounded-t-lg transition-all"
      />

      <div className="p-2">
        <h2 className="text-sm sm:text-md lg:text-lg font-semibold leading-tight line-clamp-2 overflow-hidden text-ellipsis">
          {merk} {name}, {size}
        </h2>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm truncate max-w-[200px]">
          Kategori: {category.join(", ")}
        </p>
       {!isMobile && (
        <p className="text-gray-700 text-xs sm:text-sm">Kondisi: {condition}</p>
       )}
        <div className={`${isMobile ? '' : 'flex items-center justify-between' }  mt-1`}>
          <p className="text-md mt-1 mb-1 sm:text-lg font-bold text-[#7f0353]">Rp {price.toLocaleString("id-ID")}</p>
          {bisaTukar && (
            <span className={`${isMobile ? 'w-4/5' : '' } flex items-center gap-1 bg-green-200 text-green-800 text-xs mt-1 mb-1 sm:text-sm font-semibold px-2 py-1 rounded-lg animate-pulse`}>
              <SwapOutlined className="text-sm" /> Bisa Tukar
            </span>
          )}
        </div>

        <p className="text-gray-700 text-xs sm:text-sm flex items-center gap-1">
          <EnvironmentOutlined /> {sellerLocation || "Tidak diketahui"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
