import { Card } from 'antd';

const commitments = [
    {
      image: "../../../assets/img/tab/guarantee.png",
      description: "Kami berkomitmen untuk memastikan pembeli menerima barang sesuai dengan deskripsi pada aplikasi dengan jaminan uang kembali",
    },
    {
      image: "../../../assets/img/tab/security.png",
      description: "Jaminan transaksi aman dan terlindungi, kami menggunakan payment gateway terpercaya untuk menghindari penipuan.",
    },
    {
      image: "../../../assets/img/tab/customer_service.png",
      description: "Kami memastikan Tim dukungan pelanggann siap membantu menyelesaikan masalah transaksi selama 24 jam",
    },
  ];

const OurCommitment = () => {
  return (
    <div className="mt-20 bg-[#DFE3D0] py-10 flex flex-col items-center min-w-screen">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 font-extrabold">KOMITMEN KAMI</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {commitments.map((item, index) => (
          <Card
            key={index}
            className="w-72 text-center shadow-lg rounded-md"
            style={{ borderRadius: '8px'}}
          >
            <img src={item.image} className="w-full h-full object-cover rounded-lg mb-4" />
            <div className="text-gray-600 font-medium">{item.description}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OurCommitment;
