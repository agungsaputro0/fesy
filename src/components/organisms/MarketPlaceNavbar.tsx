import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { UseScroll } from "../hooks/UseScroll";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { message } from "antd";
import { handleLogout as logout } from "../hooks/HandleLogin";
import MobileSidebar from "./MobileSidebar";

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const MarketPlaceNavbar = () => {
  const navigate = useNavigate();
  const isScrolled = UseScroll();
  const { userName } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProfileClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role === 2) {
      navigate(`/MyPage`);
    } else {
      navigate("/UserPage");
    }
  };

  const handleClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.role === 2) {
      navigate(`/MyCart`);
    } else {
      navigate(`/Cart`);
    }
  };

  const updateCartCount = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setCartCount(0);
      return;
    }
    const parsedUser = JSON.parse(currentUser);
    const currentUserID = parsedUser?.id;
    if (!currentUserID) {
      setCartCount(0);
      return;
    }

    const cartData = JSON.parse(localStorage.getItem("cartData") || "{}");
    const userCart = cartData[currentUserID] || [];
    setCartCount(userCart.length);
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters);
    // Tambahkan logika untuk menerapkan filter di sini
  };

  const handleLogout = async () => {
    try {
      logout();
      message.success("Logout berhasil");
      setTimeout(() => {
        window.location.href = "/Login";
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error("Terjadi kesalahan saat logout");
    }
  };

  return (
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-[#7f0353]'} border-b transition duration-300 w-full fixed z-50`}>
      {() => (
        <>
        {!isScrolled && (
            <svg
              className="absolute top-0 right-0 w-3/5 md:w-1/2 h-full opacity-25"
              viewBox="0 0 500 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Poligon kiri pertama */}
              <polygon points="160,10 240,0 220,60 140,80" fill="white" />
              
              {/* Poligon kanan pertama */}
              <polygon points="280,20 350,0 330,80 220,100" fill="white" />

              {/* Poligon kiri tambahan (lebih kanan dan miring) */}
              <polygon points="360,10 440,0 420,60 340,80" fill="white" transform="rotate(5,400,40)" />

              {/* Poligon kanan tambahan (lebih kanan dan sedikit lebih besar) */}
              <polygon points="430,15 500,0 480,80 380,100" fill="white" transform="rotate(-3,460,50)" />

              {/* Beberapa lingkaran tambahan untuk variasi */}
              <circle cx="200" cy="50" r="10" fill="white" />
              <circle cx="300" cy="80" r="8" fill="white" />
              <circle cx="400" cy="30" r="6" fill="white" />
              <circle cx="460" cy="70" r="12" fill="white" />

              {/* Garis diagonal tambahan */}
              <line x1="150" y1="10" x2="500" y2="110" stroke="white" strokeWidth="2" />
              <line x1="190" y1="0" x2="500" y2="90" stroke="white" strokeWidth="1.5" />

              {/* Persegi miring tambahan */}
              <rect x="260" y="20" width="30" height="30" fill="white" transform="rotate(20,260,20)" />
              <rect x="370" y="40" width="25" height="25" fill="white" transform="rotate(-15,370,40)" />
              <rect x="450" y="50" width="28" height="28" fill="white" transform="rotate(10,450,50)" />
            </svg>
          )}
          <div className="mx-auto sm:px-6 md-px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              
              {/* Logo (Hilang di Mobile) */}
              <div className="hidden sm:flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <img src="/assets/img/fesy-full-logo-white.png" alt="Fesy Logo" className="h-10 w-auto" />
                </Link>
              </div>
              <div className="sm:hidden items-center">
                <Link to="/" className="flex items-center ml-2 space-x-2">
                  <img src="/assets/img/fesy-logo.png" alt="Fesy Logo" className="h-10 w-auto" />
                </Link>
              </div>

              {/* Search Bar + Filter (Tampil di Mobile) */}
              <div className="flex flex-1 items-center justify-center sm:justify-start w-full max-w-full">
                <div className="flex items-center w-full md:max-w-md lg:max-w-md mx-4 relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                  <FunnelIcon
                    className="ml-3 h-8 w-8 text-white sm:hidden cursor-pointer"
                    onClick={() => setIsSidebarOpen(true)} // Saat di klik, tampilkan sidebar
                  />
                  <div onClick={handleClick} className="sm:hidden relative p-2 text-white hover:text-pink-200">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <MobileSidebar onFilterChange={handleFilterChange} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              {/* Icon Keranjang & User */}
              <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                
                {/* Icon Keranjang */}
                
                  <div onClick={handleClick} className="relative p-2 text-white hover:text-pink-200">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                        {cartCount}
                      </span>
                    )}
                  </div>
                

                {/* Dropdown Akun */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="text-white border border-white relative flex rounded-md text-sm hover:bg-[#c2beba] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:text-white focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <span className={`${isScrolled ? "text-white hover:text-gray-200" : ""} hidden sm:inline lg:inline md:inline font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                        {userName ? userName : "Sign Up | Log In"}
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white/90 rounded-lg shadow-left-bottom-light border border-gray-400 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userName ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleProfileClick}
                                className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm w-full text-left")}
                              >
                                Halaman Saya
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(active ? "bg-gray-100" : "", "block w-full text-left px-4 py-2 text-sm text-gray-800")}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/login" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-800")}>
                              Login
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default MarketPlaceNavbar;
