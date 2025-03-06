import React, { useState, useEffect } from "react";
import { HistoryOutlined } from "@ant-design/icons";

interface Product {
  productID: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  status: string;
}

interface Seller {
  sellerID: number;
  sellerName: string;
  products: Product[];
}

interface Order {
  orderID: string;
  date: string;
  sellers: Seller[];
  total: number;
  status: "Menunggu Konfirmasi" | "Diproses" | "Dikirim" | "Selesai";
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<
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

      // Kelompokkan order berdasarkan orderID
      const userOrders: Order[] = allOrders
        .filter((order: any) => order.userID === currentUserID)
        .map((order: any) => ({
          orderID: order.orderID ?? `ORD-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(order.orderDate).toLocaleDateString("id-ID"),
          total: order.grandTotal,
          status: order.orders[0]?.products[0]?.status || "Menunggu Konfirmasi",
          sellers: order.orders.map((o: any) => ({
            sellerID: o.seller.id,
            sellerName: o.seller.nama,
            products: o.products.map((product: any) => ({
              productID: product.productID,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.images[0],
              status: product.status || "Menunggu Konfirmasi",
            })),
          })),
        }));

      setOrders(userOrders);
    } catch (error) {
      console.error("Error parsing orders:", error);
      setOrders([]);
    }
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "SEMUA" ||
      (activeTab === "MENUNGGU" && order.status === "Menunggu Konfirmasi") ||
      (activeTab === "DIPROSES" && order.status === "Diproses") ||
      (activeTab === "DIKIRIM" && order.status === "Dikirim") ||
      (activeTab === "SELESAI" && order.status === "Selesai");

    const matchesSearch =
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellers.some((seller) =>
        seller.products.some((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    return matchesTab && matchesSearch;
  });

  return (
    <section>
      <div className="pt-24 pr-10 pl-6 flex justify-center mb-20" style={{ paddingLeft: "80px" }}>
        <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <div className="p-6">
            <h2 style={{ display: "flex", fontSize: "18pt", color: "#7f0353", margin: 0 }}>
              <HistoryOutlined className="w-9 h-9" />| Riwayat Transaksi
            </h2>
            <div className="flex justify-center pt-8 space-x-6 border-b-2 border-gray-200 mb-6 relative">
              {["SEMUA", "MENUNGGU", "DIPROSES", "DIKIRIM", "SELESAI"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-2 text-lg font-semibold relative ${
                    activeTab === tab ? "text-black" : "text-gray-400"
                  }`}
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
                <div key={order.orderID} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-700 text-sm">
                      ID: {order.orderID} | {order.date}
                    </p>
                  </div>

                  {order.sellers.map((seller) => {
                    // Ambil status tertinggi dari produk dalam satu seller
                    const sellerStatusLevel = Math.max(...seller.products.map(p => parseInt(p.status)));
                    const sellerStatus =
                      sellerStatusLevel === 1 ? "Menunggu Konfirmasi" :
                      sellerStatusLevel === 2 ? "Diproses" :
                      sellerStatusLevel === 3 ? "Dikirim" : "Selesai";

                    return (
                      <div key={seller.sellerID} className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-800 font-bold">{seller.sellerName}</p>
                          <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(sellerStatus)}`}>
                            {sellerStatus}
                          </span>
                        </div>
                        {seller.products.map((product, index) => (
                          <div key={index} className="flex border-b p-4 items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p className="text-lg font-medium">{product.name}</p>
                              <p className="text-gray-500 text-sm">
                                {product.quantity} x Rp{product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="mt-2 text-right">
                    <p className="font-semibold">
                      Total Pesanan:{" "}
                      <span className="text-xl font-bold text-[#7f0353]">
                        Rp {order.total.toLocaleString()}
                      </span>
                    </p>
                    <button className="bg-[#7f0353] text-white h-[35px] mt-4 rounded w-[200px] text-sm font-semibold">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
