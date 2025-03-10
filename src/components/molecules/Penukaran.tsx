import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserSwitchOutlined, MessageOutlined, ShopOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { notification, Button, Form, Input, Checkbox, Modal } from "antd";
import productData from "../../pseudo-db/product.json";
import usersData from "../../pseudo-db/users.json";
import useIsMobile from "../hooks/useMobile";
interface Product {
    productID: string;
    userID: number;
    name: string;
    images: string[]; // Menggunakan array
    price: number;
    merk: string;
    condition: string;
    category: string[];
    color?: string;
    bisaTukar: boolean;
    dikirimDari: string;
    size: string;
    description: string;
    status: number;
  }

  interface UserProps {
    id: number;
    nama: string;
    email: string;
    telepon: string;
    alamat: { id: number; label: string; detail: string }[];
    fotoProfil?: string;
  }
  
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

const Penukaran = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("../assets/img/produk/dummy.jpg");
  const isMobile = useIsMobile();
  useEffect(() => {
    if (selectedProduct?.images[0] && !selectedProduct.images[0].startsWith("blob:")) {
        setMainImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const currentUser: User = JSON.parse(storedUser);
        const foundUser = usersData.find((u) => u.id === currentUser.id) || null;
  
        if (foundUser) {
          // Ambil daftar produk milik user dari JSON
          let userProducts = productData.filter((product) => product.userID === foundUser.id);
  
          // Ambil daftar produk tambahan dari localStorage
          const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
          const userAdditionalProducts = additionalProducts.filter((product: Product) => product.userID === foundUser.id);
  
          // Ambil daftar produk yang dihapus
          const deletedProducts = JSON.parse(localStorage.getItem("productDeleted") || "[]");
          const deletedProductIDs = new Set(deletedProducts.map((item: { productId: string }) => item.productId));
  
          // Ambil daftar produk yang diperbarui
          const updatedProducts = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
          const updatedProductMap = new Map(updatedProducts.map((product: Product) => [product.productID, product]));
  
          // Ambil daftar produk yang sudah terjual dari `orders`
          const orders = JSON.parse(localStorage.getItem("orders") || "[]");
          const soldProductIDs = new Set(
            orders.flatMap((order: any) =>
              order.orders.flatMap((o: any) => o.products.map((p: any) => p.productID))
            )
          );
  
          // Filter produk agar:
          // - Tidak termasuk yang dihapus
          // - Tidak termasuk yang sudah terjual
          // - Menggunakan versi terbaru jika ada
          const filteredProducts = [...userProducts, ...userAdditionalProducts]
            .filter(product => 
              !deletedProductIDs.has(product.productID) && 
              !soldProductIDs.has(product.productID)
            )
            .map(product => updatedProductMap.get(product.productID) || product); // Gunakan versi terbaru jika ada
  
          setUserProducts(filteredProducts);
        }
  
        // Cari produk berdasarkan productId dari parameter
        let foundProduct = productData.find((p) => p.productID === productId) || null;


          if (!foundProduct) {
            const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
            foundProduct = additionalProducts.find((p: Product) => p.productID === productId) || null;
          }
    
          if (foundProduct) {
            // Jika produk ditemukan di additionalProducts, cek apakah ada pembaruan di updatedProducts
            const updatedProducts = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
            const updatedProduct = updatedProducts.find((p: Product) => p.productID === foundProduct?.productID);
    
            if (updatedProduct) {
              // Jika ada pembaruan di updatedProducts, gunakan data yang diperbarui
              foundProduct = updatedProduct;
            }
          }

        setSelectedProduct(foundProduct);
  
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [productId]);
  
  
  const handleSelect = (productID: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productID) ? prev.filter((pid) => pid !== productID) : [...prev, productID]
    );
  };

  const handleSubmit = (values: { note?: string }) => {
    if (selectedProducts.length === 0) {
        notification.error({
            message: "Kesalahan",
            description: "Pilih minimal 1 produk Anda untuk ditukarkan!",
        });
        return;
    }

    Modal.confirm({
        title: "Konfirmasi Pengajuan Tukar",
        icon: <ExclamationCircleOutlined />,
        content: "Apakah Anda yakin ingin mengajukan pertukaran ini?",
        onOk() {
            const exchangeRequests = JSON.parse(localStorage.getItem("exchangeRequests") || "[]");
            const exchangeID = `EX-${Date.now()}`;
            const newRequest = {
                exchangeID,
                requestedProductId: productId,
                requestedProductOwner: selectedProduct?.userID,
                offeredProductIds: selectedProducts,
                offeredBy: currentUser.id,
                status: 1,
                catatanOpsional: values.note || "", 
                waktuPengajuan: new Date().toISOString(),
            };
            localStorage.setItem("exchangeRequests", JSON.stringify([...exchangeRequests, newRequest]));
            notification.success({
                message: "Pengajuan Berhasil",
                description: "Pengajuan tukar berhasil dikirim!",
            });
            if (currentUser.role === 2) {
                navigate(`/MyHistory`);
            } else {
                navigate("/History");
            }
        },
    });
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
      if (currentUser.role === 2) {
        navigate(`/Seller/${sellerID}`);
      } else {
        navigate(`/SellerPage/${sellerID}`);
      }
    }
  }

  if (!selectedProduct) return <p>Produk tidak ditemukan.</p>;

  const seller = usersData.find((user: UserProps) => user.id === selectedProduct.userID);
  
  const alamatDipilih = seller?.alamat.find((a) => a.alamatDipilih);
  selectedProduct.dikirimDari = alamatDipilih ? alamatDipilih.detail : seller?.alamat[0]?.detail || "Alamat tidak tersedia";
  
  

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 py-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
                    <h2 className="flex items-center text-2xl text-[#7f0353]">
                    <UserSwitchOutlined className="w-8 h-8" /> Tukar Produk
                        </h2>
                        </div>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Kiri: Detail Produk */}
              <div className="p-4 w-full lg:w-2/5 border rounded-lg shadow-md">
                <div className="border p-2 rounded-md mb-4">
                  {/* Gambar Utama */}
                  <img
                    src={mainImage.startsWith("data:image/") ? mainImage : `../${mainImage}`}
                    alt={selectedProduct.name}
                    className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg shadow-md"
                    onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
                  />

                  {/* Daftar Gambar */}
                  <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {selectedProduct.images.length > 0 ? (
                      selectedProduct.images.map((img, index) => {
                        const isValidImage = img && (!img.startsWith("blob:") || img.startsWith("data:image/"));
                        const displayedImage = isValidImage ? (img.startsWith("data:image/") ? img : `../${img}`) : "../assets/img/produk/dummy.jpg";

                        return (
                          <img
                            key={index}
                            src={displayedImage}
                            alt={`${selectedProduct.name} - ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition ${
                              mainImage === img ? "border-[#7f0353] opacity-100" : "border-gray-300 opacity-70 hover:opacity-100"
                            }`}
                            onClick={() => setMainImage(isValidImage ? img : "../assets/img/produk/dummy.jpg")}
                            onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
                          />
                        );
                      })
                    ) : (
                      <img
                        src="../assets/img/produk/dummy.jpg"
                        alt="Gambar tidak tersedia"
                        className="w-16 h-16 object-cover rounded-md border-2 border-gray-300"
                      />
                    )}
                  </div>

                  {/* Info Produk */}
                  <h1 className="text-lg sm:text-2xl font-bold mt-4">{selectedProduct.merk} {selectedProduct.name}</h1>
                  <p className="text-gray-700 text-xs sm:text-sm">Kategori: {selectedProduct.category.join(", ")}</p>
                  <p className="text-gray-700 text-xs sm:text-sm">Ukuran: {selectedProduct.size}</p>
                  <p className="text-gray-700 text-xs sm:text-sm">Kondisi: {selectedProduct.condition}</p>
                  <p className="text-lg font-bold text-[#7f0353]">Rp {selectedProduct.price.toLocaleString("id-ID")}</p>

                  {/* Deskripsi */}
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <h3 className="font-semibold">Deskripsi Produk</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                  </div>

                  {/* Info Penjual */}
                  {seller && (
          <div className="mt-6 py-4 border-t border-gray-300" onClick={() => goToSellerPage(seller.id)}>
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
                 
                      <div className="flex justify-center space-x-4 mt-6 mb-6 align-middle">
                        <button className="bg-white text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                          <MessageOutlined /> Chat
                        </button>
                        <button className="bg-white text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
                          <ShopOutlined /> Toko Pengguna
                        </button>
                      </div>
                     
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
                </div>
              </div>

              {/* Kanan: Pilih Barang untuk Ditukar */}
              <div className="p-4 w-full lg:w-3/5 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pilih Barang untuk Ditukar</h3>
              <div>
              <Form onFinish={handleSubmit} layout="vertical">
                {/* Pilihan Produk */}
                <Form.Item>
                    <div className="grid grid-cols-1 gap-2">
                        {userProducts.map((p) => (
                            <label
                                key={p.productID}
                                className={`border p-2 sm:rounded-md cursor-pointer flex items-center transition-all ${
                                    selectedProducts.includes(p.productID) ? "border-[#7f0353] bg-pink-100" : "hover:border-blue-300"
                                }`}
                            >
                                <Checkbox
                                    value={p.productID}
                                    checked={selectedProducts.includes(p.productID)}
                                    onChange={() => handleSelect(p.productID)}
                                    className="mr-2"
                                />
                                <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-md mr-2"  onError={(e) => {
                                  const fallbackSrc = "../" + p.images[0];
                                  if (e.currentTarget.src !== fallbackSrc) {
                                    e.currentTarget.src = fallbackSrc;
                                  } else {
                                    e.currentTarget.src = "../assets/img/produk/dummy.jpg"
                                  }
                                }} />
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold">{p.name}</p>
                                    <p className="text-sm text-gray-600">Rp {p.price.toLocaleString("id-ID")}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </Form.Item>

                {/* Catatan Tambahan */}
                <Form.Item name="note" label="Catatan Tambahan (Opsional)">
                    <Input.TextArea placeholder="Tambahkan catatan jika diperlukan..." rows={2} />
                </Form.Item>


                {/* Tombol Submit */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full bg-[#7f0353] text-white">
                        Ajukan Tukar
                    </Button>
                </Form.Item>
            </Form>

              </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Penukaran;
