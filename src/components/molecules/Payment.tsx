import { useState, useEffect } from "react";
import { notification } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Ambil data currentUser dan orders dari localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  // Cari order pertama dari currentUser yang belum dibayar
  const unpaidOrder = orders.find(
    (order: any) => order.userID === currentUser.id && order.sudahBayar === undefined
  );

  // Jika ada order yang belum dibayar, gunakan grandTotal-nya, jika tidak, 0
  const totalAmount = unpaidOrder ? unpaidOrder.grandTotal : 0;

  // Fungsi untuk generate Virtual Account
  const generateVirtualAccount = () => {
    const prefix = Math.floor(100 + Math.random() * 900); // 3 angka depan
    const suffix = Math.floor(100000000000 + Math.random() * 900000000000); // 12 angka belakang
    return `${prefix} ${suffix}`;
  };

  // Ambil atau buat Virtual Account
  let storedVA = localStorage.getItem("virtualAccount");
  if (!storedVA) {
    storedVA = generateVirtualAccount();
    localStorage.setItem("virtualAccount", storedVA);
  }
  const [virtualAccount] = useState(storedVA);

  // Ambil atau buat dueTime
  let storedDueTime = localStorage.getItem("dueTime");
  if (!storedDueTime) {
    storedDueTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem("dueTime", storedDueTime);
  } else {
    storedDueTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem("dueTime", storedDueTime);
  }
  const [dueTime] = useState(storedDueTime);

  // State countdown
  const [countdown, setCountdown] = useState<number>(
    new Date(dueTime).getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(new Date(dueTime).getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [dueTime]);

  const formatCountdown = (time: number) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours} jam ${minutes} menit ${seconds} detik`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(virtualAccount);
    notification.success({ message: "Selamat!", description: "Nomor Virtual Account berhasil disalin!" });
  };

  const handlePaymentSuccess = () => {
    // Ambil orders dari localStorage
    const storedOrders = localStorage.getItem("orders");
    if (!storedOrders) return;

    const orders = JSON.parse(storedOrders);

    // Update orders dengan menambahkan sudahBayar setelah orderDate
    const updatedOrders = orders.map((order: any) => {
      if (order.userID === currentUser.id) {
        return {
          ...order,
          sudahBayar: true,
        };
      }
      return order;
    });

    // Simpan kembali ke localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Notifikasi berhasil
    notification.success({
      message: "Pembayaran Berhasil",
      description: "Status pembayaran telah diperbarui.",
    });

    // Arahkan ke halaman orders
    if (currentUser.role === 2) {
      navigate(`/MyHistory`);
    } else {
      navigate("/History");
    }
  };

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400  w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 space-y-4 w-full max-w-full">
        <div className="p-[2px] sm:p-[20px]">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-gray-300 pb-3">
        <h2 className="flex items-center text-2xl text-[#7f0353]">
              <CreditCardOutlined />&nbsp; Pembayaran
            </h2>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">Total Pembayaran:</p>
              <p className="text-xl font-bold text-[#7f0353]">Rp{totalAmount.toLocaleString()}</p>
              <p className="mt-2 text-sm text-gray-600">
                Bayar dalam: <span className="text-[#7f0353]">{formatCountdown(countdown)}</span>
              </p>
            </div>
            <div className="mt-4 p-4 border rounded-lg">
              <p className="font-semibold">
                Nomor Virtual Account {unpaidOrder?.selectedPayment ? `(${unpaidOrder.selectedPayment})` : ""}
              </p>
              <p className="text-xl font-bold text-[#7f0353]">{virtualAccount}</p>
              <button
                className="mt-2 px-4 py-2 bg-white text-[#7f0353] border border-[#7f0353] rounded-lg"
                onClick={copyToClipboard}
              >
                Salin
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil.
            </p>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Cara Bayar</h3>
              <div className="space-y-2 mt-2">
                {[
                  { method: "ATM", instructions: ["Masukkan kartu ATM", "Pilih menu Transfer", "Masukkan nomor Virtual Account", "Konfirmasi dan selesaikan pembayaran."] },
                  { method: "Mobile Banking", instructions: ["Buka aplikasi Mobile Banking", "Pilih Transfer ke Virtual Account", "Masukkan nomor Virtual Account", "Konfirmasi dan bayar."] },
                  { method: "Internet Banking", instructions: ["Login ke Internet Banking", "Pilih Transfer ke Virtual Account", "Masukkan nomor Virtual Account", "Konfirmasi dan selesaikan pembayaran."] },
                  { method: "Minimarket", instructions: ["Kunjungi kasir di Alfamart/Indomaret", "Beritahu ingin bayar dengan Virtual Account", "Sebutkan nomor Virtual Account", "Bayar sesuai tagihan."] }
                ].map(({ method, instructions }) => (
                  <div key={method} className="border rounded-lg">
                    <button
                      className="w-full text-left px-4 py-2 bg-gray-200 font-semibold"
                      onClick={() => setSelectedMethod(selectedMethod === method ? null : method)}
                    >
                      {method}
                    </button>
                    {selectedMethod === method && (
                      <div className="p-4 text-sm bg-gray-50">
                        <ul className="ml-4 space-y-1">
                          {instructions.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="mt-6 w-full bg-[#7f0353] text-white py-2 rounded-lg"
              onClick={handlePaymentSuccess}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
