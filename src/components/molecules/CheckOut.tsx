import { useEffect, useState } from "react";
import AddressPanel from "../atoms/AddressPanel";
import { Button, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ShoppingOutlined, CheckCircleOutlined, TruckOutlined } from "@ant-design/icons";
import VoucherPanel from "../atoms/VoucherPanel";
import PaymentPanel from "../atoms/BankPanel";
import sellersData from "../../pseudo-db/users.json";
import shippingOptions from "../../pseudo-db/shipping.json";


interface ProductProps {
  productID: string;
  userID: number;
  name: string;
  images: string[];
  color: string;
  size: string;
  condition: string;
  merk: string;
  price: number;
}

interface SellerProps {
  id: number;
  nama: string;
  fotoProfil: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimated_delivery: string;
  guarantee: string;
  icon?: string;
}

const Checkout = () => {
  const [checkoutItems, setCheckoutItems] = useState<ProductProps[]>([]);
  const [groupedItems, setGroupedItems] = useState<Record<number, { seller: SellerProps | null; products: ProductProps[], shipping: ShippingOption, note: string }>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<number | null>(null);
  const [tempShipping, setTempShipping] = useState<ShippingOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [totalShippingPrice, setTotalShippingPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userID = currentUser?.id;

    if (!userID) {
      notification.error({ message: "Kesalahan", description: "User tidak valid atau belum login." });
      navigate("/cart");
      return;
    }

    const storedData = JSON.parse(localStorage.getItem("checkoutData") || "{}");

    if (!storedData[userID] || storedData[userID].length === 0) {
      if (!checkoutCompleted) { 
        
      }
      return;
    }

    const checkoutList = storedData[userID];
    setCheckoutItems(checkoutList);

    const grouped = checkoutList.reduce((acc: any, product: ProductProps) => {
      if (!acc[product.userID]) {
        acc[product.userID] = {
          seller: sellersData.find((user) => user.id === product.userID),
          products: [],
          shipping: groupedItems[product.userID]?.shipping || shippingOptions.shipping_options[0],
          note: ""
        };
      }
      acc[product.userID].products.push(product);
      return acc;
    }, {});

    setGroupedItems(grouped);

    const totalProductPrice = checkoutList.reduce((sum: number, item: ProductProps) => sum + item.price, 0);
    const totalShipping = Object.values(grouped).reduce((sum: number, entry) => {
      const shipping = (entry as { shipping: ShippingOption }).shipping;
      return sum + shipping.price;
    }, 0);
    

    
    // Hitung diskon berdasarkan voucher yang dipilih
    const discount = selectedVoucher 
      ? (selectedVoucher.tipe === "persen" 
        ? (totalProductPrice * selectedVoucher.potongan) / 100 
        : selectedVoucher.potongan) 
      : 0;

    setTotalPrice(totalProductPrice);
    setTotalShippingPrice(totalShipping);
    setTotalDiscount(discount);
    setGrandTotal(totalProductPrice + totalShipping - discount);
  }, [navigate, selectedVoucher, groupedItems]);

  const handleOpenModal = (sellerId: number) => {
    setCurrentSeller(sellerId);
    setTempShipping(groupedItems[sellerId]?.shipping || null);
    setIsModalOpen(true);
  };

  const handleSelectShipping = (option: ShippingOption) => {
    setTempShipping(option);
  };

  const handleConfirmShipping = () => {
    if (currentSeller !== null && tempShipping) {
      setGroupedItems((prev) => ({
        ...prev,
        [currentSeller]: { ...prev[currentSeller], shipping: tempShipping }
      }));
    }
    setIsModalOpen(false);
  };

  const generateOrderID = () => {
    const timestamp = Date.now().toString(); // Timestamp sekarang dalam string
    const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 karakter acak
    return `${timestamp}${randomChars}`;
  };
  
  const handleBuatPesanan = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}") as {
      id?: number;
      alamat?: { id: number; label: string; detail: string; alamatDipilih?: boolean }[];
      role?: number;
    };
    
    const userID = currentUser?.id;
  
    const selectedAddr =
      selectedAddress || currentUser?.alamat?.find((addr: { alamatDipilih?: boolean }) => addr.alamatDipilih) || null;
  
    if (!selectedAddr) {
      notification.error({ message: "Kesalahan", description: "Silakan pilih alamat pengiriman." });
      return;
    }
  
    if (!selectedPayment) {
      notification.error({ message: "Kesalahan", description: "Silakan pilih metode pembayaran." });
      return;
    }
  
    if (!userID) {
      notification.error({ message: "Kesalahan", description: "User tidak valid atau belum login." });
      return;
    }
  
    // Buat orderID dengan timestamp + 2 karakter acak
    const orderID = generateOrderID();
  
    const orderData = {
      orderID, // Tambahkan orderID ke data pesanan
      userID,
      orders: Object.entries(groupedItems).map(([sellerId, { seller, products, shipping, note }]) => ({
        sellerId,
        seller,
        products,
        shipping,
        note,
      })),
      selectedAddress,
      selectedPayment,
      totalPrice,
      totalShippingPrice,
      totalDiscount,
      grandTotal: grandTotal + 1000, // Termasuk biaya layanan
      orderDate: new Date().toISOString(),
    };
    // Simpan pesanan ke localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
  
    // Hapus data checkout setelah pesanan dibuat
    const storedData = JSON.parse(localStorage.getItem("checkoutData") || "{}");
    delete storedData[userID];
    localStorage.setItem("checkoutData", JSON.stringify(storedData));
  
    // Hapus item dari cartData
    let cartData = JSON.parse(localStorage.getItem("cartData") || "{}");
    if (cartData[userID]) {
      const checkedOutProductIDs = orderData.orders.flatMap(order => order.products.map(p => p.productID));
      cartData[userID] = cartData[userID].filter((item: ProductProps) => !checkedOutProductIDs.includes(item.productID));
  
      localStorage.setItem("cartData", JSON.stringify(cartData));
    }
  
    notification.success({ message: "Pesanan Berhasil", description: "Pesananmu telah dibuat!" });
  
    setCheckoutCompleted(true);
    if (currentUser.role === 2) {
      navigate(`/PaymentProduct/${orderID}`);
    } else {
      navigate(`/Payment/${orderID}`);
    }
  };
  
  

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 pb-20 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
        <div className="flex flex-col sm:flex-row mb-6 items-center justify-between border-b-2 border-gray-300 pb-3">
         <h2 className="flex items-center text-2xl text-[#7f0353]">
            <ShoppingOutlined />&nbsp;Checkout
          </h2>
          </div>
          <AddressPanel />
  
          {Object.entries(groupedItems).map(([sellerId, { seller, products, shipping }]) => {
            const totalProductPrice = products.reduce((sum, product) => sum + product.price, 0);
            const totalPrice = totalProductPrice + shipping.price;
  
            return (
              <div key={sellerId} className="mb-8 border border-gray-300 rounded-lg p-4">
                {/* Informasi Penjual */}
                <div className="bg-gray-200 p-4 rounded font-bold flex items-center gap-3">
                  <img
                    src={seller?.fotoProfil || "../assets/img/fotoProfil/user.png"}
                    alt={seller?.nama || "Penjual Tidak Diketahui"}
                    className="w-6 h-6 rounded-full object-cover border"
                    onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                  />
                  <span className="text-sm">{seller ? seller.nama : "Penjual tidak ditemukan"}</span>
                </div>
  
                {products.map((product) => (
                  <div key={product.productID} className="flex gap-2 sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-center border-b p-4 w-full">
                    {/* Gambar Produk */}
                    <img
                      src={product.images?.[0].startsWith("data:image/") ? product.images?.[0] : `../${product.images?.[0]}`}
                      alt={product.name}
                      className="w-20 h-20 rounded object-cover cursor-pointer hover:opacity-80 transition"
                      onClick={() => navigate("/ProductDetail/" + product.productID)}
                    />
                    {/* Detail Produk */}
                    <div className="col-span-3 flex flex-col gap-1 text-sm md:col-span-3">
                        <span className="font-semibold">
                          {product.merk} {product.name}
                        </span>
                        <span className="text-black">
                          Ukuran {product.size}, Kondisi {product.condition}
                        </span>
                        <span className="font-bold text-base flex">
                          Rp {product.price.toLocaleString()}
                        </span>
                      </div>
                  </div>
                ))}
  
                {/* Opsi Pengiriman & Catatan */}
                <div className="p-4 flex flex-col md:flex-row justify-between gap-6">
                  {/* Catatan kepada Penjual */}
                  <div className="w-full md:w-2/5">
                    <label htmlFor="note" className="font-bold">Catatan kepada Penjual</label>
                    <textarea
                      id="note"
                      className="w-full p-2 border border-gray-300 rounded mt-2 min-h-[50px] rounded-[5px] focus:border-[#7f0353] focus:ring-2 focus:ring-[#7f0353] transition"
                      placeholder="Tambahkan catatan untuk penjual..."
                    ></textarea>
                  </div>
  
                  {/* Opsi Pengiriman */}
                  <div className="border-5w-full md:w-3/5">
                    <button
                      className="text-black font-bold hover:text-[#7f0353] transition"
                      onClick={() => handleOpenModal(Number(sellerId))}
                    >
                      Opsi Pengiriman
                    </button>
                    <p className="text-md mt-1">
                      {shipping.name} - <button className="text-[#7f0353]" onClick={() => handleOpenModal(Number(sellerId))}>Ubah</button> 
                      <span className="float-right font-bold">Rp {shipping.price.toLocaleString()}</span>
                    </p>
                    <p className={`text-sm mt-1 ${shipping.name.toLowerCase().includes("instant") ? "text-green-600" : "text-[#5c595f]"}`}>
                      Garansi Tiba: {shipping.name.toLowerCase().includes("reguler")
                        ? (() => {
                            const today = new Date();
                            const minDate = new Date(today);
                            minDate.setDate(today.getDate() + 2);
                            const maxDate = new Date(today);
                            maxDate.setDate(today.getDate() + 3);
                            const formattedMinDate = `${minDate.getDate()}`;
                            const formattedMaxDate = `${maxDate.getDate()}`;
                            const formattedMonth = `${maxDate.toLocaleString("id-ID", { month: "long" })}`;
                            return `${formattedMinDate} - ${formattedMaxDate} ${formattedMonth}`;
                          })()
                        : shipping.guarantee}
                    </p>
                  </div>
                </div>
  
                {/* Total Harga */}
                <div className="p-6 flex justify-end border-t">
                  <p className="text-md">Total Harga: 
                    <span className="font-bold text-[#7f0353] text-lg ml-4">
                      Rp {totalPrice.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
  
          <VoucherPanel setSelectedVoucher={setSelectedVoucher} />
          <PaymentPanel selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />
  
          {/* Ringkasan Pembayaran */}
          <div className="text-right space-y-2 w-full md:w-80 ml-auto">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal untuk {checkoutItems.length} Produk</span>
              <span className="font-medium">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal Pengiriman</span>
              <span className="font-medium">Rp {totalShippingPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Biaya Layanan</span>
              <span className="font-medium">Rp 1.000</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-500">
                <span>Total Diskon</span>
                <span>-Rp {totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="text-[#7f0353]">Rp {(grandTotal + 1000).toLocaleString()}</span>
            </div>
          </div>
  
          {/* Tombol Buat Pesanan */}
          <div className="border-t mt-5">
            <Button 
              type="primary"
              onClick={handleBuatPesanan}
              className="bg-[#7f0353] w-full mt-5 md:w-[250px] h-[40px] float-right hover:bg-[#650243] transition"
            >
              <ShoppingOutlined /> Buat Pesanan
            </Button>
          </div>
        </div>
      </div>
    </div>
  <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleConfirmShipping}
            title={
              <div className="mb-5">
              <span className="text-[#7f0353] font-bold mb-5">
                <TruckOutlined className="text-xl mr-2" />
                Pilih Opsi Pengiriman
              </span>
              <p className="text-sm mt-2">
                Garansi tiba tepat waktu
              </p>
              </div>
            }
            bodyStyle={{
              maxHeight: "50vh",
              overflowY: "hidden",
              display: "flex",
              flexDirection: "column",
            }} 
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>,
              <Button
                key="ok"
                type="primary"
                onClick={handleConfirmShipping}
                style={{ backgroundColor: "#7f0353", borderColor: "#7f0353" }} 
              >
                Konfirmasi
              </Button>,
            ]}
          >
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}> {/* Scroll hanya di sini */}
            {shippingOptions.shipping_options.map((option) => (
              <div
                key={option.id}
                className={`p-6 border-b flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                  tempShipping?.id === option.id ? "bg-gray-200 font-bold" : ""
                }`}
                onClick={() => handleSelectShipping(option)}
              >
                <div>
                  <p className="font-bold">
                    {option.name} - Rp {option.price.toLocaleString()}
                  </p>
                  <p
                    className={`${
                      option.name.toLowerCase().includes("instant")
                        ? "text-green-600"
                        : "text-black"
                    } text-sm`}
                  >
                    Garansi tiba:{" "}
                    {option.name.toLowerCase().includes("reguler")
                      ? (() => {
                          const today = new Date();
                          const minDate = new Date(today);
                          minDate.setDate(today.getDate() + 2); // Tambah 2 hari
                          const maxDate = new Date(today);
                          maxDate.setDate(today.getDate() + 3); // Tambah 3 hari
  
                          const formattedMinDate = `${minDate.getDate()}`;
                          const formattedMaxDate = `${maxDate.getDate()}`;
                          const formattedMonth = `${maxDate.toLocaleString("id-ID", { month: "long" })}`;
  
                          return `${formattedMinDate} - ${formattedMaxDate} ${formattedMonth}`;
                        })()
                      : option.guarantee}
                  </p>
                </div>
  
                {tempShipping?.id === option.id && (
                  <CheckCircleOutlined className="text-green-500 text-xl" />
                )}
              </div>
            ))}
          </div>
        </Modal>
  </section>
  
  );
};

export default Checkout;
