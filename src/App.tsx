import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { MobileMenuProvider } from './context/MobileMenuContext';
import { useState } from 'react';
import HomePage from './pages/HomePage-simple';
import CommunityPage from './pages/CommunityPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AddProductPage from './pages/AddProductPage';
import GlobalMarketPage from './pages/GlobalMarketPage';
import TopArtisansPage from './pages/TopArtisansPage';
import WishlistPage from './pages/WishlistPage';
import ChatPage from './pages/ChatPage';
import AccountDashboard from './pages/AccountDashboard';
import SellerDashboard from './pages/SellerDashboard';
import DashboardPage from './pages/DashboardPage';
import RecentProductsPage from './pages/RecentProductsPage';
import OrdersPage from './pages/OrdersPage';
import PerformancePage from './pages/PerformancePage';
import AuthPage from './pages/AuthPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AllCollectionsPage from './pages/AllCollectionsPage';
import CheckoutPage from './pages/CheckoutPage';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminLayout from './admin/AdminLayout';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import VisitorsAdminPage from './admin/pages/VisitorsAdminPage';
import PricesAdminPage from './admin/pages/PricesAdminPage';
import { ModalProvider } from './components/ModalManager';
import ProductsAdminPage from './admin/pages/ProductsAdminPage';
import OrdersAdminPage from './admin/pages/OrdersAdminPage';
import UsersAdminPage from './admin/pages/UsersAdminPage';
import ArtisansAdminPage from './admin/pages/ArtisansAdminPage';
import CommunitiesAdminPage from './admin/pages/CommunitiesAdminPage';
import PostsAdminPage from './admin/pages/PostsAdminPage';
import CategoriesAdminPage from './admin/pages/CategoriesAdminPage';
import SiteSettingsAdminPage from './admin/pages/SiteSettingsAdminPage';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import VisitorTracker from './components/VisitorTracker';
import { Navigate } from 'react-router-dom';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <SiteSettingsProvider>
            <MobileMenuProvider 
              mobileMenuOpen={mobileMenuOpen} 
              toggleMobileMenu={toggleMobileMenu}
            >
              <ModalProvider>
                <Router>
                  <div className="App">
                    <ScrollToTop />
                    <VisitorTracker />
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/community/:id" element={<CommunityPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/add-product" element={<AddProductPage />} />
                <Route path="/global-market" element={<GlobalMarketPage />} />
                <Route path="/all-collections" element={<AllCollectionsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/top-artisans" element={<TopArtisansPage />} />
                <Route path="/top-artisans/:communityId" element={<TopArtisansPage />} />
                <Route path="/chat" element={<ProtectedRoute element={<ChatPage />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
                <Route path="/recent-products" element={<ProtectedRoute element={<RecentProductsPage />} />} />
                <Route path="/account" element={<ProtectedRoute element={<AccountDashboard />} />} />
                <Route path="/account/orders" element={<ProtectedRoute element={<OrdersPage />} />} />
                <Route path="/performance" element={<ProtectedRoute element={<PerformancePage />} />} />
                <Route path="/seller" element={<ProtectedRoute element={<SellerDashboard />} />} />

                <Route
                  path="/admin/login"
                  element={
                    <AdminAuthProvider>
                      <AdminLoginPage />
                    </AdminAuthProvider>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminAuthProvider>
                      <AdminLayout />
                    </AdminAuthProvider>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="visitors" element={<VisitorsAdminPage />} />
                  <Route path="prices" element={<PricesAdminPage />} />
                  <Route path="products" element={<ProductsAdminPage />} />
                  <Route path="orders" element={<OrdersAdminPage />} />
                  <Route path="users" element={<UsersAdminPage />} />
                  <Route path="artisans" element={<ArtisansAdminPage />} />
                  <Route path="communities" element={<CommunitiesAdminPage />} />
                  <Route path="posts" element={<PostsAdminPage />} />
                  <Route path="categories" element={<CategoriesAdminPage />} />
                  <Route path="site-settings" element={<SiteSettingsAdminPage />} />
                </Route>

                <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </div>
            </Router>
          </ModalProvider>
        </MobileMenuProvider>
      </SiteSettingsProvider>
    </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);
}

export default App;
