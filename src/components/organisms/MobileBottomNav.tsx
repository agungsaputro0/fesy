import { FaHome, FaShoppingBag, FaNewspaper, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md sm:hidden z-50">
      <div className="flex justify-around py-2">
        <Link to="/Welcome" className="flex-1 flex flex-col items-center text-[#7f0353] hover:text-gray-800 text-center">
          <FaHome size={24} />
          <span className="text-xs">Beranda</span>
        </Link>
        <Link to="/Marketplace" className="flex-1 flex flex-col items-center text-[#7f0353] hover:text-gray-800 text-center">
          <FaShoppingBag size={24} />
          <span className="text-xs">Toko Online</span>
        </Link>
        <Link to="/Artikel" className="flex-1 flex flex-col items-center text-[#7f0353] hover:text-gray-800 text-center">
          <FaNewspaper size={24} />
          <span className="text-xs">Artikel</span>
        </Link>
        <Link to="/Login" className="flex-1 flex flex-col items-center text-[#7f0353] hover:text-gray-800 text-center">
          <FaUser size={24} />
          <span className="text-xs">Akun</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
