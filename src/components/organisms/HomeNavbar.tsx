// HomeNavbar.tsx
import { useState, useEffect } from "react";
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
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
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-transparent'} border-b transition duration-300 w-full fixed z-50`}>
      {() => (
        <>
          <div className="mx-auto min-w-screen px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              </div>
              <div className="flex flex-1 w-[100vw] items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex items-center space-x-2">
               <img
                  src="/assets/img/fesy-full-logo.png" 
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
                          item.current ? 'bg-gray-900 text-[#7f0353]' : isScrolled ? 'text-[#7f0353] hover:bg-[#c2beba]' : 'text-[#7f0353] hover:bg-[#c2beba] hover:text-[#7f0353]',
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
                <div onClick={handleClick}  className="relative p-2 mr-2 text-[#7f0353] hover:text-[#5c595f]">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                      {cartCount}
                    </span>
                  )}
                </div>
                {!isMobile && (
                <Menu as="div" className="relative ml-3">
                  <div>
                  <Menu.Button className="hover:text-[#7f0353] hover:bg-[#c2beba]  border border-[#7f0353] rounded-md px-3 py-2 text-sm font-medium text-[#7f0353]">
                    <span className="sr-only">Open user menu</span>
                    <span className={`${isScrolled ? 'text-[#7f0353] hover:text-[#7f0353]' : ''} hidden sm:inline lg:inline md:inline font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
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
