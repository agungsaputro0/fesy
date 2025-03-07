import { FaHome, FaShoppingBag, FaNewspaper, FaUser, FaMoneyBill } from "react-icons/fa";
import { useNavigate  } from "react-router-dom";
import { notification } from "antd";
const MobileBottomNavForHome = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser) {
          notification.error({
            message: "Mohon maaf!",
            description: "Silakan Login terlebih dahulu!",
          });
          navigate("/login");
        } else {
          if (currentUser.role === 2) {
            navigate(`/Portal`);
          } else {
            navigate(`/Home`);
          }
        }
      }

      const goToMarketplace = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser) {
          notification.error({
            message: "Mohon maaf!",
            description: "Silakan Login terlebih dahulu!",
          });
          navigate("/login");
        } else {
          if (currentUser.role === 2) {
            navigate(`/Market`);
          } else {
            navigate(`/FesMarketPlace`);
          }
        }
      }

      const goToTransaction = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser) {
          notification.error({
            message: "Mohon maaf!",
            description: "Silakan Login terlebih dahulu!",
          });
          navigate("/login");
        } else {
          if (currentUser.role === 2) {
            navigate(`/MyHistory`);
          } else {
            navigate(`/History`);
          }
        }
      }

      const goToArtikel = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser) {
          notification.error({
            message: "Mohon maaf!",
            description: "Silakan Login terlebih dahulu!",
          });
          navigate("/login");
        } else {
          if (currentUser.role === 2) {
            navigate(`/Article`);
          } else {
            navigate(`/ArticleLib`);
          }
        }
      }

      const goToMyPage = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser) {
          notification.error({
            message: "Mohon maaf!",
            description: "Silakan Login terlebih dahulu!",
          });
          navigate("/login");
        } else {
          if (currentUser.role === 2) {
            navigate(`/MyPage`);
          } else {
            navigate(`/UserPage`);
          }
        }
      }


  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md sm:hidden z-50">
      <div className="flex justify-around py-2">
        <div onClick={() => goToHome()} className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaHome size={24} />
          <span className="text-xs">Beranda</span>
        </div>
        <div onClick={() => goToMarketplace()} className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaShoppingBag size={24} />
          <span className="text-xs">Marketplace</span>
        </div>
        <div onClick={() => goToTransaction()} className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaMoneyBill size={24} />
          <span className="text-xs">Transaksi</span>
        </div>
        <div onClick={() => goToArtikel()} className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaNewspaper size={24} />
          <span className="text-xs">Artikel</span>
        </div>
        <div onClick={() => goToMyPage()} className="flex flex-col items-center text-[#7f0353] hover:text-gray-800">
          <FaUser size={24} />
          <span className="text-xs">Akun</span>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNavForHome;