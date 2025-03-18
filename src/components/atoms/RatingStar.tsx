import { useState, useEffect } from "react";
import { Modal, Button, Rate, message, Input } from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const RatingModal = ({ orderID }: { orderID: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  useEffect(() => {
    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) {
      const ratings = JSON.parse(savedRatings);
      if (ratings[orderID]) {
        setRating(ratings[orderID].rating);
        setReview(ratings[orderID].review || "");
      }
    }
  }, [orderID]);

  const handleSubmit = () => {
    const savedRatings = localStorage.getItem("ratings");
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    ratings[orderID] = { rating, review };
    localStorage.setItem("ratings", JSON.stringify(ratings));

    message.success(`Rating dan review untuk order ${orderID} berhasil disimpan!`);
    setIsOpen(false);
  };

  const handleReset = () => {
    const savedRatings = localStorage.getItem("ratings");
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    delete ratings[orderID];
    localStorage.setItem("ratings", JSON.stringify(ratings));

    setRating(0);
    setReview("");
    message.success("Rating dan review telah dihapus!");
  };

  const getReaction = (rate: number) => {
    if (rate >= 4) return <SmileOutlined className="text-green-500 text-3xl" />;
    if (rate >= 2) return <MehOutlined className="text-yellow-500 text-3xl" />;
    return <FrownOutlined className="text-red-500 text-3xl" />;
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsOpen(true)} className="bg-[#7f0353] text-xs sm:text-sm border h-[35px] w-1/2 border-[#7f0353] text-white px-4 rounded-lg hover:bg-pink-200">
        {rating > 0 ? `Edit Rating (${rating} ⭐)` : "Beri Rating"}
      </Button>

      <Modal
        title={<h3 className="text-[#7f0353] pb-2">Puas dengan Pesananmu?</h3>}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={600}
        className="text-center"
      >
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="transition-transform duration-300 transform hover:scale-110">
            {getReaction(rating)}
          </div>

          <Rate allowHalf value={rating} onChange={setRating} className="text-3xl" />

          <TextArea
            rows={4}
            placeholder="Tambahkan review kamu di sini..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-center space-x-4">
            <Button key="cancel" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            {rating > 0 && (
              <Button key="reset" onClick={handleReset} danger>
                Reset
              </Button>
            )}
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RatingModal;
