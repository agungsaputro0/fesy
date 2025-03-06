import { useState, useEffect } from "react";
import { EnvironmentOutlined, SwapOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import usersData from "../../pseudo-db/users.json";

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
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const navigate = useNavigate();
  const [sellerLocation, setSellerLocation] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    // Ambil lokasi penjual
    const seller = usersData.find((user) => user.id === product.userID);
    if (seller && Array.isArray(seller.alamat)) {
      const selectedAddress = seller.alamat.find(addr => addr.alamatDipilih);
      setSellerLocation(selectedAddress ? selectedAddress.detail : seller.alamat[0]?.detail || "Alamat tidak tersedia");
    }

    // Cek apakah produk sedang menunggu diproses dalam orders
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
    color,
    bisaTukar,
    size,
  } = product;

  const image = images.length > 0 && images[0] ? images[0] : "assets/img/produk/dummy.jpg";

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md w-60 relative mb-10 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-2 hover:border-[#7f0353]"
    >
      {/* Jika produk dalam proses, tampilkan label di sudut atas */}
      {isPending && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
          <ClockCircleOutlined /> MENUNGGU DIPROSES
        </div>
      )}

      <img src={image} alt={name} onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")} className="w-full h-52 object-cover rounded-t-lg" />

      <div className="p-2">
        <h2 className="text-md font-semibold leading-tight line-clamp-2 overflow-hidden text-ellipsis">
          {merk} {name}, {color}, {size}
        </h2>

        <p className="text-gray-500 mt-2 text-[11px] leading-tight">Kategori: {category.join(", ")}</p>
        <p className="text-gray-700 text-[11px] leading-tight">Kondisi: {condition}</p>

        <div className="flex items-center justify-between mt-1">
          <p className="text-lg font-bold text-[#7f0353]">Rp {price.toLocaleString("id-ID")}</p>
          {bisaTukar && (
            <span className="flex items-center gap-1 bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-lg animate-pulse">
              <SwapOutlined className="text-sm" /> Bisa Tukar
            </span>
          )}
        </div>

        {/* Dikirim Dari */}
        <p className="text-gray-700 text-[11px] flex items-center gap-1">
          <EnvironmentOutlined /> {sellerLocation || "Tidak diketahui"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
