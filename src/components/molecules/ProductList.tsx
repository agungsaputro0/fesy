import { useState, useEffect } from "react";
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

const itemsPerPage = 8; // Jumlah produk per halaman

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");

    // Ambil daftar produk yang sudah dibeli
    const purchasedProductIDs = new Set(
      orders.flatMap((order: Order) =>
        order.orders.flatMap((seller: OrderItem) =>
          seller.products.map((p: Product) => p.productID)
        )
      )
    );

    // Ambil produk tambahan & yang diperbarui dari localStorage
    const additionalProducts: Product[] = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
    const updatedProducts: Product[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");

    // Buat Map untuk produk yang diperbarui agar bisa diakses cepat berdasarkan productID
    const updatedProductMap = new Map(updatedProducts.map((p) => [p.productID, p]));

    // Ambil daftar produk yang telah dihapus dari LocalStorage
    const deletedProducts: { productId: string }[] = JSON.parse(localStorage.getItem("productDeleted") || "[]");
    const deletedProductIDs = new Set(deletedProducts.map((item) => item.productId));

    // Gabungkan semua produk (dari JSON, tambahan, dan yang diperbarui)
    const combinedProducts = [...product, ...additionalProducts];

    // Filter produk:
    const finalProducts = combinedProducts
      .filter((p: Product) => 
        !purchasedProductIDs.has(p.productID) && // Produk belum dibeli
        !deletedProductIDs.has(p.productID) // Bukan produk yang sudah dihapus
      )
      .map((p: Product) => updatedProductMap.get(p.productID) || p); // Pakai versi update jika ada

    setFilteredProducts(finalProducts);
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section>
      <div className="pt-16 flex justify-center mb-20" style={{ paddingLeft: "80px" }}>
        <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <div className="p-4">
            {/* Grid Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
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
