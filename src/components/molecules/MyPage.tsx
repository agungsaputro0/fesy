import { useEffect, useState, useRef } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaShoppingBag } from "react-icons/fa";
import { UserOutlined, CopyOutlined, ShareAltOutlined, DownloadOutlined, IdcardOutlined } from "@ant-design/icons";
import usersData from "../../pseudo-db/users.json";
import productsData from "../../pseudo-db/product.json";
import ProductCard from "../atoms/ProductCard";
import TambahProdukModal from "./AddProductModal";
import LevelingPanel from "../atoms/LevelingPanel";
import useIsMobile from "../hooks/useMobile";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Modal, Button, notification } from "antd";


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

interface Address {
  id: number;
  label: string;
  provinsi: string;
  kabupaten: string; // Menampung data Kabupaten atau Kota
  detail: string;
  kodePos: string;
  alamatDipilih: boolean;
}

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
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  

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
  if (!currentUser || currentUser.alamat.length === 0) return null;
  return currentUser.alamat.find((addr: Address) => addr.alamatDipilih) || currentUser.alamat[0];
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

    const goToPersonalization = () => {
      navigate(`/Personalization`);
    }
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const profileUrl = `https://fesy-git-main-agung-saputros-projects.vercel.app/Seller/${userData.id}`; 
    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      notification.success({message:"Selamat", description:"Link profil berhasil disalin!"});
      setTimeout(() => setCopied(false), 2000);
    };
  
    const shareProfile = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Bagikan Profil",
            text: "Lihat profil saya di Fesy!",
            url: profileUrl,
          });
           notification.success({message:"Selamat", description:"Berhasil dibagikan!"});
        } catch (error) {
           notification.error({message:"Mohon Maaf", description:"Gagal membagikan."});
        }
      } else {
        notification.warning({message:"Mohon maaf", description:"Fitur berbagi tidak didukung di perangkat ini."});
      }
    };
  
    const downloadQRCode = () => {
      if (qrRef.current) {
        const canvas = qrRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "QR_Profile.png";
        link.click();
        notification.success({message:"Selamat", description:"QR Code berhasil diunduh!"});
      }
    };

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
                  <button onClick={() => goToPersonalization()} className="bg-[#7f0353] text-xs sm:text-sm h-[35px] w-[200px] text-white px-4 rounded-lg hover:bg-pink-700">
                    <IdcardOutlined /> Personalisasi
                  </button>
                  <button onClick={() => setIsModalVisible(true)} className="bg-white text-xs sm:text-sm border h-[35px] w-[200px] border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                    <ShareAltOutlined /> Bagikan Profil
                  </button>
                </div>
                <Modal
                  title="Bagikan Profil"
                  open={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  footer={null}
                  centered
                  className="animate-fade-in"
                >
                  <div className="flex justify-center mb-4">
                    <QRCodeCanvas value={profileUrl} size={150} ref={qrRef} className="shadow-lg rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <Button 
                      type="primary" 
                      block 
                      icon={<CopyOutlined />} 
                      onClick={copyToClipboard}
                      className="transition-transform duration-200 active:scale-95"
                    >
                      {copied ? "Tersalin!" : "Copy Link"}
                    </Button>
                    <Button 
                      block 
                      icon={<ShareAltOutlined />} 
                      onClick={shareProfile}
                      className="hover:bg-gray-100 transition-transform duration-200 active:scale-95"
                    >
                      Bagikan
                    </Button>
                    <Button 
                      block 
                      icon={<DownloadOutlined />} 
                      onClick={downloadQRCode}
                      className="hover:bg-gray-100 transition-transform duration-200 active:scale-95"
                    >
                      Unduh QR Code
                    </Button>
                  </div>
                </Modal>
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
                      className="border border-gray-300 ml-4 px-3 py-2 rounded-lg w-64"
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
                    <div className="w-full overflow-y-hidden flex justify-center pb-2 overflow-x-auto border-b-2 border-gray-200 mb-6 relative">
                      <div className="flex justify-center space-x-6 pt-8 ml-8 sm:mx-4 max-w-full">
                        {["MENUNGGU", "DIPROSES", "DIKIRIM", "SELESAI", "SEMUA"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTabJual(tab as any)}
                            className={`pb-2 text-xs sm:text-lg font-semibold relative whitespace-nowrap ${
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
                    </div>
                    <input
                      type="text"
                      placeholder="Cari ID atau Nama Produk"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded-md mb-4"
                    />
                    {filteredOrders.length === 0 ? (
                      <p className="text-center text-gray-500 mt-4">Tidak ada pesanan di kategori ini.</p>
                    ) : (
                      <div className="space-y-6">
                        {filteredOrders.map((order) => (
                          <div 
                            key={order.id} 
                            className="border p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg bg-white flex flex-col justify-between w-full"
                          >
                            {/* Header Pesanan */}
                            <div>
                              <div className="flex justify-between items-center mb-3 border-b pb-3">
                                <p className="text-gray-700 font-bold flex text-xs sm:text-sm"><FaShoppingBag className="text-sm" />&nbsp;Belanja | {order.date}</p>
                                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {isMobile ? order.status.split(" ")[0] : order.status }
                                </span>
                              </div>

                              {/* Daftar Barang */}
                              <div className="space-y-3">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                    <div className="flex flex-col">
                                      <p className="text-sm sm:text-base font-medium">{item.name}</p>
                                      <p className="text-gray-500 text-xs sm:text-sm">{item.quantity} x Rp{item.price.toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Total & Tombol (Tetap di Bawah) */}
                            <div className="mt-4 text-right border-t pt-1">
                              <p className="font-semibold text-sm sm:text-base">
                                Total Pesanan: <span className="text-lg font-bold text-[#7f0353]">Rp {order.total.toLocaleString()}</span>
                              </p>
                              <button className="bg-[#7f0353] text-white h-[40px] mt-3 rounded-lg w-full sm:w-[180px] text-sm font-semibold transition duration-300 hover:bg-[#9a0465] active:scale-95">
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
