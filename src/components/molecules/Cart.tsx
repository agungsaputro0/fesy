import { useEffect, useState } from "react";
import { Button, Input, Modal, notification } from "antd";
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import usersData from "../../pseudo-db/users.json";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

interface ProductProps {
  productID: string;
  userID: number;
  name: string;
  images: string[];
  color: string;
  size: string;
  condition: string;
  merk: string;
  price: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<ProductProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<ProductProps[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil user yang sedang login
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      notification.error({ message: "Kesalahan", description: "Silakan login terlebih dahulu!" });
      return;
    }

    const parsedUser = JSON.parse(currentUser);
    const userID = parsedUser?.id;
    if (!userID) {
      notification.error({ message: "Kesalahan", description: "User tidak valid." });
      return;
    }

    // Ambil data keranjang dari Local Storage
    const cartData = JSON.parse(localStorage.getItem("cartData") || "{}");
    const userCart = cartData[userID] || [];

    setCartItems(userCart);
    setFilteredItems(userCart);

    // Hitung total harga
    //const total = userCart.reduce((sum: number, item: ProductProps) => sum + item.price, 0);
    setTotalPrice(0);
  }, []);

  useEffect(() => {
    setSelectAll(selectedItems.length === filteredItems.length && filteredItems.length > 0);
  }, [selectedItems, filteredItems]);
  

  useEffect(() => {
    const total = filteredItems
      .filter(item => selectedItems.includes(item.productID))
      .reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  }, [selectedItems, filteredItems]);

  // Handle pencarian produk
  const handleSearch = (value: string) => {
    
    const filtered = cartItems.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.merk.toLowerCase().includes(value.toLowerCase()) 
    );
    setFilteredItems(filtered);
  };

  // Handle checklist semua item
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? filteredItems.map((item) => item.productID) : []);
  };

  // Handle checklist item individu
  const handleSelectItem = (productID: string, checked: boolean) => {
    setSelectedItems((prevSelected) =>
      checked ? [...prevSelected, productID] : prevSelected.filter((id) => id !== productID)
    );
  };

  const redirectToDetail = (productID: String) => {
      navigate("/ProductDetail/" + productID);
  }

  // Hapus produk dari cart dengan konfirmasi
  const handleRemoveFromCart = (productID: string) => {
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: "Apakah Anda yakin ingin menghapus produk ini dari keranjang?",
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const userID = currentUser?.id;

        if (!userID) return;

        let cartData = JSON.parse(localStorage.getItem("cartData") || "{}");
        let userCart = cartData[userID] || [];

        const updatedCart = userCart.filter((item: ProductProps) => item.productID !== productID);
        cartData[userID] = updatedCart;

        localStorage.setItem("cartData", JSON.stringify(cartData));
        setCartItems(updatedCart);
        setFilteredItems(updatedCart);

        // Hitung ulang total harga
        const newTotal = updatedCart.reduce((sum: number, item: ProductProps) => sum + item.price, 0);
        setTotalPrice(newTotal);

        notification.success({ message: "Produk dihapus", description: "Produk telah dihapus dari keranjang." });
      },
    });
  };

  const groupedItems = filteredItems.reduce((acc, product) => {
    if (!acc[product.userID]) {
      acc[product.userID] = { seller: usersData.find((user) => user.id === product.userID), products: [] };
    }
    acc[product.userID].products.push(product);
    return acc;
  }, {} as Record<number, { seller: any, products: ProductProps[] }>);

  const handleCheckOut = () => {
    if (selectedItems.length === 0) {
      notification.error({
        message: "Pilih Produk",
        description: "Silakan pilih minimal satu produk untuk checkout.",
      });
      return;
    }
  
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userID = currentUser?.id;
  
    if (!userID) {
      notification.error({
        message: "Kesalahan",
        description: "User tidak valid atau belum login.",
      });
      return;
    }
  
    const checkoutItems = cartItems.filter((item) =>
      selectedItems.includes(item.productID)
    );
  
    const checkoutData = {
      [userID]: checkoutItems,
    };
  
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    if (currentUser.role === 2) {
      navigate(`/CheckOutProduct`);
    } else {
      navigate("/Checkout");
    }
  };
  

  return (
    <section>
      <div className="pt-20 pl-6 pr-6  flex justify-center mb-20" style={{ paddingLeft: "80px" }}>
        <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <div style={{ padding: "20px" }}>
            {/* Header dengan Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  fontSize: "18pt",
                  color: "#7f0353",
                  margin: 0,
                }}
              >
                <ShoppingCartIcon className="w-8 h-8"  />&nbsp;&nbsp;|  
                Keranjang Belanja
              </h2>

              <Search
                placeholder="Cari produk..."
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ maxWidth: "300px", marginTop: "-18px" }}
              />
            </div>

            {/* Panel Checklist Pilih Semua */}
            {filteredItems.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <input
                     type="checkbox"
                     className="h-5 w-5 accent-[#7f0353] mr-[10px]"
                     checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
                
                <span>Pilih Semua Produk</span>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">Tidak ada barang di keranjang</div>
            ) : (
              <div className="mt-5 grid gap-4">
                {Object.values(groupedItems).map(({ seller, products }) => (
                  <div key={seller?.id || "unknown"} className="mb-6">
                    <div className="bg-gray-200 p-3 rounded font-bold flex items-center gap-3">
                      <img
                        src={seller.fotoProfil || "../assets/img/fotoProfil/user.png"}
                        alt={seller.nama}
                        className="w-6 h-6 rounded-full object-cover border"
                      />
                      <span className="text-sm">{seller ? seller.nama : "Penjual tidak ditemukan"}</span>
                    </div>
                    {products.map((product) => (
                      <div key={product.productID} className="grid grid-cols-6 gap-8 items-center justify-center border-b p-3 w-full">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-[#7f0353]"
                          checked={selectedItems.includes(product.productID)} onChange={(e) => handleSelectItem(product.productID, e.target.checked)}
                        />
                        <img src={product.images?.[0].startsWith("data:image/") ? product.images?.[0] : `../${product.images?.[0]}`} alt={product.name} className="w-20 h-20 rounded object-cover cursor-pointer" onClick={() => redirectToDetail(product.productID)} />
                        <span>{product.merk} {product.name}</span>
                        <span className="text-black text-sm">Warna {product.color}, Ukuran {product.size}, Kondisi {product.condition}</span>
                        <span className="font-bold">Rp {product.price.toLocaleString()}</span>
                        <Button type="primary" className="ml-auto bg-[#FF0000] flex items-center" onClick={() => handleRemoveFromCart(product.productID)}>
                          <TrashIcon className="w-5 h-5" /> Hapus
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

          {filteredItems.length > 0 && (
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "20px" }}>
              <h3 style={{ fontSize: "18pt", color: "#7f0353", fontWeight: "bold", margin: 0 }}>
                Total: Rp {totalPrice.toLocaleString()}
              </h3>
              <Button type="primary" className="bg-[#7f0353] flex items-center w-[15vw] h-[40px]" onClick={() => handleCheckOut()}>
                <ShoppingCartIcon className="w-5 h-5" /> | Checkout
              </Button>
            </div>
          )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
