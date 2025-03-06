import { Card, Button } from 'antd';

const achievements = [
  { title: "Jumlah Pengguna Terdaftar", value: "11.631" },
  { title: "Jumlah Pakaian terjual & tertukar", value: "3.965" },
  { title: "Pakaian bekas terkelola (kg)", value: "1.982,5" },
  { title: "Tingkat Kepuasan Pengguna", value: "4.8/5.0" },
];

const OurAchievements = () => {
  return (
    <div className="bg-[#F5DEB3] py-10 flex flex-col items-center min-w-screen">
      <h2 className="text-[#7f0353] text-2xl font-semibold mb-8 font-extrabold">PENCAPAIAN KAMI</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {achievements.map((item, index) => (
          <Card
            key={index}
            className="w-48 text-center shadow-lg rounded-md"
            style={{ borderRadius: '8px'}}
          >
            <div className="text-[#7f0353] text-center text-3xl font-bold">{item.value}</div>
            <div className="text-gray-600 font-medium">{item.title}</div>
          </Card>
        ))}
      </div>
      <Button type="primary" className="mt-8 bg-[#7f0353] border-none hover:bg-[#002904]">
        Selengkapnya
      </Button>
    </div>
  );
};

export default OurAchievements;
