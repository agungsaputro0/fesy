import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReadOutlined, HeartOutlined, HeartFilled, CommentOutlined, ShareAltOutlined, SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import articles from "../../pseudo-db/article.json";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string[];
  image: string;
  video: string | null;
  publishedAt: string;
  narrative: string;
}

const BacaArtikel = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [likes, setLikes] = useState(0);
  const [commentCount, setCommentCount] = useState(2);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ name: string; text: string }[]>([
    { name: "Adam Farisky", text: "Artikel yang menarik! Terima kasih sudah berbagi." },
    { name: "Dhiya Tsalsa", text: "Saya sangat setuju dengan poin-poin yang disampaikan!" }
  ]);
  const currentUser = localStorage.getItem("currentUser");
  const parsedUser = currentUser ? JSON.parse(currentUser) : null;
  const currenUserName = parsedUser?.nama;
  const navigate = useNavigate();

  useEffect(() => {
    const foundArticle = articles.find((a) => a.id.toString() === id) || null;
    setArticle(foundArticle);
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    notification.success({message:"Selamat!", description:"Link artikel telah disalin!"});
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, { name: currenUserName, text: comment }]);
      setComment("");
      setCommentCount((prev) => prev + 1);
    }
  };

  if (!article) {
    return <p className="text-center text-gray-500 mt-20">Artikel tidak ditemukan.</p>;
  }

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
    <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400 w-full">
      <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 pb-20 space-y-4 w-full max-w-full">
        <div className="border-b-2 border-gray-300 pb-3">
          <h2 className="flex items-center text-2xl text-[#7f0353]">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#7f0353] transition-all duration-200"
            >
              <ArrowLeftOutlined className="text-xl" /><span className="mt-[-5px]">|</span>&nbsp;
            </button>
            <ReadOutlined />&nbsp;Baca Artikel
          </h2>
        </div>
        <h2 className="text-2xl font-semibold text-[#7f0353] mt-4">{article.title}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Published by <strong>Admin Fero Messi</strong> on {new Date(article.publishedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {article.category.map((cat, index) => (
            <span key={index} className="bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
              {cat}
            </span>
          ))}
        </div>

        {/* Gambar di atas narasi dengan lebar penuh */}
        {article.image && (
          <img src={"../" + article.image} alt={article.title} className="w-full rounded-lg shadow-md mt-6" />
        )}

        <div className="mt-6 text-gray-700 leading-relaxed text-justify">
          {article.narrative.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Video di tempat yang lebih interaktif */}
        {article.video && (
          <div className="mt-6 flex justify-center">
            <video controls className="w-3/4 max-w-lg rounded-lg shadow-md">
              <source src={"../" + article.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="mt-6 flex justify-around text-gray-600 border-t pt-4">
          <button onClick={handleLike} className="flex items-center gap-1 text-lg hover:text-red-500">
            {liked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />} {likes}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-lg hover:text-blue-500">
            <CommentOutlined /> Comment {commentCount}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 text-lg hover:text-green-500">
            <ShareAltOutlined /> Share
          </button>
        </div>

        {showComments && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Komentar</h3>
            <div className="space-y-4">
              {comments.map((c, index) => (
                <div key={index} className="p-3 border-b rounded-lg bg-white">
                  <strong>{c.name}</strong>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Tambahkan komentar..."
              />
              <button onClick={handleCommentSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex gap-2"><SendOutlined />Kirim</button>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default BacaArtikel;
