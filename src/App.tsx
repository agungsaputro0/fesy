import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/atoms/LoadingSpinner';
import ProtectedRoute from './components/hooks/ProtectedRoute';
import StakeholderRoute from './components/hooks/StakeholderRoute';
import RedirectIfLoggedIn from './components/hooks/RedirectIfLoggedIn';


const Welcome = lazy(() => import('./components/pages/Welcome'));
const LoginPage = lazy(() => import('./components/pages/Login'));
const Home = lazy(() => import('./components/pages/Home'));
const Profil = lazy(() => import('./components/pages/Profil'));
const SignUpPage = lazy(() => import('./components/pages/SignUp'));
const ResendActivationPage = lazy(() => import('./components/pages/ResendActivation'));
const Users = lazy(() => import('./components/pages/Users'));
const AddUser = lazy(() => import('./components/pages/AddUser'));
const MarketPlace = lazy(() => import('./components/pages/Marketplace'));
const ProductDetail = lazy(() => import('./components/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./components/pages/CartPage'));
const CheckOutPage = lazy(() => import('./components/pages/CheckOutPage'));
const Payment = lazy(() => import('./components/pages/PaymentPage'));
const History = lazy(() => import('./components/pages/History'));
const OrderHistory = lazy(() => import('./components/pages/OrderHistory'));
const MyPage = lazy(() => import('./components/pages/MyPages'));
const Seller = lazy(() => import('./components/pages/SellerPage'));
const Penukaran = lazy(() => import('./components/pages/PenukaranPage'));
const Article = lazy(() => import('./components/pages/Article'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/Welcome" />} />
        <Route path="/Welcome" element={<RedirectIfLoggedIn><Welcome /></RedirectIfLoggedIn>} />
        <Route path="/Login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
        <Route path="/SignUp" element={<RedirectIfLoggedIn><SignUpPage /></RedirectIfLoggedIn>} />
        <Route path="/ResendAktivasi" element={<RedirectIfLoggedIn><ResendActivationPage /></RedirectIfLoggedIn>} />
        <Route path="/Marketplace" element={<RedirectIfLoggedIn><MarketPlace /></RedirectIfLoggedIn>} />
        <Route path="/FesMarketplace" element={<ProtectedRoute><MarketPlace /></ProtectedRoute>} />
        <Route path="/Market" element={<StakeholderRoute><MarketPlace /></StakeholderRoute>} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/Users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/TambahUser" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
        <Route path="/Portal" element={<StakeholderRoute><Home /></StakeholderRoute>} />
        <Route path="/ProductDetail/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/Product/:productId" element={<StakeholderRoute><ProductDetail /></StakeholderRoute>} />
        <Route path="/Cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/MyCart" element={<StakeholderRoute><CartPage /></StakeholderRoute>} />
        <Route path="/CheckOut" element={<ProtectedRoute><CheckOutPage /></ProtectedRoute>} />
        <Route path="/CheckOutProduct" element={<StakeholderRoute><CheckOutPage /></StakeholderRoute>} />
        <Route path="/Payment/:orderID" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/PaymentProduct/:orderID" element={<StakeholderRoute><Payment /></StakeholderRoute>} />
        <Route path="/History" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/TransactionHistory" element={<StakeholderRoute><History /></StakeholderRoute>} />
        <Route path="/MyHistory" element={<StakeholderRoute><OrderHistory /></StakeholderRoute>} />
        <Route path="/MyPage" element={<StakeholderRoute><MyPage /></StakeholderRoute>} />
        <Route path="/UserPage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/SellerPage/:sellerID" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
        <Route path="/Seller/:sellerID" element={<StakeholderRoute><Seller /></StakeholderRoute>} />
        <Route path="/Exchange/:productId" element={<StakeholderRoute><Penukaran /></StakeholderRoute>} />
        <Route path="/ExchangeProduct/:productId" element={<ProtectedRoute><Penukaran /></ProtectedRoute>} />
        <Route path="/Artikel" element={<RedirectIfLoggedIn><Article /></RedirectIfLoggedIn>} />
        <Route path="/Article" element={<ProtectedRoute><Article /></ProtectedRoute>} />
        <Route path="/ArticleList/" element={<StakeholderRoute><Article /></StakeholderRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;
