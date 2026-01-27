import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { fetchOrdersBySeller, subscribeOrdersChanged } from '../api/ordersApi';
import { loadProfile } from '../data/profileStore';
import { formatFCFA } from '../utils/currencyUtils';
import type { Order } from '../data/ordersStore';

export default function OrdersPage() {
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      processing: 'bg-yellow-100 text-yellow-700',
      shipped: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Recent Orders</h1>
                  <p className="text-sm text-gray-600">Manage your customer orders</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total Orders: {orders.length}</span>
              <span>•</span>
              <span>Seller ID: {sellerId}</span>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">When customers place orders, they'll appear here</p>
                <Link
                  to="/add-product"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {order.items.length}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-600">
                            {order.buyerName} • {order.items.length} items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{formatFCFA(order.total)}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3">
                      <div className="text-sm text-gray-600 mb-2">Order Items:</div>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">{item.name}</span>
                            <span className="text-gray-600">
                              {item.quantity} × {formatFCFA(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
