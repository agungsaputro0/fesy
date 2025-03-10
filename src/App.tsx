import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/atoms/LoadingSpinner';
import StakeholderRoute from './components/hooks/StakeholderRoute';
import RedirectIfLoggedIn from './components/hooks/RedirectIfLoggedIn';


const Welcome = lazy(() => import('./components/pages/Welcome'));
const LoginPage = lazy(() => import('./components/pages/Login'));
const Home = lazy(() => import('./components/pages/Home'));
const MarketPlace = lazy(() => import('./components/pages/Marketplace'));
const ProductDetail = lazy(() => import('./components/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./components/pages/CartPage'));
const CheckOutPage = lazy(() => import('./components/pages/CheckOutPage'));
const Payment = lazy(() => import('./components/pages/PaymentPage'));
const OrderHistory = lazy(() => import('./components/pages/OrderHistory'));
const DetailTransaction = lazy(() => import('./components/pages/TransactionDetailPage'));
const MyPage = lazy(() => import('./components/pages/MyPages'));
const Seller = lazy(() => import('./components/pages/SellerPage'));
const Penukaran = lazy(() => import('./components/pages/PenukaranPage'));
const Article = lazy(() => import('./components/pages/Article'));
const ReadArticle = lazy(() => import('./components/pages/ReadArticle'));
const Personalization = lazy(() => import('./components/pages/PersonalizationPage'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* 0. homepage */}
        <Route path="/" element={<Navigate to="/Welcome" />} />
        <Route path="/Welcome" element={<RedirectIfLoggedIn><Welcome /></RedirectIfLoggedIn>} />
        {/* 1. loginPage */}
        <Route path="/Login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
        {/* 2. Portal */}
        <Route path="/Portal" element={<StakeholderRoute><Home /></StakeholderRoute>} />
        {/* 3. Marketplace */}
        <Route path="/Market" element={<StakeholderRoute><MarketPlace /></StakeholderRoute>} />
        {/* 4. Detail Produk */}
        <Route path="/Product/:productId" element={<StakeholderRoute><ProductDetail /></StakeholderRoute>} />
        {/* 5. Cart */}
        <Route path="/MyCart" element={<StakeholderRoute><CartPage /></StakeholderRoute>} />
        {/* 6. CheckOut */}
        <Route path="/CheckOutProduct" element={<StakeholderRoute><CheckOutPage /></StakeholderRoute>} />
        {/* 7. Payment */}
        <Route path="/PaymentProduct/:orderID" element={<StakeholderRoute><Payment /></StakeholderRoute>} />
        {/* 8. Histori Transaksi */}
        <Route path="/MyHistory" element={<StakeholderRoute><OrderHistory /></StakeholderRoute>} />
        {/* 9. Detail Transaksi */}
        <Route path="/DetailTransaction/:orderID" element={<StakeholderRoute><DetailTransaction /></StakeholderRoute>} />
        {/* 10. Halaman saya */}
        <Route path="/MyPage" element={<StakeholderRoute><MyPage /></StakeholderRoute>} />
        {/* 11. Toko Penjual */}
        <Route path="/Seller/:sellerID" element={<StakeholderRoute><Seller /></StakeholderRoute>} />
        {/* 12. Halaman Tukar Produk */}
        <Route path="/Exchange/:productId" element={<StakeholderRoute><Penukaran /></StakeholderRoute>} />
        {/* 13. Halaman daftar Artikel */}
        <Route path="/ArticleList/" element={<StakeholderRoute><Article /></StakeholderRoute>} />
        {/* 14. Baca Artikel */}
        <Route path="/ReadArticle/:id" element={<StakeholderRoute><ReadArticle /></StakeholderRoute>} />
        {/* 15. Personalisasi */}
        <Route path="/Personalization" element={<StakeholderRoute><Personalization /></StakeholderRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;
