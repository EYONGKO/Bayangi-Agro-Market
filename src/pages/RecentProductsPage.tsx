import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../data/productsStore';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  Package, 
  ShoppingCart,
  Star,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { theme } from '../theme/colors';

const RecentProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { currentUser } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Load real products data and filter by current user
    const allProducts = getAllProducts();
    const userProducts = allProducts.filter(product => 
      product.sellerId === currentUser?.id
    );
    setProducts(userProducts);

    return () => clearInterval(timer);
  }, [currentUser]);

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

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleToggleWishlist = (productId: number) => {
    toggleWishlist(productId);
  };

  const handleEditProduct = (productId: number) => {
    // Navigate to edit product page (you'll need to create this)
    window.location.href = `/edit-product/${productId}`;
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete product logic here
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      // Also update the products store
      const allProducts = getAllProducts();
      const filteredProducts = allProducts.filter(p => p.id !== productId);
      localStorage.setItem('local-roots-web-products-v1', JSON.stringify(filteredProducts));
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              {formatTime(currentTime)}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  My Products
                </h2>
                <p className="text-gray-600 mt-1">Products you have added to the marketplace</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{products.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-sm" style={{ color: theme.colors.primary.main }}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link 
                      to={`/product/${product.id}`}
                      className="block mb-2"
                    >
                      <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors" style={{ color: theme.colors.primary.main }}>
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">FCFA {formatPrice(product.price)}</p>
                        <p className="text-sm text-gray-600">{product.community}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        style={{ backgroundColor: theme.colors.primary.main }}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isWishlisted(product.id)
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Star size={16} className={isWishlisted(product.id) ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Edit/Delete Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Added</h3>
              <p className="text-gray-600 mb-6">You haven't added any products to the marketplace yet.</p>
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                style={{ backgroundColor: theme.colors.primary.main }}
              >
                <Plus size={16} />
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecentProductsPage;
