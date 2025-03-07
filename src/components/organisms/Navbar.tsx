import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { UseScroll } from '../hooks/UseScroll';
import { Link } from 'react-router-dom'; 

const navigation = [
  { name: 'Beranda', to: '/Welcome', current: false },
  { name: 'Artikel', to: '#', current: false },
  { name: 'Marketplace', to: '/Marketplace', current: false },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const isScrolled = UseScroll();

  return (
    <Disclosure as="nav" className={`${isScrolled ? 'bg-black/50' : 'bg-transparent'} border-b transition duration-300 w-full fixed z-50`}>
      {() => (
        <>
          <div className="w-screen">
            <div className="relative flex h-16 ml-[10px] mr-[10px] items-center justify-between px-2 sm:px-6 lg:px-8">
              <div className="flex flex-1 w-[100vw] items-center justify-center sm:items-stretch sm:justify-start">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/assets/img/fesy-full-logo.png" 
                  alt="Fesy Logo"
                  className="h-10 w-30 min-w-30"
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
                    <Menu.Button className="text-[#7f0353] border border-[#7f0353] relative flex rounded-md text-sm hover:bg-[#c2beba] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:text-[#7f0353] focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <span className={`${isScrolled ? 'text-[#7f0353] hover:text-gray-200' : ''} hidden sm:inline lg:inline md:inline font-bold rounded-md px-3 py-2 text-sm font-medium transition-colors`}>
                        Sign Up | Log In
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
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white/90 rounded-lg shadow-lg border border-gray-400 py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
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
