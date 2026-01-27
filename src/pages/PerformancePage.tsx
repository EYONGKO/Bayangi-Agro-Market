import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, ArrowLeft, BarChart3 } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { fetchOrdersBySeller, subscribeOrdersChanged } from '../api/ordersApi';
import { loadProfile } from '../data/profileStore';
import { formatFCFA } from '../utils/currencyUtils';
import { calculateAnalytics } from '../utils/analyticsUtils';
import type { Order } from '../data/ordersStore';

export default function PerformancePage() {
  const profile = loadProfile();
  const sellerId = profile.sellerId || 'local-artisan';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadOrders = () => {
      setLoading(true);
      fetchOrdersBySeller(sellerId)
        .then((data) => {
          if (mounted) {
            setOrders(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setOrders([]);
            setLoading(false);
          }
        });
    };
    
    loadOrders();
    const unsubscribe = subscribeOrdersChanged(() => loadOrders());
    
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [sellerId]);

  const analytics = calculateAnalytics(orders);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/seller"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
                  <p className="text-sm text-gray-600">Key metrics and analytics</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total Orders: {analytics.ordersCount}</span>
              <span>•</span>
              <span>Total Revenue: {formatFCFA(analytics.earnings)}</span>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{formatFCFA(analytics.earnings)}</div>
              <div className="text-xs text-green-600 font-semibold">{analytics.revenueTrend}</div>
            </div>

            {/* Items Sold */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Items Sold</span>
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{analytics.totalSold}</div>
              <div className="text-xs text-blue-600 font-semibold">Across all products</div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <DollarSign className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatFCFA(analytics.avgOrderValue)}
              </div>
              <div className="text-xs text-purple-600 font-semibold">Per transaction</div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Order Status Breakdown</h3>
                <div className="space-y-2">
                  {['pending', 'processing', 'shipped', 'delivered'].map(status => {
                    const count = orders.filter(o => o.status === status).length;
                    const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : '0';
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{status}</span>
                        <span className="text-sm font-medium text-gray-900">{count} ({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.ordersCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Items per Order (avg)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.ordersCount > 0 ? (analytics.totalSold / analytics.ordersCount).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Earnings Trend</span>
                    <span className="text-sm font-medium text-green-600">{analytics.earningsTrend}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
