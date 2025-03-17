import { useEffect, useState } from "react";
import { notification, Modal } from "antd";
import { FaShoppingBag } from "react-icons/fa";
import { HistoryOutlined, SafetyOutlined, SendOutlined } from "@ant-design/icons";
import usersData from "../../pseudo-db/users.json";
import productData from "../../pseudo-db/product.json";
import ordersDummyData from "../../pseudo-db/orders-dummy.json";
import useIsMobile from "../hooks/useMobile";
import { useNavigate } from "react-router-dom";


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
  status: number;
  statusText: string;
};

interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; quantity: number; image: string, statusText: string, seller: string, isRequestedProduct?: boolean }[];
  total: number;
  status: "Menunggu Konfirmasi" | "Diproses" | "Dikirim" | "Selesai";
  productOwner?: string;
}

interface Exchange {
  id: string;
  date: string;
  items: any[];
  status: string;
  catatanOpsional: string;
  productOwner: User | null; // Bisa null jika belum ada data
}

const History = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("JUAL");
  const [userProducts, setUserProducts] = useState<Record<number, { buyerName: string; buyerProfilPhoto: string; products: Product[] }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Record<number, Set<string>>>({});
  const [buyerCheckboxes, setBuyerCheckboxes] = useState<Record<number, boolean>>({});
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
// Handler saat checkbox diklik
const handleCheckboxChange = (
  buyerID: number, 
  productID: string, 
  isChecked: boolean
) => {
  setSelectedProducts((prev) => {
    const updated = { ...prev };

    if (!updated[buyerID]) updated[buyerID] = new Set<string>();

    // Ambil data pembeli berdasarkan buyerID
    const buyerProducts = filteredProducts[buyerID].products;

    // Status produk yang sedang dipilih
    const selectedProduct = buyerProducts.find(p => p.productID === productID);
    if (!selectedProduct) return prev;

    // Cek apakah ada produk lain dengan status berbeda yang sudah dipilih
    const selectedStatuses = new Set(
      [...updated[buyerID]].map(id => {
        const p = buyerProducts.find(prod => prod.productID === id);
        return p?.status;
      })
    );

    if (isChecked) {
      // Jika ada status lain yang berbeda, batalkan pilihan
      if (selectedStatuses.size > 0 && !selectedStatuses.has(selectedProduct.status)) {
        notification.error({ message: "Kesalahan", description: "Tidak bisa memilih produk dengan status berbeda!" });
        return prev;
      }
      updated[buyerID].add(productID);
    } else {
      updated[buyerID].delete(productID);
    }

    // Update status checkbox pembeli jika semua produk dipilih
    const allProductsChecked = buyerProducts.every(product => updated[buyerID].has(product.productID));
    setBuyerCheckboxes(prev => ({
      ...prev,
      [buyerID]: allProductsChecked,
    }));

    return updated;
  });
}; 

const seeDetailTransaction = (orderID: String) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (currentUser.role === 2) {
    navigate(`/DetailTransaction/${orderID}`);
  } 
};

const getOrderButtonText = (buyerID: number) => {
  if (!selectedProducts[buyerID] || selectedProducts[buyerID].size === 0) {
    return "Pilih Produk";
  }

  const buyerProducts = filteredProducts[buyerID].products;
  const selectedStatuses = new Set(
    [...selectedProducts[buyerID]].map(id => {
      const product = buyerProducts.find(p => p.productID === id);
      return product?.status;
    })
  );

  if (selectedStatuses.has(1) && selectedStatuses.size === 1) {
    return <span><SafetyOutlined />&nbsp;&nbsp;Proses Pesanan</span>;
  } else if (selectedStatuses.has(2) && selectedStatuses.size === 1) {
    return <span><SendOutlined />&nbsp;&nbsp;Paket Siap Dikirim</span>;
  }

  return "Pilih Produk";
};

const handleBuyerCheckboxChange = (buyerID: number, isChecked: boolean) => {
  setSelectedProducts((prev) => {
    const updated = { ...prev };

    // Pastikan Set sudah ada untuk buyerID
    if (!updated[buyerID]) {
      updated[buyerID] = new Set<string>();
    }

    const buyerData = filteredProducts[buyerID]; // Ambil data pembeli berdasarkan buyerID

    // Ambil semua status produk yang dimiliki buyer
    const productStatuses = new Set(buyerData.products.map((p) => p.status));

    // Jika semua status adalah 1 atau 2, atau ada status 3 tapi mayoritas masih 1/2
    const validStatuses = [1, 2];
    const hasInvalidStatus = [...productStatuses].some((status) => !validStatuses.includes(status));

    if (!hasInvalidStatus || (productStatuses.has(3) && productStatuses.size > 1)) {
      if (isChecked) {
        buyerData.products.forEach((product) => {
          if (validStatuses.includes(product.status)) {
            updated[buyerID].add(product.productID);
          }
        });
      } else {
        updated[buyerID].clear();
      }

      // Update state checkbox pembeli hanya jika produk yang bisa dipilih valid
      setBuyerCheckboxes((prev) => ({
        ...prev,
        [buyerID]: isChecked,
      }));
    } else {
      // Jika ada status yang tidak valid, batalkan perubahan checkbox buyer
      notification.error({ message: "Kesalahan", description: "List Produk memiliki beberapa status yang tidak bisa dipilih!" });
      setBuyerCheckboxes((prev) => ({
        ...prev,
        [buyerID]: false,
      }));
    }

    return updated;
  });
};


// Handler saat tombol "Proses Pesanan" ditekan
const processOrder = (buyerID: number) => {
  const selected = selectedProducts[buyerID] || new Set<string>();

  if (selected.size === 0) {
    notification.error({ message: "Kesalahan", description: "Pilih setidaknya satu produk" });
    return;
  }

  // Cek status produk yang dipilih
  let nextStatusText = "";
  let confirmationMessage = "";

  const ordersString = localStorage.getItem("orders");
  if (!ordersString) {
    notification.error({ message: "Kesalahan", description: "Data pesanan tidak ditemukan." });
    return;
  }

  const orders = JSON.parse(ordersString);
  let foundStatus = 0;

  orders.forEach((order: any) => {
    if (order.userID === buyerID) {
      order.orders.forEach((orderItem: any) => {
        orderItem.products.forEach((product: any) => {
          if (selected.has(product.productID)) {
            if (product.status === 1) {
              foundStatus = 1;
              nextStatusText = "Diproses";
              confirmationMessage = "Yakin ingin memproses barang ini?";
            } else if (product.status === 2) {
              foundStatus = 2;
              nextStatusText = "Dikirim";
              confirmationMessage = "Yakin barang sudah siap dijemput kurir?";
            }
          }
        });
      });
    }
  });

  if (foundStatus === 0) {
    notification.error({ message: "Kesalahan", description: "Produk tidak valid atau sudah dikirim." });
    return;
  }

  // Tampilkan modal sesuai status produk
  Modal.confirm({
    title: confirmationMessage,
    content: `Produk yang dipilih akan berubah status menjadi "${nextStatusText}".`,
    okText: "Ya, Lanjutkan",
    cancelText: "Batal",
    onOk: () => {
      try {
        let updatedOrders = orders.map((order: any) => {
          if (order.userID === buyerID) {
            return {
              ...order,
              orders: order.orders.map((orderItem: any) => ({
                ...orderItem,
                products: orderItem.products.map((product: any) => {
                  if (selected.has(product.productID)) {
                    if (product.status === 1) {
                      return { ...product, status: 2, statusText: "Diproses" };
                    } else if (product.status === 2) {
                      return { ...product, status: 3, statusText: "Dikirim" };
                    }
                  }
                  return product;
                })
              }))
            };
          }
          return order;
        });

        // Simpan perubahan ke LocalStorage
        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        // Perbarui state agar UI berubah tanpa reload
        setSelectedProducts((prev) => ({ ...prev })); // Trigger re-render

        // Jika UI masih tidak berubah, lakukan reload sebagai solusi terakhir
        setTimeout(() => {
          window.location.reload();
        }, 500);

        notification.success({
          message: "Berhasil",
          description: `Pesanan telah berubah status menjadi "${nextStatusText}".`
        });

      } catch (error: any) {
        console.error("Terjadi kesalahan saat memproses pesanan:", error);
        notification.error({ message: "Kesalahan", description: error.message });
      }
    }
  });
};


  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const currentUser: User = JSON.parse(storedUser);
        const foundUser = usersData.find((u) => u.id === currentUser.id) || null;
        setUser(foundUser);
  
        if (foundUser) {
          const ordersData: any[] = JSON.parse(localStorage.getItem("orders") || "[]");
  
          // Filter order yang mengandung produk dari seller ini
          const sellerOrders = ordersData
            .map((order: any) => ({
              buyerID: order.userID, // ID pembeli
              buyerName: usersData.find((u) => u.id === order.userID)?.nama || `Pembeli ${order.userID}`,
              buyerProfilPhoto: usersData.find((u) => u.id === order.userID)?.fotoProfil || `Pembeli ${order.userID}`,
              products: order.orders
                .filter((o: any) => o.seller.id === foundUser.id) // Hanya order dari seller ini
                .flatMap((o: any) =>
                  o.products.map((p: any) => ({
                    ...p,
                    buyerID: order.userID, // Tambahkan buyerID
                    orderID: order.orderID,
                    orderDate: order.orderDate,
                    sellerName: o.seller.nama,
                    statusText:
                    p.status === 1 ? "Menunggu Konfirmasi" :
                    p.status === 2 ? "Diproses" :
                    p.status === 3 ? "Dikirim" :
                    "Selesai",                  
                  }))
                ),
            }))
            .filter((order) => order.products.length > 0); // Hapus order yang kosong
  
          // Kelompokkan berdasarkan buyerID
          const grouped: Record<number, { buyerName: string; buyerProfilPhoto: string; products: Product[] }> = {};
          sellerOrders.forEach((order) => {
            if (!grouped[order.buyerID]) {
              grouped[order.buyerID] = {
                buyerName: order.buyerName,
                buyerProfilPhoto: order.buyerProfilPhoto,
                products: [],
              };
            }
            grouped[order.buyerID].products.push(...order.products);
          });
  
          setUserProducts(grouped); // Pastikan tipe yang diberikan sesuai dengan tipe yang diharapkan
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const filteredProducts = Object.entries(userProducts).reduce(
    (acc, [buyerID, data]) => {
      const filtered = data.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.merk.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      if (filtered.length > 0) {
        acc[Number(buyerID)] = { ...data, products: filtered }; // Konversi buyerID ke number
      }
  
      return acc;
    },
    {} as Record<number, { buyerName: string; buyerProfilPhoto: string; products: Product[] }>
  );  
  
  
  const [orders, setOrders] = useState<Order[]>([]);
    const [activeTabJual, setActiveTabJual] = useState<
      "SEMUA" | "MENUNGGU" | "DIPROSES" | "DIKIRIM" | "SELESAI"
    >("SEMUA");
    const [searchTerm, setSearchTerm] = useState("");
  
    
  
    useEffect(() => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) return;
    
      const parsedUser = JSON.parse(currentUser);
      const currentUserID = parsedUser.id;
    
      const savedOrders = localStorage.getItem("orders");
      let allOrders: any[] = [...ordersDummyData]; // Default ke dummy data
    
      try {
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            allOrders = [...parsedOrders, ...ordersDummyData]; // Gabungkan dengan dummy data
          }
        }
    
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
                status: "Menunggu Konfirmasi",
              };
            }
    
            let productStatuses: number[] = []; // Menyimpan semua status produk
    
            order.orders.forEach((o: any) => {
              const sellerName = o.seller?.nama;
    
              o.products.forEach((product: any) => {
                acc[orderId].items.push({
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images[0],
                  statusText:
                    product.status === 1
                      ? "Menunggu Konfirmasi"
                      : product.status === 2
                      ? "Diproses"
                      : product.status === 3
                      ? "Dikirim"
                      : "Selesai",
                  seller: sellerName,
                });
    
                productStatuses.push(product.status);
              });
            });
    
            // Tentukan status order berdasarkan status produk di dalamnya
            if (productStatuses.includes(1)) {
              acc[orderId].status = "Menunggu Konfirmasi";
            } else if (productStatuses.includes(2)) {
              acc[orderId].status = "Diproses";
            } else if (productStatuses.includes(3)) {
              acc[orderId].status = "Dikirim";
            } else if (productStatuses.every((status) => status === 4)) {
              acc[orderId].status = "Selesai";
            }
    
            return acc;
          }, {});
    
        setOrders(Object.values(userOrders));
      } catch (error) {
        console.error("Error parsing orders:", error);
        setOrders(
          ordersDummyData.map((order) => ({
            id: order.orderID ?? `ORD-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(order.orderDate).toLocaleDateString("id-ID"),
            total: order.grandTotal,
            status: "Menunggu Konfirmasi",
            items: order.orders.flatMap((o) =>
              o.products.map((product) => ({
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.images[0],
                statusText:
                  product.status === 1
                    ? "Menunggu Konfirmasi"
                    : product.status === 2
                    ? "Diproses"
                    : product.status === 3
                    ? "Dikirim"
                    : "Selesai",
                seller: o.seller?.nama,
              }))
            ),
          }))
        );
      }
    }, []);
    

    const filteredExchanges = exchanges
    ?.map((exchange) => {
      // Filter item dalam transaksi berdasarkan status yang dipilih
      const filteredItems = exchange.items.filter((item) => {
        if (activeTabJual === "SEMUA") return true;
        return (
          (activeTabJual === "MENUNGGU" && item.statusText === "Menunggu Konfirmasi") ||
          (activeTabJual === "DIPROSES" && item.statusText === "Diproses") ||
          (activeTabJual === "DIKIRIM" && item.statusText === "Dikirim") ||
          (activeTabJual === "SELESAI" && item.statusText === "Selesai")
        );
      });
  
      // Jika ada item yang cocok, simpan transaksi dengan item yang difilter
      if (filteredItems.length > 0) {
        return { ...exchange, items: filteredItems };
      }
  
      return null; // Jika tidak ada item yang cocok, hapus transaksi ini
    })
    .filter((exchange): exchange is NonNullable<typeof exchange> => exchange !== null) // Hapus transaksi yang null
    .filter((exchange) => {
      // Pastikan hasil filter masih mempertimbangkan pencarian
      return (
        exchange.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exchange.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }) ?? [];
  
  
    const filteredOrders = orders
    ?.map((order) => {
      // Filter item dalam pesanan berdasarkan status yang dipilih
      const filteredItems = order.items.filter((item) => {
        if (activeTabJual === "SEMUA") return true;
        return (
          (activeTabJual === "MENUNGGU" && item.statusText === "Menunggu Konfirmasi") ||
          (activeTabJual === "DIPROSES" && item.statusText === "Diproses") ||
          (activeTabJual === "DIKIRIM" && item.statusText === "Dikirim") ||
          (activeTabJual === "SELESAI" && item.statusText === "Selesai")
        );
      });
  
      // Jika ada item yang cocok, simpan pesanan dengan item yang difilter
      if (filteredItems.length > 0) {
        return { ...order, items: filteredItems };
      }
  
      return null; // Jika tidak ada item yang cocok, hapus pesanan ini
    })
    .filter((order): order is NonNullable<typeof order> => order !== null) // Hapus pesanan yang null
    .filter((order) => {
      // Pastikan hasil filter masih mempertimbangkan pencarian
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }) ?? [];  
  
    useEffect(() => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) return;
    
      const parsedUser = JSON.parse(currentUser);
      const currentUserID = parsedUser.id;
    
      const savedExchanges = localStorage.getItem("exchangeRequests");
      if (!savedExchanges) return;
    
      try {
        const parsedExchanges = JSON.parse(savedExchanges);
        const allExchanges = Array.isArray(parsedExchanges) ? parsedExchanges : [parsedExchanges];
    
        const userExchanges = allExchanges
          .filter(
            (exchange) => exchange.offeredBy === currentUserID || exchange.requestedProductOwner === currentUserID
          )
          .reduce((acc, exchange) => {
            const exchangeId = exchange.exchangeID ?? `EX-${Math.random().toString(36).substr(2, 9)}`;
    
            if (!acc[exchangeId]) {
              acc[exchangeId] = {
                id: exchangeId,
                date: new Date(exchange.waktuPengajuan).toLocaleDateString("id-ID"),
                items: [],
                status: "Menunggu Konfirmasi",
                catatanOpsional: exchange.catatanOpsional || "",
                productOwner: null, // Tambahkan ini untuk menyimpan data pemilik produk
              };
            }
    
            // Cari detail produk yang diminta
            let foundProduct = productData.find((p) => p.productID === exchange.requestedProductId) || null;
    
            if (!foundProduct) {
              const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
              foundProduct = additionalProducts.find((p: Product) => p.productID === exchange.requestedProductId) || null;
            }
    
            if (foundProduct) {
              const updatedProducts = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
              const updatedProduct = updatedProducts.find((p: Product) => p.productID === foundProduct?.productID);
              if (updatedProduct) {
                foundProduct = updatedProduct;
              }
            }
    
            // Masukkan produk yang diminta
            acc[exchangeId].items.push({
              name: foundProduct ? foundProduct.name : "Produk tidak ditemukan",
              image: foundProduct ? foundProduct.images : ["/placeholder.jpg"],
              statusText: "Menunggu Konfirmasi",
              isRequestedProduct: true,
              offeredProduct: []
            });
    
            // Ambil data pemilik produk dari usersData
            const productOwner = usersData.find((user) => user.id === exchange.requestedProductOwner);
            if (productOwner) {
              acc[exchangeId].productOwner = {
                id: productOwner.id,
                nama: productOwner.nama,  // Ubah ke "name" agar konsisten
                email: productOwner.email,
                telepon: productOwner.telepon,
                fotoProfil: productOwner.fotoProfil || "../assets/img/fotoProfil/user.png",
                alamat: productOwner.alamat
              };
            }
    
            // Cari produk yang ditawarkan
            const offeredProducts = exchange.offeredProductIds.map((offeredId: string) => {
              let offeredProduct = productData.find((p) => p.productID === offeredId) || null;
    
              if (!offeredProduct) {
                const additionalProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
                offeredProduct = additionalProducts.find((p: Product) => p.productID === offeredId) || null;
              }
    
              if (offeredProduct) {
                const updatedProducts = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
                const updatedOfferedProduct = updatedProducts.find((p: Product) => p.productID === offeredProduct?.productID);
                if (updatedOfferedProduct) {
                  offeredProduct = updatedOfferedProduct;
                }
              }
    
              return offeredProduct;
            });
    
            // Masukkan produk yang ditawarkan ke dalam 'items'
            offeredProducts.forEach((product: Product | undefined) => {
              if (product) {
                acc[exchangeId].items.push({
                  name: product.name,
                  image: product.images || ["/placeholder.jpg"],
                  statusText: "Menunggu Konfirmasi",
                  isRequestedProduct: false,
                  offeredProduct: product
                });
              }
            });
    
            return acc;
          }, {});
          
    
        setExchanges(Object.values(userExchanges));
      } catch (error) {
        console.error("Error parsing exchange requests:", error);
        setExchanges([]);
      }
    }, []);    
    

   
      
  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-gray-300 pb-3">
        <h2 className="flex items-center text-2xl text-[#7f0353]">
              <HistoryOutlined className="w-9 h-9" />| Riwayat Transaksi
            </h2>
            </div>
            {user ? (
              <>
                <div className="flex justify-center pt-8 space-x-6 border-b-2 border-gray-200 mb-4 relative">
                  {['JUAL', 'BELI', 'TUKAR'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-lg font-semibold relative ${activeTab === tab ? "text-black" : "text-gray-400"}`}
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
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      className="border border-gray-300 px-3 py-2 rounded-lg w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}

                <div className="mt-4">
                
                {activeTab === "JUAL" ? (
                    <div className="space-y-6">
                    {Object.entries(filteredProducts).length > 0 ? (
                      Object.entries(filteredProducts).map(([buyerID, data]) => (
                        <div key={buyerID} className="border p-4 rounded-lg shadow-sm">
                          {/* Nama Pembeli */}
                          <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="h-5 w-5 accent-[#7f0353] mr-2"
                              checked={buyerCheckboxes[Number(buyerID)] || false} // Status checkbox pembeli
                              onChange={(e) => handleBuyerCheckboxChange(Number(buyerID), e.target.checked)}
                            />
                                <img
                                      src={data.buyerProfilPhoto || "../assets/img/fotoProfil/user.png"}
                                      alt={data.buyerName}
                                      className="w-6 h- rounded-full object-cover border"
                                      onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                                    />
                            <span className="text-md sm:text-lg">{data.buyerName}</span>
                          </h3>

                          {/* Produk yang dibeli oleh pembeli ini */}
                          <div className="space-y-4">
                            {data.products.map((product, index) => (
                              <div key={index} className="border-b pb-4 flex items-center space-x-4 w-full">
                              {/* Checkbox Produk */}
                              {(product.status === 1 || product.status === 2) && (
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-[#7f0353]"
                                  checked={selectedProducts[Number(buyerID)]?.has(product.productID) || false}
                                  onChange={(e) => handleCheckboxChange(Number(buyerID), product.productID, e.target.checked)}
                                />
                              )}
                              {/* Gambar produk */}
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-14 w-14 sm:w-16 sm:h-16 object-cover rounded"
                              />
                              {/* Info Produk */}
                              <div className="flex flex-col w-full">
                                {/* Nama Produk & Status */}
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-sm sm:text-lg font-medium">{product.name}</p>
                                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${product.status === 1 ? "bg-orange-100 text-orange-600" : product.status === 2 ? "bg-blue-100 text-blue-600" : product.status === 3 ? "bg-teal-100 text-teal-600" : "bg-green-100 text-green-600" }`}>
                                  {isMobile ? product.statusText.split(" ")[0] : product.statusText }
                                  </span>
                                </div>
                                {/* Harga Produk */}
                                <p className="text-gray-500 text-sm">
                                  Rp{product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            ))}
                          </div>

                          {/* Tombol Proses Pesanan */}
                          <div className="mt-4 text-right">
                          <button
                            className="bg-[#7f0353] text-white px-6 py-2 rounded text-sm font-semibold flex-end"
                            onClick={() => processOrder(Number(buyerID))}
                          >
                            {getOrderButtonText(Number(buyerID))}
                          </button>
                          </div>
                        </div>
                      ))
                    ) : (
                            <p className="text-center">Belum ada produk yang dijual</p>
                          )}
                    </div>
                  ) : activeTab === "BELI" ? (
                    <>
                    {/* Tab Navigasi */}
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

                    {/* Input Pencarian */}
                    <input
                      type="text"
                      placeholder="Cari Merk atau Nama Produk"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded-md mb-4"
                    />

                    {/* Filter Produk Sesuai Tab */}
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
                                                  </div>
                    
                                                  {/* Daftar Barang */}
                                                  <div className="space-y-3">
                                                  {order.items?.map((item, index) => (
                                                  <div key={index} className="flex justify-between w-full items-center">
                                                  {/* Kiri: Gambar dan Detail Produk */}
                                                  <div className="flex items-center space-x-3">
                                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                                    <div className="flex flex-col">
                                                      <p className="text-sm sm:text-base font-medium">{item.name}</p>
                                                      <p className="text-gray-500 text-xs sm:text-sm">{item.quantity} x Rp{item.price.toLocaleString()}</p>
                                                    </div>
                                                  </div>
                                                
                                                  {/* Kanan Atas: Status */}
                                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start
                                                    ${item.statusText === "Menunggu Konfirmasi" ? "bg-orange-100 text-orange-600" :
                                                      item.statusText === "Diproses" ? "bg-blue-100 text-blue-600" :
                                                      item.statusText === "Dikirim" ? "bg-teal-100 text-teal-600" :
                                                      "bg-green-100 text-green-600"}`}>
                                                    {item.statusText.split(" ")[0]}
                                                  </span>
                                                </div>                                                
                                                ))}
                                                  </div>
                                                </div>
                    
                                                {/* Total & Tombol (Tetap di Bawah) */}
                                                <div className="mt-4 text-right border-t pt-1">
                                                  <p className="font-semibold text-sm sm:text-base">
                                                    Total Pesanan: <span className="text-lg font-bold text-[#7f0353]">Rp {order.total.toLocaleString()}</span>
                                                  </p>
                                                  <button onClick={() => seeDetailTransaction(order.id)} className="bg-[#7f0353] text-white h-[40px] mt-3 rounded-lg w-full sm:w-[180px] text-sm font-semibold transition duration-300 hover:bg-[#9a0465] active:scale-95">
                                                    Lihat Detail
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                  </>

                  ) : (
                    <>
                    {/* Tab Navigasi */}
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

                    {/* Input Pencarian */}
                    <input
                      type="text"
                      placeholder="Cari ID Transaksi"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded-md mb-4"
                    />

                    {/* List Transaksi Tukar-Menukar */}
                    {filteredExchanges.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada transaksi di kategori ini.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredExchanges.map((exchange) => {
                        return (
                          <div key={exchange.id} className="border p-4 rounded-lg shadow-sm">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-gray-700 text-sm truncate">
                                ID: {exchange.id} | {exchange.date}
                              </p>
                            </div>

                            {/* Pemilik Produk */}
                            <div className="bg-gray-200 p-3 rounded font-bold flex items-center gap-3">
                              <img
                                src={exchange.productOwner?.fotoProfil || "../assets/img/fotoProfil/user.png"}
                                alt={exchange.productOwner?.nama || "Tidak diketahui"}
                                className="w-8 h-8 rounded-full object-cover border"
                                onError={(e) => (e.currentTarget.src = "../assets/img/fotoProfil/user.png")}
                              />
                              <span className="text-sm truncate">{exchange.productOwner?.nama || "Tidak diketahui"}</span>
                            </div>

                            {/* Produk yang diminta */}
                            <div className="mb-2">
                              {exchange.items.filter((item) => item.isRequestedProduct).map((item, index) => (
                                <div key={index} className="flex border-b p-4 items-center space-x-3">
                                  <img
                                    src={item.image[0] || "../assets/img/produk/dummy.jpg"}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm sm:text-lg font-medium break-words">{item.name}</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${item.statusText === "Menunggu Konfirmasi" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                                    {isMobile ? item.statusText.split(" ")[0] : item.statusText }
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Produk yang ditawarkan */}
                            <div className="mb-2">
                              <p className="font-semibold text-gray-800">Produk Ditawarkan:</p>
                              {exchange.items.filter((item) => !item.isRequestedProduct).map((item, index) => (
                                <div key={index} className="flex border-b p-4 items-center space-x-3">
                                  <img
                                    src={item.image[0] || "../assets/img/produk/dummy.jpg"}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")}
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm sm:text-lg font-medium break-words">{item.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-2 text-center float-right">
                              <button className="bg-[#7f0353] text-white h-[35px] rounded w-[100px] sm:w-[200px] text-sm font-semibold">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        );
                      })}
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

export default History;
