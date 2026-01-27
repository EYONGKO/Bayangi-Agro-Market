import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  Package, 
  ShoppingCart,
  Star,
  ArrowUpRight,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Wallet as WalletIcon
} from 'lucide-react';
import { theme } from '../theme/colors';
import { getAllProducts } from '../data/productsStore';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [products, setProducts] = useState<any[]>([]);
  const { cart } = useCart();
  const { wishlistIds } = useWishlist();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Load real products data
    const allProducts = getAllProducts();
    setProducts(allProducts);

    return () => clearInterval(timer);
  }, []);

  // Calculate real stats from actual data
  const totalProducts = products.length;
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistIds.length;
  const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate top products from real data
  const topProducts = products
    .slice(0, 4)
    .map(product => ({
      name: product.name,
      rating: product.rating || 4.5,
      price: product.price,
      category: product.category
    }));

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              {formatTime(currentTime)}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.primary.background }}>
                  <Package size={24} style={{ color: theme.colors.primary.main }} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight size={16} />
                  {totalProducts}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.primary.background }}>
                  <ShoppingCart size={24} style={{ color: theme.colors.primary.main }} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight size={16} />
                  {totalCartItems}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalCartItems}</div>
                <div className="text-sm text-gray-600">Cart Items</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.primary.background }}>
                  <Star size={24} style={{ color: theme.colors.primary.main }} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight size={16} />
                  {totalWishlistItems}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalWishlistItems}</div>
                <div className="text-sm text-gray-600">Wishlist Items</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.primary.background }}>
                  <DollarSign size={24} style={{ color: theme.colors.primary.main }} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight size={16} />
                  FCFA
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">FCFA {formatPrice(totalValue)}</div>
                <div className="text-sm text-gray-600">Cart Value</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Performance Overview
                </h2>
                
                {/* Enhanced Bar Chart */}
                <div className="mb-6">
                  <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end justify-between h-full">
                      {[
                        { label: 'Products', value: totalProducts, color: '#2d5016' },
                        { label: 'Cart', value: totalCartItems, color: '#4a7c2e' },
                        { label: 'Wishlist', value: totalWishlistItems, color: '#16a34a' },
                      ].map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full px-2">
                          <div className="text-center mb-2">
                            <div className="text-lg font-bold text-gray-800">{item.value}</div>
                          </div>
                          <div 
                            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 shadow-sm"
                            style={{ 
                              height: `${Math.max((item.value / Math.max(totalProducts, totalCartItems, totalWishlistItems, 1)) * 180, 20)}px`,
                              backgroundColor: item.color,
                              minHeight: '20px'
                            }}
                          ></div>
                          <div className="text-xs text-gray-600 mt-2 text-center font-medium">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Trend Line Chart */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Activity Trend</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="h-32 flex items-end justify-between">
                      {[65, 80, 45, 90, 70, 85, totalCartItems].map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                            style={{ height: `${(value / 100) * 100}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Now'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Growth Rate</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">+12.5%</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Total Value</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">FCFA {formatPrice(totalValue)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products</span>
                    <span className="font-bold text-gray-900">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cart Items</span>
                    <span className="font-bold text-gray-900">{totalCartItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wishlist</span>
                    <span className="font-bold text-gray-900">{totalWishlistItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cart Value</span>
                    <span className="font-bold text-gray-900">FCFA {formatPrice(totalValue)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Quick Links
                </h2>
                <div className="space-y-3">
                  <Link 
                    to="/add-product" 
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600"
                    style={{ color: theme.colors.primary.main }}
                  >
                    Add New Product
                  </Link>
                  <Link 
                    to="/wallet" 
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600 flex items-center gap-2"
                    style={{ color: theme.colors.primary.main }}
                  >
                    <WalletIcon size={16} />
                    My Wallet
                  </Link>
                  <Link 
                    to="/global-market" 
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600"
                    style={{ color: theme.colors.primary.main }}
                  >
                    Browse Marketplace
                  </Link>
                  <Link 
                    to="/chat" 
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600"
                    style={{ color: theme.colors.primary.main }}
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/account" 
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600"
                    style={{ color: theme.colors.primary.main }}
                  >
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
