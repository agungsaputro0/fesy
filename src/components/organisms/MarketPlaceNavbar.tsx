import { useState, useEffect } from "react";
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UseScroll } from '../hooks/UseScroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { message } from 'antd';
import { handleLogout as logout } from '../hooks/HandleLogin';
import { useNavigate } from "react-router-dom";

function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
  }

// const categories = [
//   { name: 'Pakaian Pria', to: '/kategori/pria' },
//   { name: 'Pakaian Wanita', to: '/kategori/wanita' },
//   { name: 'Aksesoris', to: '/kategori/aksesoris' },
//   { name: 'Sepatu', to: '/kategori/sepatu' },
// ];

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
      navigate('/UserPage'); 
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
    // Ambil user yang sedang login
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
  
    // Ambil data keranjang dari Local Storage
    const cartData = JSON.parse(localStorage.getItem("cartData") || "{}");
  
    // Ambil hanya produk dari user yang sedang login
    const userCart = cartData[currentUserID] || [];
  
    // Update jumlah produk di keranjang
    setCartCount(userCart.length);
  };
  
  // Panggil saat komponen dimuat & dengarkan event "cartUpdated"
  useEffect(() => {
    updateCartCount();
    
    // Event listener untuk menangkap perubahan Local Storage secara real-time
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
  
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);
  

  const handleLogout = async () => {
    try {
      logout();
      message.success('Logout berhasil');
      setTimeout(() => {
        window.location.href = '/Login';
      }, 1000); 
    } catch (error) {
      console.log(error);
      message.error('Terjadi kesalahan saat logout');
    }
  };

  return (
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-transparent'} transition duration-300 w-full fixed z-50`}>
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link to="/" className="flex items-center space-x-2">
                  <img src="/assets/img/fesy-full-logo.png" alt="Fesy Logo" className="h-10 w-auto" />
                </Link>
                
                {/* Search Bar */}
                <div className="hidden sm:flex items-center w-3/4 max-w-3/4 mx-4 relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* <div className="hidden sm:flex space-x-4 ml-4">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.to}
                    className="text-[#7f0353] hover:bg-gray-300 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </div> */}
              
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
                    <Menu.Button className="relative text-[#7f0353] flex rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <span className="font-bold rounded-md px-3 py-2 text-sm transition-colors">
                        {userName ? userName : 'Akun Anda'}
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
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                              )}
                            >
                              Halaman Saya
                            </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-800')}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-800')}
                            >
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
