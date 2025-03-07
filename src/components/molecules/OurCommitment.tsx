import { Card } from "antd";

const commitments = [
  {
    image: "../../../assets/img/tab/guarantee.png",
    description:
      "Kami berkomitmen untuk memastikan pembeli menerima barang sesuai dengan deskripsi pada aplikasi dengan jaminan uang kembali.",
  },
  {
    image: "../../../assets/img/tab/security.png",
    description:
      "Jaminan transaksi aman dan terlindungi, kami menggunakan payment gateway terpercaya untuk menghindari penipuan.",
  },
  {
    image: "../../../assets/img/tab/customer_service.png",
    description:
      "Kami memastikan Tim dukungan pelanggan siap membantu menyelesaikan masalah transaksi selama 24 jam.",
  },
];

const OurCommitment = () => {
  return (
    <div className="mt-20 bg-[#DFE3D0] py-10 px-4 flex flex-col items-center w-full">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 font-extrabold text-center">
        KOMITMEN KAMI
      </h2>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl">
        {commitments.map((item, index) => (
          <Card
            key={index}
            className="w-72 h-auto text-center shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-xl"
            style={{ borderRadius: "12px" }}
          >
            <div className="flex justify-center">
              <img src={item.image} className="w-24 h-24 object-contain rounded-lg mb-4" />
            </div>
            <div className="text-gray-600 font-medium">{item.description}</div>
          </Card>
        ))}
      </div>

      {/* Mobile Scrollable View */}
      <div className="md:hidden flex gap-6 overflow-x-auto py-4 px-2 snap-x snap-mandatory w-full">
        {commitments.map((item, index) => (
          <div
            key={index}
            className="snap-center flex-shrink-0 w-72 text-center bg-white shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-center">
              <img src={item.image} className="w-24 h-24 object-contain rounded-lg mb-4" />
            </div>
            <div className="text-gray-600 font-medium">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCommitment;
