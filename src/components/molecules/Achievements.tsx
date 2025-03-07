import { Card, Button } from "antd";

const achievements = [
  { title: "Jumlah Pengguna Terdaftar", value: "11.631" },
  { title: "Jumlah Pakaian Terjual & Tertukar", value: "3.965" },
  { title: "Pakaian Bekas Terkelola (kg)", value: "1.982,5" },
  { title: "Tingkat Kepuasan Pengguna", value: "4.8/5.0" },
];

const OurAchievements = () => {
  return (
    <div className="bg-[#F5DEB3] py-10 px-4 flex flex-col items-center w-full">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 font-extrabold text-center">
        PENCAPAIAN KAMI
      </h2>

      {/* Tampilan Grid untuk Desktop & Tablet */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl">
        {achievements.map((item, index) => (
          <Card
            key={index}
            className="w-48 h-auto text-center shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-xl"
            style={{ borderRadius: "12px" }}
          >
            <div className="text-[#7f0353] text-3xl font-bold">{item.value}</div>
            <div className="text-gray-600 font-medium">{item.title}</div>
          </Card>
        ))}
      </div>

      {/* Scrollable View untuk Mobile */}
      <div className="md:hidden flex gap-6 overflow-x-auto py-4 px-2 snap-x snap-mandatory w-full">
        {achievements.map((item, index) => (
          <div
            key={index}
            className="snap-center flex-shrink-0 w-48 text-center bg-white shadow-lg rounded-xl p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-[#7f0353] text-3xl font-bold">{item.value}</div>
            <div className="text-gray-600 font-medium">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Tombol Responsif */}
      <Button
        type="primary"
        className="mt-8 bg-[#7f0353] border-none hover:bg-[#5e023f] px-6 py-2 text-lg rounded-lg transition-all duration-300"
      >
        Selengkapnya
      </Button>
    </div>
  );
};

export default OurAchievements;
