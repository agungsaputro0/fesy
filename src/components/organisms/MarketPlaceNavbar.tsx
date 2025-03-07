import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { UseScroll } from "../hooks/UseScroll";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { message } from "antd";
import { handleLogout as logout } from "../hooks/HandleLogin";

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const MarketPlaceNavbar = () => {
  const navigate = useNavigate();
  const isScrolled = UseScroll();
  const { userName } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);

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
    <Disclosure as="nav" className={`${isScrolled ? "bg-black/50" : "bg-[#7f0353] sm:bg-transparent md:bg-transparent lg:bg-transparent"} border-b transition duration-300 w-full fixed z-50`}>
      {() => (
        <>
          <div className="mx-auto sm:px-6 md-px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              
              {/* Logo (Hilang di Mobile) */}
              <div className="hidden sm:flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <img src="/assets/img/fesy-full-logo.png" alt="Fesy Logo" className="h-10 w-auto" />
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
                  <FunnelIcon className="ml-3 h-6 w-6 text-white sm:hidden cursor-pointer" />
                </div>
              </div>

              {/* Icon Keranjang & User */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                
                {/* Icon Keranjang */}
                
                  <div onClick={handleClick} className="relative p-2 text-[#7f0353] hover:text-[#5c595f]">
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
                    <Menu.Button className="text-[#7f0353] border border-[#7f0353] relative flex rounded-md text-sm hover:bg-[#c2beba] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:text-[#7f0353] focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <span className={`${isScrolled ? "text-[#7f0353] hover:text-gray-200" : ""} hidden sm:inline lg:inline md:inline font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
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
