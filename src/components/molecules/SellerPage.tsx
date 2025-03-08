import { useEffect, useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import usersData from "../../pseudo-db/users.json";
import productsData from "../../pseudo-db/product.json";
import ProductCard from "../atoms/ProductCardForSellerPage";

type User = {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  fotoProfil: string;
  alamat: { id: number; label: string; detail: string; alamatDipilih?: boolean }[];
  role: number;
  password: string;
};

type Product = {
  productID: string;
  images: string[];
  name: string;
  price: number;
  merk: string;
  condition: string;
  category: string[];
  color?: string;
  bisaTukar: boolean;
  dikirimDari: string;
  size: string;
  userID: number;
};

const SellerPage = () => {
  const { sellerID } = useParams<{ sellerID: string }>(); // Ambil sellerID dari URL
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!sellerID) return;
    if (sellerID) {
        try {

            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                try {
                    const currentUser: User = JSON.parse(storedUser);

                    // Pastikan sellerID tidak null, dan ubah currentUser.id ke string jika perlu
                    if (sellerID && sellerID === String(currentUser.id)) {
                        if (currentUser.role === 2) {
                            navigate(`/MyPage`);
                        } else {
                            navigate(`/SellerPage`);
                        }
                    }
                } catch (error) {
                    console.error("Error parsing currentUser:", error);
                }
            }

            const foundUser = usersData.find((u) => u.id.toString() === sellerID) || null;
            setUser(foundUser);

            const updateUserProducts = () => {
                if (foundUser) {
                    let products = productsData.filter((product) => product.userID === foundUser.id);
                    const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
                    const userAdditionalProducts = additionalProducts.filter((product: Product) => product.userID === foundUser.id);
                    
                    // Ambil daftar produk yang telah dihapus dari LocalStorage
                    const deletedProducts = JSON.parse(localStorage.getItem("productDeleted") || "[]");
                    const deletedProductIDs = new Set(deletedProducts.map((item: { productId: string }) => item.productId));

                    // Ambil daftar produk yang telah diperbarui
                    const updatedProducts = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
                    const updatedProductMap = new Map(updatedProducts.map((product: Product) => [product.productID, product]));

                    // Filter produk agar tidak menampilkan yang ada di deletedProducts
                    const filteredProducts = [...products, ...userAdditionalProducts]
                        .filter(product => !deletedProductIDs.has(product.productID))
                        .map(product => updatedProductMap.get(product.productID) || product); // Ganti dengan versi terbaru jika ada

                    setUserProducts(filteredProducts);
                }
            };

            updateUserProducts();

            // Event listener untuk menangkap perubahan
            const handleProductsUpdate = () => updateUserProducts();
            window.addEventListener("additionalProductsUpdated", handleProductsUpdate);
            window.addEventListener("updatedProductUpdated", handleProductsUpdate);

            return () => {
                window.removeEventListener("additionalProductsUpdated", handleProductsUpdate);
                window.removeEventListener("updatedProductUpdated", handleProductsUpdate);
            };
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }
}, []);

  const getPrimaryAddress = () => {
    if (!user || user.alamat.length === 0) return null;
    return user.alamat.find((addr) => addr.alamatDipilih) || user.alamat[0];
  };

  const filteredProducts = userProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.merk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 py-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
                    <h2 className="flex items-center text-2xl text-[#7f0353]">
                    <ArrowLeftOutlined onClick={() => navigate(-1)} className="w-8 h-8" /> <UserOutlined className="w-8 h-8" /> Halaman Penjual
                        </h2>
                        </div>
            {user ? ( 
              <>
                <div className="flex justify-center space-x-6 mt-10">
                <img
                  src={user.fotoProfil}
                  alt={user.nama}
                  className="w-24 h-24 supernarrow:w-16 supernarrow:h-16 sm:w-28 sm:h-28 rounded-full border border-gray-300 transition-all duration-300 hover:w-20 hover:h-20 sm:hover:w-32 sm:hover:h-32"
                  onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                />
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {user.nama}
                    </h2>
                    <p className="flex text-sm sm:text-lg items-center text-gray-700">
                      <FaPhoneAlt className="text-[#7f0353] mr-2" /> {user.telepon}
                    </p>
                    <p className="flex text-sm sm:text-lg items-center text-gray-700">
                      <FaEnvelope className="text-[#7f0353] mr-2" /> {user.email}
                    </p>
                    {getPrimaryAddress() && (
                      <p className="flex text-sm sm:text-lg items-center text-gray-700">
                        <FaMapMarkerAlt className="text-[#7f0353] mr-2" /> {getPrimaryAddress()?.detail}
                      </p>
                    )}
                  </div>
                </div>
                
                

               
                <div className="mb-4 mt-10 sm:mt-20 mx-4 border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              
                
                <div className="mt-4 mx-4">
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <ProductCard key={product.productID} product={product} />
                        ))
                      ) : (
                        <p className="text-center">Belum ada produk yang dijual</p>
                      )}
                    </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">User not found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerPage;
