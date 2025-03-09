import { useState } from "react";
import articles from "../../pseudo-db/article.json";
import { BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ArticleList = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const navigate = useNavigate();

  const allCategories = [
    "All",
    ...new Set(articles.flatMap((article) => article.category)),
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || article.category.includes(selectedCategory))
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  
  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <section className="pt-20 sm:px-4 md:px-10 lg:px-20 flex justify-center mb-20">
      <div className="bg-white/90 sm:rounded-lg shadow-lg border sm:border-gray-400 w-full">
        <div className="bg-white/90 sm:rounded-lg shadow-left-bottom sm:border border-gray-400 p-6 pb-20 space-y-4 w-full max-w-full">
          <div className="p-[2px] sm:p-[20px]">
            <div className="flex flex-col sm:flex-row mb-6 items-center justify-between border-b-2 border-gray-300 pb-3">
              <h2 className="flex items-center text-2xl text-[#7f0353]">
                <BookOutlined />&nbsp;Perpustakaan Artikel
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                type="text"
                placeholder="Cari artikel..."
                className="flex-1 p-2 border rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {allCategories.map((category, index) => (
                  <option key={`${category}-${index}`} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 space-y-6">
              {displayedArticles.map((article) => (
                <div key={article.id} className="flex flex-col md:flex-row items-center bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="md:w-1/4 w-full flex justify-center gap-4">
                    {article.image && (
                      <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-lg">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/4 w-full md:pl-6 mt-4 md:mt-0">
                    <h3 className="text-lg font-semibold text-[#7f0353]">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.publishedAt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.category.map((cat, index) => (
                        <span key={`${article.id}-${index}`} className="bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 mt-2">
                      {article.description.length > 100
                        ? article.description.slice(0, 100) + "..."
                        : article.description}
                    </p>
                    {article.description.length > 100 && (
                      <button className="text-blue-600 mt-2" onClick={() => navigate(`/ReadArticle/${article.id}`)}>
                        Baca Selengkapnya
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <p className="text-gray-500 text-center mt-4">Tidak ada artikel yang ditemukan.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                className="px-3 py-1 border rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                &laquo;
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? "bg-gray-300" : ""}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border rounded-md"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;
