import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCommunity } from '../data/products';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Product not found.</div>;
  }

  const relatedProducts = getProductsByCommunity(product.community).filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666', backgroundColor: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '8px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#27ae60' }}>Home</Link> 
          <span style={{ margin: '0 8px', color: '#999' }}>›</span>
          <Link to={`/community/${product.community}`} style={{ textDecoration: 'none', color: '#27ae60' }}>{product.community}</Link> 
          <span style={{ margin: '0 8px', color: '#999' }}>›</span>
          <span style={{ color: '#333' }}>{product.name}</span>
        </nav>

        <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          {/* Left Side - Image Gallery */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '500px', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}
              />
              {/* Thumbnail gallery placeholder */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: i === 1 ? '2px solid #27ae60' : '2px solid transparent',
                    cursor: 'pointer'
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                backgroundColor: '#27ae60', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {product.community}
              </span>
            </div>

            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem', 
              color: '#2c3e50',
              lineHeight: '1.2'
            }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#27ae60' 
              }}>
                {product.price.toLocaleString()} CFA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', color: '#ffa500' }}>
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} style={{ fontSize: '1.2rem' }}>{star}</span>
                  ))}
                </div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>(127 reviews)</span>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              marginBottom: '2rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#2c3e50' }}>
                Product Details
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#555', 
                lineHeight: '1.6',
                margin: '0'
              }}>
                {product.description}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#2c3e50'
              }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e9ecef', borderRadius: '8px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: 'none', 
                      background: 'none', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    −
                  </button>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: 'none', 
                      background: 'none', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  {quantity > 10 ? 'Bulk order available' : `${20 - quantity} left in stock`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  backgroundColor: '#27ae60',
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(39, 174, 96, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#219a52';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#27ae60';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Add to Cart • {(product.price * quantity).toLocaleString()} CFA
              </button>
              <button style={{
                padding: '1rem',
                border: '2px solid #27ae60',
                backgroundColor: 'transparent',
                color: '#27ae60',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }}>
                ♡
              </button>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#27ae60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {product.community.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: '0', fontSize: '1rem', fontWeight: '600' }}>
                    {product.community} Community
                  </h4>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
                    Artisan seller • 4.9 star rating
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#e8f5e9', 
                  color: '#27ae60', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  ✓ Fast shipping
                </span>
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#e8f5e9', 
                  color: '#27ae60', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  ✓ Handmade
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.95)', 
          borderRadius: '16px', 
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            color: '#2c3e50'
          }}>
            Customer Reviews
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#27ae60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '1rem'
                }}>
                  J
                </div>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>John D.</span>
                  <div style={{ color: '#ffa500', fontSize: '1.1rem' }}>★★★★★</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#555' }}>
                Beautiful craftsmanship! Exactly as described. Highly recommend this seller.
              </p>
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#27ae60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '1rem'
                }}>
                  S
                </div>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>Sarah M.</span>
                  <div style={{ color: '#ffa500', fontSize: '1.1rem' }}>★★★★☆</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#555' }}>
                Great product, fast shipping. Very satisfied with my purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.95)', 
            borderRadius: '16px', 
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem',
              color: '#2c3e50'
            }}>
              More from {product.community}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        <style>
          {`
            @media (max-width: 768px) {
              .product-layout {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ProductDetail;
