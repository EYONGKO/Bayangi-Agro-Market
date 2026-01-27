import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MessageSquare, Store, TrendingUp, Package, Edit3, User } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import ProfileEditor from '../components/ProfileEditor';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getAllProducts } from '../data/productsStore';
import { theme } from '../theme/colors';
import { useState, useEffect } from 'react';

export default function AccountDashboard() {
  const { currentUser, refreshUserProfile } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useWishlist();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  
  // Refresh profile from backend on mount
  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);
  
  // Get real user products
  const allProducts = getAllProducts();
  const userProducts = allProducts.filter(product => 
    product.sellerId === currentUser?.id
  );
  
  // Calculate real statistics
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWishlistItems = wishlistIds.length;
  const totalProducts = userProducts.length;

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 mb-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    {currentUser?.profilePhoto ? (
                      <img src={currentUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <button
                    onClick={() => setShowProfileEditor(!showProfileEditor)}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>
                    Welcome back, {currentUser?.name || 'User'}!
                  </h1>
                  <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>
                    {currentUser?.email} • {currentUser?.role || 'buyer'} account
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/seller"
                  className="text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}
                >
                  <Store className="w-4 h-4" />
                  Seller Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ background: theme.colors.ui.white, borderColor: theme.colors.neutral[200], color: theme.colors.neutral[900], border: `1px solid ${theme.colors.neutral[200]}` }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Editor */}
          {showProfileEditor && (
            <div className="mb-6">
              <ProfileEditor 
                compact={true} 
                onClose={() => setShowProfileEditor(false)} 
              />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <Package className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>{totalProducts}</div>
                <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>My Products</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <ShoppingBag className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>{totalCartItems}</div>
                <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>Cart Items</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <Heart className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>{totalWishlistItems}</div>
                <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>Wishlist Items</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <TrendingUp className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.colors.neutral[900] }}>
                  FCFA {new Intl.NumberFormat('fr-FR').format(totalCartValue)}
                </div>
                <div className="text-sm" style={{ color: theme.colors.neutral[600] }}>Cart Value</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/recent-products"
              className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 group"
              style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <Package className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: theme.colors.neutral[900] }}>My Products</h3>
                  <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>Manage your listings</p>
                </div>
              </div>
            </Link>

            <Link
              to="/cart"
              className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 group"
              style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <ShoppingBag className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: theme.colors.neutral[900] }}>Shopping Cart</h3>
                  <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>{totalCartItems} items</p>
                </div>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 group"
              style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${theme.colors.primary.background}` }}>
                  <Heart className="w-6 h-6" style={{ color: theme.colors.primary.main }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: theme.colors.neutral[900] }}>Wishlist</h3>
                  <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>{totalWishlistItems} saved items</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6" style={{ borderColor: theme.colors.neutral[200], boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: theme.colors.neutral[900] }}>Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.neutral[700] }}>Full Name</label>
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.colors.neutral[200], backgroundColor: theme.colors.neutral[50] }}>
                  {currentUser?.name || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.neutral[700] }}>Email Address</label>
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.colors.neutral[200], backgroundColor: theme.colors.neutral[50] }}>
                  {currentUser?.email || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.neutral[700] }}>Account Role</label>
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.colors.neutral[200], backgroundColor: theme.colors.neutral[50] }}>
                  {currentUser?.role || 'buyer'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.neutral[700] }}>Account Status</label>
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.colors.neutral[200], backgroundColor: theme.colors.neutral[50] }}>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
