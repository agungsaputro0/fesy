import { useState, useEffect } from "react";
import useIsMobile from "../hooks/useMobile";
import ProductCard from "../atoms/ProductCard";
import product from "../../pseudo-db/product.json";

// Definisi tipe data untuk produk
interface Product {
  productID: string;
  userID: number;
  name: string;
  images: string[];
  price: number;
  merk: string;
  condition: string;
  category: string[];
  color?: string;
  bisaTukar: boolean;
  dikirimDari: string;
  size: string;
  description: string;
  status: number;
}

interface Seller {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  fotoProfil: string;
  alamat: { id: number; label: string; detail: string }[];
  role: number;
  password: string;
}

interface OrderItem {
  seller: Seller;
  products: Product[];
}

interface Order {
  userID: number;
  orders: OrderItem[];
}

const itemsPerPage = 8;

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");

    const purchasedProductIDs = new Set(
      orders.flatMap((order: Order) =>
        order.orders.flatMap((seller: OrderItem) =>
          seller.products.map((p: Product) => p.productID)
        )
      )
    );

    const additionalProducts: Product[] = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
    const updatedProducts: Product[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");

    const updatedProductMap = new Map(updatedProducts.map((p) => [p.productID, p]));

    const deletedProducts: { productId: string }[] = JSON.parse(localStorage.getItem("productDeleted") || "[]");
    const deletedProductIDs = new Set(deletedProducts.map((item) => item.productId));

    const combinedProducts = [...product, ...additionalProducts];

    const finalProducts = combinedProducts
      .filter((p: Product) => 
        !purchasedProductIDs.has(p.productID) &&
        !deletedProductIDs.has(p.productID)
      )
      .map((p: Product) => updatedProductMap.get(p.productID) || p);

    setFilteredProducts(finalProducts);
  }, []);

  // Ambil kategori unik dari produk
  const uniqueCategories = Array.from(
    new Set(filteredProducts.flatMap((p) => p.category))
  );

  // Produk yang ditampilkan sesuai filter kategori
  const displayedProducts = filteredProducts
    .filter((p) => !selectedCategory || p.category.includes(selectedCategory))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(
    filteredProducts.filter((p) => !selectedCategory || p.category.includes(selectedCategory)).length / itemsPerPage
  );

  return (
    <section className="flex justify-center">
      <div className={`${isMobile ? 'px-0' : 'px-10 ml-16'} pt-16 mb-20 transition-all w-full max-w-screen`}>
        <div className={`${isMobile ? 'pt-6 pb-6' : 'p-6'} bg-white/90 rounded-lg shadow-lg border border-gray-400 space-y-4 w-full`}>

          {/* 🔹 Pilihan Kategori */}
          <div className="overflow-x-auto flex gap-3 border-b pb-3 px-2 sm:px-4 mr-1 ml-1">
            <button
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === null ? "bg-[#7f0353] text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Semua
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category ? "bg-[#7f0353] text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Grid Produk */}
            <div className="grid grid-cols-2 sm:grid-cols-2 mediumgap:grid-cols-3 largegap:grid-cols-4 gap-4 largegap:gap-12 mediumgap:gap-12 sm:gap-12">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <ProductCard key={product.productID} product={product} />
                ))
              ) : (
                <p className="text-center text-gray-500 w-full col-span-full">Tidak ada produk dalam kategori ini.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? "bg-gray-300" : "bg-[#7f0353] text-white"
                }`}
              >
                {"<"}
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-[#7f0353] text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? "bg-gray-300" : "bg-[#7f0353] text-white"
                }`}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
