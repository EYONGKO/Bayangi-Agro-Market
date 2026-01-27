import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, ShoppingBag, MessageSquare, Plus, Star, Box, User } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { loadProfile } from '../data/profileStore';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../context/CartContext';
import type { Order } from '../data/ordersStore';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import { fetchOrdersBySeller, subscribeOrdersChanged } from '../api/ordersApi';
import { loadThreads } from '../utils/chatStore';
import { calculateAnalytics } from '../utils/analyticsUtils';
import { formatFCFA } from '../utils/currencyUtils';
import { theme } from '../theme/colors';

export default function SellerDashboard() {
  const { currentUser } = useAuth();
  const profile = loadProfile();
  const sellerId = profile.sellerId || currentUser?.id || 'local-artisan';
  const displayName = currentUser?.name || profile.name;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadProducts = () => {
      fetchAllProducts()
        .then((data) => {
          if (mounted) setAllProducts(data);
        })
        .catch(() => {
          if (mounted) setAllProducts([]);
        });
    };
    loadProducts();
    const unsubscribe = subscribeProductsChanged(() => loadProducts());
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadOrders = () => {
      fetchOrdersBySeller(sellerId)
        .then((data) => {
          if (mounted) setOrders(data);
        })
        .catch(() => {
          if (mounted) setOrders([]);
        });
    };
    loadOrders();
    const unsubscribe = subscribeOrdersChanged(() => loadOrders());
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [sellerId]);

  const products = useMemo(() => {
    return allProducts.filter((p) => p.vendor === sellerId || p.sellerId === sellerId);
  }, [allProducts, sellerId]);

  const messages = loadThreads().filter((t) => t.sellerId === sellerId);

  // Calculate analytics using proper data
  const analytics = calculateAnalytics(orders);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: theme.colors.ui.white, border: `1px solid ${theme.colors.ui.border}`, boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-600 text-sm">Welcome, {displayName}</p>
                      {profile.verifiedSeller ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/add-product"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ background: theme.colors.primary.main, color: theme.colors.ui.white }}
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
                <Link
                  to="/account"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  style={{ backgroundColor: theme.colors.ui.white, border: `1px solid ${theme.colors.ui.border}`, color: theme.colors.neutral[900] }}
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={DollarSign}
              title="Total Earnings"
              value={formatFCFA(analytics.earnings)}
              subtitle="All time revenue"
              color="green"
              trend={analytics.earningsTrend}
            />
            <StatCard
              icon={ShoppingBag}
              title="Orders"
              value={analytics.ordersCount.toString()}
              subtitle="Total orders"
              color="blue"
              trend={analytics.ordersTrend}
            />
            <StatCard
              icon={Package}
              title="Products"
              value={products.length.toString()}
              subtitle="Active listings"
              color="purple"
              to="/add-product"
            />
            <StatCard
              icon={MessageSquare}
              title="Messages"
              value={messages.length.toString()}
              subtitle="Customer inquiries"
              color="orange"
              to="/chat"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Performance */}
            <div className="lg:col-span-2">
              <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.ui.white, border: `1px solid ${theme.colors.ui.border}`, boxShadow: `0 4px 20px ${theme.colors.ui.shadow}` }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.primary.main }}>
                      <Box className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Product Performance</h2>
                      <p className="text-sm text-slate-600">Your product analytics</p>
                    </div>
                  </div>
                  <Link
                    to="/add-product"
                    className="text-sm font-semibold transition-colors"
                    style={{ color: theme.colors.primary.light }}
                  >
                    Add New →
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12 rounded-xl" style={{ backgroundColor: theme.colors.primary.background }}>
                    <Package className="w-16 h-16 mx-auto mb-4" style={{ color: theme.colors.neutral[400] }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.neutral[900] }}>No products yet</h3>
                    <p className="mb-4" style={{ color: theme.colors.neutral[600] }}>Start selling by adding your first product</p>
                    <Link
                      to="/add-product"
                      className="inline-block px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    style={{ background: theme.colors.primary.main, color: theme.colors.ui.white }}
                    >
                      Add Product
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => {
                      const pOrders = orders.filter((o) => o.items.some((i) => i.productId === product.id));
                      const sold = pOrders.reduce(
                        (sum, o) => sum + o.items.filter((i) => i.productId === product.id).reduce((s, i) => s + i.quantity, 0),
                        0
                      );
                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="rounded-lg p-4 hover:shadow-md transition-shadow"
                          style={{ backgroundColor: theme.colors.ui.white, border: `1px solid ${theme.colors.ui.border}` }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.primary.main }}>
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold truncate" style={{ color: theme.colors.neutral[900] }}>{product.name}</h3>
                              <p className="text-sm" style={{ color: theme.colors.neutral[600] }}>{formatFCFA(product.price)}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: `1px solid ${theme.colors.ui.border}` }}>
                            <div className="text-center">
                              <div className="text-xs mb-1" style={{ color: theme.colors.neutral[600] }}>Sold</div>
                              <div className="font-bold" style={{ color: theme.colors.neutral[900] }}>{sold}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs mb-1" style={{ color: theme.colors.neutral[600] }}>Stock</div>
                              <div className="font-bold" style={{ color: theme.colors.neutral[900] }}>{product.stock ?? 'N/A'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs mb-1" style={{ color: theme.colors.neutral[600] }}>Rating</div>
                              <div className="font-bold flex items-center justify-center gap-1" style={{ color: theme.colors.neutral[900] }}>
                                {product.rating ?? '—'}
                                {product.rating && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
  to
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend?: string;
  to?: string;
}) {
  const colorClasses = {
    green: 'bg-green-600',
    blue: 'bg-blue-600', 
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600'
  };

  const content = (
    <div className="rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: theme.colors.ui.white, borderColor: theme.colors.ui.border }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-semibold" style={{ color: theme.colors.semantic.success, backgroundColor: 'rgba(22, 163, 74, 0.1)', padding: '2px 4px', borderRadius: '50%' }}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-xl font-bold mb-1" style={{ color: theme.colors.neutral[900] }}>{value}</div>
      <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.neutral[900] }}>{title}</div>
      <div className="text-xs" style={{ color: theme.colors.neutral[600] }}>{subtitle}</div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function Badge({ text }: { text: string }) {
  const styles = {
    delivered: 'bg-green-100 text-green-700 border-green-200',
    shipped: 'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[text as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </span>
  );
}
