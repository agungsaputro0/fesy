import { useState, useEffect } from "react";
import { ArrowLeftOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CopyOutlined, CreditCardOutlined, FundProjectionScreenOutlined, RollbackOutlined, SyncOutlined } from "@ant-design/icons";
import { Card, List, Avatar, Typography, Divider, Row, Col, Tag, message, Timeline, Grid } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import ordersDummyData from "../../pseudo-db/orders-dummy.json";
import RatingModal from "../atoms/RatingStar";
import useIsMobile from "../hooks/useMobile";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const dummyTracking = [
    { status: "Paket telah diterima oleh ekspedisi", time: "10:00", icon: <SyncOutlined className="text-blue-500" /> },
    { status: "Paket dalam perjalanan ke hub utama", time: "2:00", icon: <ClockCircleOutlined className="text-orange-500" /> },
    { status: "Paket tiba di hub utama", time: "6:00", icon: <CheckCircleOutlined className="text-green-500" /> },
    { status: "Paket sedang dikirim ke alamat tujuan", time: "8:00", icon: <CheckCircleOutlined className="text-green-500" /> },
  ];

const TransactionDetail = () => {
  const { orderID } = useParams(); 
  const [order, setOrder] = useState<any | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const screens = useBreakpoint();
  const avatarSize = screens.xs ? 48 : screens.sm ? 56 : 64;
  
  useEffect(() => {
    // Ambil data orders dari LocalStorage
    const ordersData = localStorage.getItem("orders");
    let allOrders: any[] = [...ordersDummyData]; // Default ke dummy data
  
    if (ordersData) {
      try {
        const parsedOrders = JSON.parse(ordersData);
        if (Array.isArray(parsedOrders)) {
          allOrders = [...parsedOrders, ...ordersDummyData];
        } else {
          allOrders = [parsedOrders, ...ordersDummyData];
        }
      } catch (error) {
        console.error("Error parsing orders:", error);
        message.error("Terjadi kesalahan saat membaca data order.");
        return;
      }
    } else {
      message.warning("Data orders tidak tersedia! Menggunakan data dummy.");
    }
  
    // Cari order berdasarkan orderID
    const foundOrder = allOrders.find((o: any) => o.orderID === orderID);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      message.error("Order tidak ditemukan!");
      return;
    }
  }, [orderID]);
  
  if (!order) {
    return <Text>Memuat data transaksi...</Text>;
  }

    const now = new Date();
    const totalDays = Math.min(dummyTracking.length, 7); // Maksimum 7 hari terakhir

    const daysAgo = (index: number) => {
    const date = new Date();
    date.setDate(now.getDate() - (totalDays - 1 - index)); // Urutan maju dari terlama ke terbaru
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
    }).format(date);
    };

    const isOrderCompleted = order.orders.every((orderItem: any) =>
      orderItem.products.every((product: any) => product.status === 4)
    );

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
        <div className="border-b-2 border-gray-300 pb-3 mb-4">
          <h2 className="flex items-center text-2xl text-[#7f0353]">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#7f0353] transition-all duration-200"
            >
              <ArrowLeftOutlined className="text-xl" /><span className="mt-[-5px]">|</span>&nbsp;
            </button>
            <FundProjectionScreenOutlined />&nbsp;Detail Transaksi
          </h2>
        </div>
        <div className="space-y-3 bg-gray-100 p-4 rounded-lg shadow-md">
            {/* Order ID dengan Copy-to-Clipboard */}
            <div className="flex items-center gap-2">
                <Tag color="blue" className="cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200"
                onClick={() => {
                    navigator.clipboard.writeText(order.orderID);
                    message.success("Order ID disalin!");
                }}
                >
                <CopyOutlined className="mr-1" />
                <Text strong>Order ID: {order.orderID}</Text>
                </Tag>
            </div>

            {/* Tanggal Order dengan Ikon Kalender */}
            <div className="flex items-center gap-2">
                <CalendarOutlined className="text-gray-500 text-lg" />
                <Text strong className="text-gray-700">
                Tanggal Order: {new Date(order.orderDate).toLocaleString()}
                </Text>
            </div>

            {/* Metode Pembayaran dengan Ikon Dompet */}
            <div className="flex items-center gap-2">
                <CreditCardOutlined className="text-gray-500 text-lg" />
                <Text strong className="text-gray-700">
                Metode Pembayaran: {order.selectedPayment}
                </Text>
            </div>
            </div>

      <Divider />

      {/* List Order per Seller */}
      {order.orders.map((orderItem: any) => {
    const shipping = orderItem.shipping || {};  

    return (
      <Card className="mb-5" key={orderItem.seller.id} title={`Penjual: ${orderItem.seller.nama}`} bordered={true}>
        <List
          itemLayout="horizontal"
          dataSource={orderItem.products}
          renderItem={(product: any) => (
            <div key={product.id}>
              <List.Item
              style={{
                display: "flex",
                alignItems: "start", // Pastikan semua elemen sejajar
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {/* Gambar tetap sejajar dengan judul */}
              <Avatar
                shape="square"
                size={avatarSize}
                src={"../" + product.images[0]}
                style={{ flexShrink: 0 }} // Agar tidak mengecil di layar kecil
              />
              <div style={{ flex: 1, minWidth: "200px" }}>
                <List.Item.Meta
                  title={<Text className="font-bold" ellipsis={{ tooltip: product.name }}>{product.name}</Text>}
                  description={
                    <>
                      <Text type="secondary">Rp {product.price.toLocaleString()}</Text>
                      <br />
                      <Text
                        style={{ textAlign: "justify", display: "block" }} // Deskripsi rata kiri-kanan
                      >
                        {screens.xs ? product.description : (
                          <Text ellipsis={{ tooltip: product.description }}>
                            {product.description}
                          </Text>
                        )}
                      </Text>
                    </>
                  }
                />
              </div>
              <Tag
                color={
                  product.status === 1
                    ? "orange"
                    : product.status === 2
                    ? "blue"
                    : product.status === 3
                    ? "lime"
                    : "green"
                }
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                className={`hover:scale-105 hover:shadow-md ${isMobile ? 'w-full text-center' : ''}`}
              >
                {product.statusText || "Menunggu"}
              </Tag>

            </List.Item>

              {/* Timeline Tracking khusus untuk produk dengan status 3 */}
              {product.status === 3 && (
                <>
                  <Text strong className="block mt-2 mb-4 text-lg">Tracking Pengiriman:</Text>
                  <Timeline className="pl-4">
                    {dummyTracking.map((track, index) => (
                        <Timeline.Item key={index} dot={track.icon}>
                        <Text>{track.status}</Text>
                        <br />
                        <Text type="secondary">
                            {daysAgo(index)} {track.time}
                        </Text>
                        </Timeline.Item>
                    ))}
                    </Timeline>
                </>
              )}
            </div>
          )}
        />
  
        <Divider />
  
        {/* Info Pengiriman */}
        <Row gutter={[16, 16]} align="top">
      {/* Kolom Alamat Penjual */}
      <Col xs={24} md={12}>
        <Text strong>Dikirim Dari:</Text>
        <br />
        <Text style={{ display: "block", wordWrap: "break-word" }}>
          {orderItem.seller.alamat[0].detail}
        </Text>
      </Col>

      {/* Kolom Informasi Kurir */}
      <Col xs={24} md={12}>
        <Text strong>Kurir: {shipping.name || "Tidak diketahui"}</Text>
        <br />
        <Text>Estimasi: {shipping.estimated_delivery || "Tidak tersedia"}</Text>
      </Col>
    </Row>
      </Card>
    );
})}

      <Divider />

      {/* Total Harga */}
      <div className="text-right space-y-2 w-full md:w-80 ml-auto">
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Subtotal untuk {order.totalItems} Produk</span>
          <span className="font-medium">Rp {order.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Subtotal Pengiriman</span>
          <span className="font-medium">Rp {order.totalShippingPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Biaya Layanan</span>
          <span className="font-medium">Rp 1.000</span>
        </div>
        {order.totalDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-500">
            <span>Total Diskon</span>
            <span>-Rp {order.totalDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold">
          <span className="text-gray-600">Total Pembayaran</span>
          <span className="text-[#7f0353]">
            Rp {(order.grandTotal + 1000).toLocaleString()}
          </span>
        </div>
      </div>
      {isOrderCompleted && (
          <div className="flex gap-2 justify-center mt-6">
            <button className="bg-white text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-[#7f0353] px-4 rounded-lg hover:bg-pink-200">
              <RollbackOutlined /> Ajukan Retur
            </button>
            <RatingModal orderID={`${orderID}`} />
          </div>
        )}
    </div>
    </div>
    </div>
    </section>
  );
};

export default TransactionDetail;
