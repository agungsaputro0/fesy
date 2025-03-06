import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { UseScroll } from '../hooks/UseScroll';
import { Link } from 'react-router-dom'; 

const navigation = [
  { name: 'Beranda', to: '/Welcome', current: false },
  { name: 'Tentang Kami', to: '#', current: false },
  { name: 'Artikel', to: '#', current: false },
  { name: 'Marketplace', to: '/Marketplace', current: false },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const isScrolled = UseScroll();

  return (
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-transparent'} transition duration-300 w-full fixed z-50`}>
      {({ open }) => (
        <>
          <div className="mx-auto min-w-screen px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-[#7f0353] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 w-[100vw] items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/assets/img/fesy-full-logo.png" 
                  alt="Fesy Logo"
                  className="h-10 w-30"
                />
                {/* <b className="text-[#7f0353]"><span className="text-amber-400">| Terra</span>Hive</b> */}
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
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="text-[#7f0353] relative flex rounded-md text-sm hover:bg-[#c2beba] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:text-[#7f0353] focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <span className={`${isScrolled ? 'text-[#7f0353] hover:text-gray-200' : ''} font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                        Masuk
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
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                >
                  <Disclosure.Button
                    className={classNames(
                      item.current ? 'bg-gray-900 text-[#7f0353]' : isScrolled ? 'text-[#7f0353] hover:bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-[#7f0353]',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
