import { FaHome, FaShoppingBag, FaNewspaper, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md sm:hidden z-50">
      <div className="flex justify-around py-2">
        <Link to="/Welcome" className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaHome size={24} />
          <span className="text-xs">Beranda</span>
        </Link>
        <Link to="/Marketplace" className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaShoppingBag size={24} />
          <span className="text-xs">Marketplace</span>
        </Link>
        <Link to="/Artikel" className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaNewspaper size={24} />
          <span className="text-xs">Artikel</span>
        </Link>
        <Link to="/Login" className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaUser size={24} />
          <span className="text-xs">Akun</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;