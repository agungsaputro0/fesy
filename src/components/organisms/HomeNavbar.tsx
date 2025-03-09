// HomeNavbar.tsx
import { useState, useEffect } from "react";
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ShoppingCartIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UseScroll } from '../hooks/UseScroll';
import { message } from 'antd';
import useNavigation from "../hooks/useNavigation";
import { handleLogout as logout } from '../hooks/HandleLogin';
import useIsMobile from "../hooks/useMobile";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

type HomeNavbarProps = {
  userName: string | null;
};

const HomeNavbar = ({ userName }: HomeNavbarProps) => {
  const navigation = useNavigation();
  const isScrolled = UseScroll(); 
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState<number>(0);

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

  const handleProfileClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  
    if (currentUser.role === 2) {
      navigate(`/MyPage`);
    } else {
      navigate('/UserPage'); 
    }
  };

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

  const formatUserName = (name: string | null) => {
    if (!name) return 'Akun'; 
    
    const nameParts = name.split(' '); 
    const firstName = nameParts[0]; 
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''; 
    
    return nameParts.length > 2 ? `${firstName} ${lastName}` : name; 
  };

  return (
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-fesypurple'} border-b transition duration-300 w-full fixed z-50`}>
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
          <div className="mx-auto min-w-screen px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              </div>
              <div className="flex flex-1 w-[100vw] items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex items-center space-x-2">
               <img
                  src="/assets/img/fesy-full-logo-white.png" 
                  alt="Fesy Logo"
                  className="h-10 w-30"
                />
              </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : isScrolled ? 'text-white hover:bg-[#c2beba]' : 'text-white hover:bg-[#c2beba] hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div onClick={handleClick}  className="relative p-2 mr-2 text-white hover:text-pink-200">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                      {cartCount}
                    </span>
                  )}
                </div>
                {isMobile && (
                    <Menu as="div" className="relative">
                    <div>
                    <Menu.Button className="hover:text-pink-200 rounded-md text-sm font-medium text-white">
                      <span className="sr-only">Open user menu</span>
                      <span className={`${isScrolled ? 'text-white hover:text-white' : ''} sm:hidden lg:hidden md:hidden font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                        <Bars3Icon className="h-6 w-6" />
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
                       <div className="py-1" role="none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm w-full text-left'
                                )}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                {!isMobile && (
                <Menu as="div" className="relative ml-3">
                  <div>
                  <Menu.Button className="hover:text-white hover:bg-[#c2beba]  border border-white rounded-md px-3 py-2 text-sm font-medium text-white">
                    <span className="sr-only">Open user menu</span>
                    <span className={`${isScrolled ? 'text-white hover:text-white' : ''} hidden sm:inline lg:inline md:inline font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                      {formatUserName(userName)}
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
                     <div className="py-1" role="none">
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
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default HomeNavbar;
