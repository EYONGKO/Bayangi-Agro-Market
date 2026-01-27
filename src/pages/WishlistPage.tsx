import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import PageLayout from '../components/PageLayout';

const WishlistPage = () => {
  const { addToCart } = useCart();
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    let mounted = true;
    fetchAllProducts()
      .then((data) => {
        if (mounted) setAllProducts(data);
      })
      .catch(() => {
        if (mounted) setAllProducts([]);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanupLoad = loadProducts();
    const unsubscribe = subscribeProductsChanged(() => {
      loadProducts();
    });
    return () => {
      cleanupLoad();
      unsubscribe();
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={24} color="#ff4757" fill="#ff4757" />
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#111827' }}>Wishlist</h1>
              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#6b7280',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                padding: '4px 12px',
                borderRadius: '999px'
              }}>
                {wishlistProducts.length} items
              </span>
            </div>

            {wishlistProducts.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear your wishlist?')) {
                    clearWishlist();
                  }
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 0 60px' }}>
        {wishlistProducts.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '18px',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: '#fff1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fecdd3'
            }}>
              <Heart size={26} color="#ff4757" />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 900, color: '#111827' }}>
              Your wishlist is empty
            </h2>
            <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '18px' }}>
              Tap the heart icon on any product to save it here.
            </div>
            <Link
              to="/global-market"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: '#111827',
                color: '#ffffff',
                padding: '12px 14px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '13px'
              }}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 22px rgba(0,0,0,0.06)'
                }}
              >
                <Link
                  to={`/product/${product.id}`}
                  state={{ product }}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Link>

                <div style={{ padding: '14px' }}>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product }}
                    style={{ display: 'block', textDecoration: 'none', color: '#111827', fontWeight: 900, lineHeight: 1.25 }}
                  >
                    {product.name}
                  </Link>

                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                    {product.vendor}
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827' }}>
                      FCFA{product.price.toLocaleString()}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '10px',
                          cursor: 'pointer'
                        }}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} color="#ff4757" />
                      </button>

                      <button
                        onClick={() => {
                          addToCart(product);
                          alert(`${product.name} added to cart!`);
                        }}
                        style={{
                          background: '#111827',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShoppingCart size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WishlistPage;
