import { useAuth } from "../hooks/AuthContext";

const useNavigation = () => {
  const { userRole } = useAuth();

  return userRole === 1
    ? [
        { name: "Beranda", to: "/Home", current: false },
        { name: "Transaksi", to: "/History", current: false },
        { name: "Artikel", to: "#", current: false },
        { name: "Marketplace", to: "/FesMarketplace", current: false },
      ]
    : [
        { name: "Beranda", to: "/Home", current: false },
        { name: "Transaksi", to: "/MyHistory", current: false },
        { name: "Artikel", to: "#", current: false },
        { name: "Marketplace", to: "/Market", current: false },
      ];
};

export default useNavigation;
