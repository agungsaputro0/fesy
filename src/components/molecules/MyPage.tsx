import { useEffect, useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";
import usersData from "../../pseudo-db/users.json";
import productsData from "../../pseudo-db/product.json";
import ProductCard from "../atoms/ProductCard";
import TambahProdukModal from "./AddProductModal";
import LevelingPanel from "../atoms/LevelingPanel";

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

interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; quantity: number; image: string }[];
  total: number;
  status: "Menunggu Konfirmasi" | "Diproses" | "Dikirim" | "Selesai";
}


const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userLevel, setUserLevel] = useState<string>("Rookie");
  const [activeTab, setActiveTab] = useState("JUAL");
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
        try {
            const currentUser: User = JSON.parse(storedUser);
            const foundUser = usersData.find((u) => u.id === currentUser.id) || null;
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

useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    
  const orders = allOrders.filter((order: any) => order.userID === currentUser.id);

  const totalTransactions = orders.length;

  if (totalTransactions >= 30) {
    setUserLevel("Master Recycler");
  } else if (totalTransactions >= 15) {
    setUserLevel("Eco Warrior");
  } else if (totalTransactions >= 5) {
    setUserLevel("Green Enthusiast");
  } else {
    setUserLevel("Rookie");
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

  const [orders, setOrders] = useState<Order[]>([]);
    const [activeTabJual, setActiveTabJual] = useState<
      "SEMUA" | "MENUNGGU" | "DIPROSES" | "DIKIRIM" | "SELESAI"
    >("SEMUA");
    const [searchTerm, setSearchTerm] = useState("");
  
    const getStatusColor = (status: Order["status"]) => {
      switch (status) {
        case "Menunggu Konfirmasi":
          return "bg-orange-100 text-orange-600";
        case "Diproses":
          return "bg-blue-100 text-blue-600";
        case "Dikirim":
          return "bg-purple-100 text-purple-600";
        case "Selesai":
          return "bg-green-100 text-green-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };  
  
    useEffect(() => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) return;
  
      const parsedUser = JSON.parse(currentUser);
      const currentUserID = parsedUser.id;
  
      const savedOrders = localStorage.getItem("orders");
      if (!savedOrders) return;
  
      try {
        const parsedOrders = JSON.parse(savedOrders);
        const allOrders = Array.isArray(parsedOrders) ? parsedOrders : [parsedOrders];
  
        const userOrders = allOrders
          .filter((order: any) => order.userID === currentUserID)
          .reduce((acc: Record<string, Order>, order: any) => {
            const orderId = order.orderID ?? `ORD-${Math.random().toString(36).substr(2, 9)}`;
            
            if (!acc[orderId]) {
              acc[orderId] = {
                id: orderId,
                date: new Date(order.orderDate).toLocaleDateString("id-ID"),
                items: [],
                total: order.grandTotal,
                status: order.status || "Menunggu Konfirmasi",
              };
            }
  
            order.orders.forEach((o: any) => {
              o.products.forEach((product: any) => {
                acc[orderId].items.push({
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images[0],
                });
              });
            });
  
            return acc;
          }, {});
  
        setOrders(Object.values(userOrders));
      } catch (error) {
        console.error("Error parsing orders:", error);
        setOrders([]);
      }
    }, []);
  
    const filteredOrders = orders?.filter((order) => {
      const matchesTab =
      activeTabJual === "SEMUA" ||
        (activeTabJual === "MENUNGGU" && order.status === "Menunggu Konfirmasi") ||
        (activeTabJual === "DIPROSES" && order.status === "Diproses") ||
        (activeTabJual === "DIKIRIM" && order.status === "Dikirim") ||
        (activeTabJual === "SELESAI" && order.status === "Selesai");
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    }) ?? [];
  

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
      <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
        <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <div className="p-[2px] sm:p-[20px]">
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3">
              <h2 className="text-2xl text-[#7f0353] font-semibold">
                <UserOutlined className="w-8 h-8" /> Tentang Saya
              </h2>
            </div>
            {user ? (
              <>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-10">
                <img
                  src={user.fotoProfil}
                  alt={user.nama}
                  className="w-24 h-24 supernarrow:w-14 supernarrow:h-14 sm:w-28 sm:h-28 rounded-full border border-gray-300 transition-all duration-300 hover:w-20 hover:h-20 sm:hover:w-32 sm:hover:h-32"
                  onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                />

                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {user.nama}
                      <span className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded-lg">
                        {userLevel}
                      </span>
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
                <div className="flex justify-center space-x-4 mt-6 mb-6 align-middle">
                  <button className="bg-[#7f0353] text-xs sm:text-sm h-[35px] w-[200px] text-white px-4 rounded-lg hover:bg-pink-700">
                    Edit Profil
                  </button>
                  <button className="bg-white text-xs sm:text-sm border h-[35px] w-[200px] border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                    Tambah Alamat
                  </button>
                </div>
                <LevelingPanel />
                <div className="flex justify-center pt-8 space-x-6 border-b-2 border-gray-200 mb-4 relative">
                  {['JUAL', 'BELI'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm sm:text-lg font-semibold relative ${activeTab === tab ? "text-black" : "text-gray-400"}`}
                    >
                      {tab}
                      <span
                        className={`absolute left-0 bottom-[-2px] h-[3px] w-full bg-black transition-all duration-300 ${
                          activeTab === tab ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {activeTab === "JUAL" && (
                  <div className="mb-4 border-b pb-4 flex justify-between items-center">
                    <TambahProdukModal userID={user?.id || 0} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      className="border border-gray-300 px-3 py-2 rounded-lg w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}

                <div className="mt-4">
                  {activeTab === "JUAL" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <ProductCard key={product.productID} product={product} />
                        ))
                      ) : (
                        <p className="text-center">Belum ada produk yang dijual</p>
                      )}
                    </div>
                  ) : (
                    <>
                    <div className="flex justify-center pt-8 space-x-6 border-b-2 border-gray-200 mb-6 relative">
                      {["SEMUA", "MENUNGGU", "DIPROSES", "DIKIRIM", "SELESAI"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTabJual(tab as any)}
                          className={`pb-2 text-lg font-semibold relative ${
                            activeTabJual === tab ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {tab}
                          <span
                            className={`absolute left-0 bottom-[-2px] h-[3px] w-full bg-black transition-all duration-300 ${
                              activeTabJual === tab ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Cari ID atau Nama Produk"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded-md mb-4"
                    />
                    {filteredOrders.length === 0 ? (
                      <p className="text-center text-gray-500">Tidak ada pesanan di kategori ini.</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <div key={order.id} className="border p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700 text-sm">ID: {order.id} | {order.date}</p>
                              <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex border-b p-4 items-center space-x-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                <div>
                                  <p className="text-lg font-medium">{item.name}</p>
                                  <p className="text-gray-500 text-sm">{item.quantity} x Rp{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                            <div className="mt-2 text-right">
                              <p className="font-semibold">
                                Total Pesanan: <span className="text-xl font-bold text-[#7f0353]">Rp {order.total.toLocaleString()}</span>
                              </p>
                              <button className="bg-[#7f0353] text-white h-[35px] mt-4 rounded w-[200px] text-sm font-semibold">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    </>
                  )}
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

export default MyPage;
