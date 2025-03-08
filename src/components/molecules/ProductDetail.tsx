import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification, Button, Modal, Radio, Input, Form } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ShareAltOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";
import productsData from "../../pseudo-db/product.json";
import usersData from "../../pseudo-db/users.json";
import EditProductModal from "./EditProductModal";
import useIsMobile from "../hooks/useMobile";
import ProductCard from "../atoms/ProductCardForRecommendation";

interface Order {
  id: string;
  date: string;
  items: { productID: string; name: string; price: number; quantity: number; image: string, statusText: string, seller: string, isRequestedProduct?: boolean }[];
  total: number;
  status: "Menunggu Konfirmasi" | "Diproses" | "Dikirim" | "Selesai";
  productOwner?: string;
}

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

interface UserProps {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  alamat: { id: number; label: string; detail: string }[];
  fotoProfil?: string;
}

interface BuyerInfo {
  nama: string;
  fotoProfil?: string;
  email: string;
  alamat: { id: number; label: string; detail: string }[];
  telepon: string;
}

const ProductDetail = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [otherReason, setOtherReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("Telah terjual");
  const [isOrdered, setIsOrdered] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
  const currentUser = localStorage.getItem("currentUser");
  const parsedUser = currentUser ? JSON.parse(currentUser) : null;
  const currentUserID = parsedUser?.id;
  const [similarProducts, setSimilarProducts] = useState<ProductProps[]>([]);
  const { productId } = useParams();
  const navigate = useNavigate();
  const products: ProductProps[] = (productsData as unknown as ProductProps[]).map((p) => ({
    ...p,
    images: p.images || [],
    description: p.description || "",
    media: p.media || [],
  }));
  const isMobile = useIsMobile();

  const handleDelete = () => {
    setIsModalVisible(true);
  };

  const goToSellerPage = (sellerID: number) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser) {
      notification.error({
        message: "Mohon maaf!",
        description: "Silakan Login terlebih dahulu!",
      });
      navigate("/login");
    } else {
      if(!isOwner){
        if (currentUser.role === 2) {
          navigate(`/Seller/${sellerID}`);
        } else {
          navigate(`/SellerPage/${sellerID}`);
        }
      }
    }
  }

  useEffect(() => {
    if (!productId) return;
  
    // Ambil data orders dari LocalStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  
    for (const order of storedOrders) {
      for (const orderDetail of order.orders) {
        const foundProduct = orderDetail.products.find((p: { productID: string }) => p.productID === productId);
        
        if (foundProduct) {
          setIsOrdered(true);
          const foundBuyer = usersData.find((user) => user.id === order.userID);
          
          if (foundBuyer) { // Pastikan foundBuyer tidak undefined
            setBuyerInfo({
              nama: foundBuyer.nama,
              fotoProfil: foundBuyer.fotoProfil || "", // Hindari nilai undefined
              email: foundBuyer.email,
              telepon: foundBuyer.telepon,
              alamat: foundBuyer.alamat || [], // Pastikan alamat ada
            });
          } else {
            console.warn("Pembeli tidak ditemukan untuk userID:", orderDetail.userID);
          }
    
          return; 
        }
      }
    }
    
  
    setIsOrdered(false);
    setBuyerInfo(null);
  }, [productId]);

  const confirmDelete = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const deletedProducts = JSON.parse(localStorage.getItem("productDeleted") || "[]");
    const updatedDeletedProducts = [...deletedProducts, { productId: product?.productID, reason: deleteReason === "Alasan lain" ? otherReason : deleteReason }];
    localStorage.setItem("productDeleted", JSON.stringify(updatedDeletedProducts));
    setIsModalVisible(false);
    notification.success({ message: "Selamat", description: "Produk berhasil dihapus." });
    if (currentUser.role === 2) {
      navigate(`/MyPage`);
    } else {
      navigate('/UserPage'); 
    }
  };

  const handleEdit = () => {
    if (!product) return; // Pastikan `product` terdefinisi sebelum mengakses propertinya
  
    editForm.setFieldsValue({
      name: product.name,
      price: product.price,
      merk: product.merk,
    });
    setIsEditModalVisible(true);
  };

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
  
  const getDefaultMedia = () => {
    // Gabungkan images dan media menjadi satu array
    const allMedia = [
      ...(product?.images || []), 
      ...(product?.media?.map(m => m.url) || [])
    ];
  
    if (!allMedia.length) {
      return "../assets/img/produk/dummy.jpg"; // Jika kosong, pakai dummy image
    }
  
    // Cek apakah ada video di daftar media
    const video = allMedia.find(media => media.startsWith("data:video/"));
  
    return video || allMedia[0]; // Prioritas video, jika tidak ada pakai media pertama
  };
  
  // State utama untuk menampilkan gambar/video
  const [mainImage, setMainImage] = useState(() => 
    getDefaultMedia().startsWith("blob:") ? "../assets/img/produk/dummy.jpg" : getDefaultMedia()
  );
  
  

  if (!product) {
    return <p className="text-center text-gray-500">Produk tidak ditemukan.</p>;
  }

  const seller = usersData.find((user: UserProps) => user.id === product.userID);
  const isOwner = product.userID === currentUserID;
  
  const alamatDipilih = seller?.alamat.find((a) => a.alamatDipilih);
  product.dikirimDari = alamatDipilih ? alamatDipilih.detail : seller?.alamat[0]?.detail || "Alamat tidak tersedia";


  const handleChat = () => {
      if (!currentUser) {
        notification.error({
          message: "Mohon maaf!",
          description: "Silakan Login terlebih dahulu!",
        });
        navigate("/login");
      } else {
        //nothing
      }
  };

  const handleAddToCart = (product: ProductProps) => {
    if (!currentUser) {
      notification.error({
        message: "Mohon maaf!",
        description: "Silakan Login terlebih dahulu!",
      });
      navigate("/login");
      return;
    }

    const parsedUser = typeof currentUser === "string" ? JSON.parse(currentUser) : currentUser;

    const currentUserID = parsedUser?.id;

    if (!currentUserID) {
      notification.error({
        message: "Kesalahan!",
        description: "User tidak memiliki ID yang valid.",
      });
      return;
    }

    // Ambil data keranjang dari Local Storage
    let cartData = JSON.parse(localStorage.getItem("cartData") || "{}");

    // Jika user belum memiliki keranjang, buat array kosong
    if (!cartData[currentUserID]) {
      cartData[currentUserID] = [];
    }

    // Ambil keranjang user yang sedang login
    let userCart = cartData[currentUserID];

    // Cek apakah produk sudah ada di keranjang user
    if (userCart.some((p: ProductProps) => p.productID === product.productID)) {
      notification.warning({
        message: "Produk sudah ada di keranjang!",
        description: `${product.name} sudah ada dalam keranjang.`,
      });
      return;
    }

    // Tambahkan produk ke dalam keranjang user
    userCart.push(product);
    cartData[currentUserID] = userCart; 

    // Simpan kembali ke Local Storage
    localStorage.setItem("cartData", JSON.stringify(cartData));
    window.dispatchEvent(new Event("cartUpdated"));

    // Notifikasi sukses
    notification.success({
      message: "Berhasil menambahkan produk!",
      description: (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
              <img 
                  src={product.images?.[0].startsWith("data:image/") ? product.images?.[0] : `../${product.images?.[0]}`}
                  alt={product.name} 
                  style={{ width: 50, height: 50, borderRadius: 8 }} 
              />
              <span>{product.name} telah ditambahkan ke keranjang.</span>
          </div>
      ),
  });
  
};


const handleBeliLangsung = () => {
  if (!currentUser) {
    notification.error({
      message: "Mohon maaf!",
      description: "Silakan Login terlebih dahulu!",
    });
    navigate("/login");
  } else {
    //nothing
  }
};

const handleAjukanTukar = () => {
  if (!currentUser) {
    notification.error({
      message: "Mohon maaf!",
      description: "Silakan Login terlebih dahulu!",
    });
    navigate("/login");
  } else {
    const userNow = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (userNow.role === 2) {
      navigate(`/Exchange/${productId}`);
    } else {
      navigate(`/ExchangeProduct/${productId}`);
    }
  }
};

  const handleWishlist = () => {
      if (!currentUser) {
        notification.error({
          message: "Mohon maaf!",
          description: "Silakan Login terlebih dahulu!",
        });
        navigate("/login");
      } else {
        //nothing
      }
  };

  const handleShare = () => {
    if (!currentUser) {
      notification.error({
        message: "Mohon maaf!",
        description: "Silakan Login terlebih dahulu!",
      });
      navigate("/login");
    } else {
      //nothing
    }
  };

  const handleReport = () => {
    if (!currentUser) {
      notification.error({
        message: "Mohon maaf!",
        description: "Silakan Login terlebih dahulu!",
      });
      navigate("/login");
    } else {
      //nothing
    }
};

useEffect(() => {
  if (!productId) return;

  // Cari produk yang sedang dibahas di products terlebih dahulu
  let product = products.find((p) => p.productID === productId);

  // Jika produk tidak ditemukan di products, cari di additionalProducts
  if (!product) {
    const additionalProducts: ProductProps[] = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
    product = additionalProducts.find((p) => p.productID === productId);

    // Jika produk ditemukan di additionalProducts, cek apakah ada pembaruan di updatedProducts
    if (product) {
      const updatedProducts: ProductProps[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
      const updatedProduct = updatedProducts.find((p) => p.productID === productId);

      // Jika produk ada di updatedProducts, gunakan yang terbaru
      if (updatedProduct) {
        product = updatedProduct;
      }
    }
  }

  // Jika produk masih belum ditemukan, keluar dari fungsi
  if (!product) return;

  // Ambil kategori dari produk yang sedang dibahas
  const productCategories = product.category;

  // Ambil data orders dari LocalStorage
  const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");

  // Ambil daftar ID produk yang sudah dibeli
  const purchasedProductIDs = new Set(
    (orders || []).flatMap((order: Order) => 
      (order.items || []).flatMap((item) =>
        item.productID ? item.productID : []
      )
    )
  );

  // Ambil produk tambahan dan yang diperbarui dari LocalStorage
  const additionalProducts: ProductProps[] = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
  const updatedProducts: ProductProps[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");

  // Memetakan ID produk ke produk terbaru (jika ada pembaruan)
  const updatedProductMap = new Map(updatedProducts.map((p) => [p.productID, p]));

  // Ambil data produk yang sudah dihapus
  const deletedProducts: { productId: string }[] = JSON.parse(localStorage.getItem("productDeleted") || "[]");
  const deletedProductIDs = new Set(deletedProducts.map((item) => item.productId));

  // Gabungkan produk dari produk utama (product), produk tambahan (additionalProducts), dan produk yang diperbarui (updatedProducts)
  const combinedProducts = [...products, ...additionalProducts];

  // Filter produk berdasarkan kriteria
  const similarProducts = combinedProducts
    .filter((p: ProductProps) =>
      p.productID !== product.productID && // Pastikan produk yang sama tidak termasuk
      !purchasedProductIDs.has(p.productID) &&
      !deletedProductIDs.has(p.productID) &&
      p.category.some((category) => productCategories.includes(category)) // Cek kategori yang sama
    )
    .map((p: ProductProps) => updatedProductMap.get(p.productID) || p);

  setSimilarProducts(similarProducts); // Menampilkan produk yang memiliki kategori serupa

}, [productId, products]);

  return (
    <section className="flex justify-center pt-20 sm:pt-24 mb-20">
      <div className="bg-white/90 sm:rounded-lg shadow-md border border-gray-400 p-6 space-y-4 w-full max-w-6xl">
        {/* Tombol Back di atas panel */}
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftOutlined />
          <span>Kembali</span>
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Media Produk */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              {isOrdered && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse flex items-center gap-1">
                  <ClockCircleOutlined /> MENUNGGU DIPROSES
                </div>
              )}
              
              {(mainImage.startsWith("data:video/") || 
            mainImage.endsWith(".mp4") || 
            mainImage.endsWith(".webm") || 
            mainImage.endsWith(".ogg")) ? (
              <video
                src={mainImage.startsWith("data:video/") ? mainImage : `../${mainImage}`}
                controls
                autoPlay
                loop
                className="w-full h-auto max-h-[430px] object-cover rounded-lg shadow-md"
              >
                Browser Anda tidak mendukung video tag.
              </video>
            ) : (
              <img
                src={mainImage.startsWith("data:image/") || mainImage.startsWith("blob:") ? mainImage : `../${mainImage}`}
                alt={product.name}
                className="w-full h-auto max-h-[430px] object-cover rounded-lg shadow-md"
                onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
              />
            )}
            </div>
          
           {/* Carousel Thumbnail */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
            {([...product.images, ...(product.media?.map(m => m.url) || [])].length > 0) ? (
              [...product.images, ...(product.media?.map(m => m.url) || [])].map((media, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 cursor-pointer border-2 border-gray-300 rounded-md overflow-hidden"
                  onClick={() => setMainImage(media)}
                >
                  {/* Jika media adalah video */}
                  {media.startsWith("data:video/") || media.endsWith(".mp4") || media.endsWith(".webm") || media.endsWith(".ogg") ? (
                    <>
                      <video
                        src={media.startsWith("data:video/") ? media : `../${media}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Ikon Play */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <PlayCircleOutlined className="text-white text-2xl" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.startsWith("data:image/") || media.startsWith("blob:") ? media : `../${media}`}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
                    />
                  )}
                </div>
              ))
            ) : (
              <img
                src="../assets/img/produk/dummy.jpg"
                alt="Gambar tidak tersedia"
                className="w-16 h-16 object-cover rounded-md border-2 border-gray-300"
              />
            )}
          </div>
          </div>
          {/* Detail Produk */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{product.merk} {product.name}</h1>
            <p className="text-gray-700 text-sm">Kategori: {product.category.join(", ")}</p>
            <p className="text-gray-700 text-sm">Ukuran: {product.size}</p>
            <div className="text-left mb-1">
              <img
                src={`../assets/img/produk/${
                  product.category.some((cat) => /kemeja|kaos/i.test(cat))
                    ? "size-chart.png"
                    : product.category.some((cat) => /sepatu|sandal/i.test(cat))
                    ? "size-chart-sepatu.jpg"
                    : product.category.some((cat) => /celana/i.test(cat))
                    ? "size-chart-celana.jpg"
                    : "size-chart.png" // Default jika tidak ada yang cocok
                }`}
                alt="Size Chart"
                className={`mt-2 transition-all duration-300 cursor-pointer ${
                  isZoomed ? "w-full max-w-lg" : "w-40"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <p className="text-sm text-[#7f0353] mt-1">
                {isZoomed ? "Klik gambar untuk perkecil" : "Klik gambar untuk perbesar"}
              </p>
            </div>
            <p className="text-gray-700 text-sm">Kondisi: {product.condition}</p>
            <div className="flex items-center justify-start mt-1">
            <p className="text-lg font-bold text-[#7f0353] mt-2">Rp {product.price.toLocaleString("id-ID")}</p>
            {product.bisaTukar && (
              <span className="flex items-center gap-1 bg-green-200 ml-4 text-green-800 text-xs font-semibold px-2 py-1 rounded-lg animate-pulse">
                <SwapOutlined className="text-sm" /> Bisa Tukar
              </span>
            )}
            </div>
            <p className="text-gray-700 flex items-center gap-1 mt-2">
              <EnvironmentOutlined /> {product.dikirimDari}
            </p>

            {/* Deskripsi Produk */}
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <h3 className="font-semibold">Deskripsi Produk</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-4 flex gap-2">
              {isOwner ? (
                isOrdered ? (
                  // Jika pemilik produk dan sudah dibeli
                  <Button 
                    type="default" 
                    className="w-full bg-[#7f0353] text-white font-bold py-2 px-4 rounded-lg shadow-lg 
                              hover:bg-pink-800 hover:shadow-xl transition-all duration-100 animate-pulse"
                  >
                    Proses Pesanan
                  </Button>
                ) : (
                  // Jika pemilik produk dan belum dibeli
                  <>
                    <Button onClick={() => handleEdit()} type="primary" className="w-full bg-[#7f0353] flex items-center gap-1">
                      <EditOutlined /> Edit
                    </Button>
                    <Button onClick={() => handleDelete()} type="default" className="w-full border-[#7f0353] text-[#7f0353] flex items-center gap-1">
                      <DeleteOutlined /> Hapus
                    </Button>
                  </>
                )
              ) : (
                // Jika bukan pemilik produk
                <>
                  <Button onClick={() => handleAddToCart(product)} type="primary" className="w-full bg-[#7f0353]">
                    + Keranjang
                  </Button>
                  <Button onClick={() => handleBeliLangsung()} type="default" className="w-full border-[#7f0353] text-[#7f0353]">
                    Beli
                  </Button>
                  {product.bisaTukar && (
                    <Button onClick={() => handleAjukanTukar()} type="default" className="w-full border-green-800 text-green-800">
                      Ajukan Tukar
                    </Button>
                  )}
                </>
              )}
            </div>


            {/* Opsi Tambahan */}
            {isOwner ? (
             <></>
            ) : (
              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <button onClick={() => handleWishlist()} className="flex items-center gap-1"><HeartOutlined /> Wishlist</button>
                <button onClick={() => handleShare()} className="flex items-center gap-1"><ShareAltOutlined /> Share</button>
                <button onClick={() => handleReport()} className="flex items-center gap-1"><WarningOutlined /> Laporkan</button>
              </div>
            )}
            {buyerInfo && (
              <div className="mt-6 p-4 border-t border-gray-300">
                <h3 className="text-lg font-semibold">Informasi Pembeli</h3>
                <div className="flex items-center gap-4 mt-2">
                  <img
                    src={buyerInfo.fotoProfil ? `../${buyerInfo.fotoProfil}` : "../assets/img/fotoProfil/user.png"}
                    onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                    alt={buyerInfo.nama}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{buyerInfo.nama}</p>
                    <p className="text-sm text-gray-600">📞 {buyerInfo.telepon}</p>
                    <p className="text-sm text-gray-600">📍 {buyerInfo.alamat[0]?.detail || "Alamat tidak tersedia"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
         {/* Panel Penjual */}
         {seller && (
          <div className="mt-6 py-4 border-t border-gray-300 border-b" onClick={() => goToSellerPage(seller.id)}>
            <h3 className="text-lg font-semibold">Informasi Penjual</h3>
            <div className="sm:flex items-center gap-4 mt-2">
              <div className="flex gap-4">
              <img
                src={seller.fotoProfil ? `../${seller.fotoProfil}` : "../assets/img/fotoProfil/user.png"}
                onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                alt={seller.nama}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium">{seller.nama}</p>
                <p className="text-sm text-gray-600">📞 {seller.telepon}</p>
                <p className="text-sm text-gray-600">📍 {seller.alamat[0]?.detail || "Alamat tidak tersedia"}</p>
              </div>
              </div>
              {isMobile ? (
                <>
                  <div className="ml-auto flex flex-col gap-2">
                  {isOwner ? (
                    <></>
                    ) : (
                      <>
                      <div className="flex justify-center space-x-4 mt-6 mb-6 align-middle">
                        <button className="bg-white text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                          <MessageOutlined /> Chat
                        </button>
                        <button className="bg-white text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                          <ShopOutlined /> Toko Pengguna
                        </button>
                      </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
              <div className="ml-auto flex flex-col gap-2">
              {isOwner ? (
                <></>
                ) : (
                  <>
                  <Button onClick={() => handleChat()} type="primary" className="bg-[#5c595f] flex items-center gap-1">
                   <MessageOutlined /> Chat dengan Penjual
                    </Button>
                    <Button
                      type="default"
                      className="border-gray-400 text-gray-700 flex items-center gap-1"
                    >
                      <ShopOutlined /> Kunjungi Halaman Pengguna
                    </Button>
                  </>
                )}
              </div>
              )}
            </div>
          </div>
        )}
         <div className="flex justify-center border-b-2 border-gray-200 mb-4 relative">
          <div className="py-4 w-full">
            <h3 className="text-xl font-semibold mb-4">Produk Serupa</h3>
            {similarProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarProducts.map((product) => (
                  <div
                    key={product.productID}
                    className="transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 w-full">
                Tidak ada produk dalam kategori ini.
              </p>
            )}
          </div>
        </div>
        <Modal
        title={[
                  <div className="flex gap-2 mb-5 pb-4 border-b">
                    <DeleteOutlined className="text-[#7f0353] text-lg h-6 w-6" />
                    <span>Hapus produk</span>
                  </div>
                ]}
        visible={isModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Hapus"
        cancelText="Batal"
      >
        <p>Apakah Anda yakin ingin menghapus produk ini?</p>
        <Radio.Group onChange={(e) => setDeleteReason(e.target.value)} value={deleteReason} className="mt-3 flex flex-col gap-2">
          <Radio value="Telah terjual">Telah terjual</Radio>
          <Radio value="Tidak jadi dijual">Tidak jadi dijual</Radio>
          <Radio value="Alasan lain">Alasan lain</Radio>
        </Radio.Group>
        {deleteReason === "Alasan lain" && <Input.TextArea className="mt-3" placeholder="Masukkan alasan" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />}
      </Modal>
      <EditProductModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        product={product}
      />
      </div>
    </section>
  );
};

export default ProductDetail;
