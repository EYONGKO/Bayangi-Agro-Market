import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(Math.floor(Math.random() * 50) + 1); // Random initial count

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1);
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div 
        className="product-card" 
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          height: '250px',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {/* NEW Badge for recently added products */}
        {product.isNew && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(39, 174, 96, 0.4)',
            animation: 'pulse 2s infinite'
          }}>
            NEW
          </div>
        )}
        
        {/* Heart/Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle(e);
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
          }}
        >
          <i 
            className={isFavorited ? "fas fa-heart" : "far fa-heart"}
            style={{
              color: isFavorited ? '#e74c3c' : '#666',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          ></i>
        </button>
        
        {/* Favorite Count */}
        {favoriteCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '45px',
            right: '10px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#666',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '0.7rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            zIndex: 2
          }}>
            <i className="fas fa-heart" style={{ color: '#e74c3c', fontSize: '0.6rem' }}></i>
            {favoriteCount}
          </span>
        )}
        
        {/* Product Info Overlay */}
        <div className="product-info" style={{ 
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '15px 10px 10px 10px',
          background: 'transparent',
          zIndex: 2
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: '#fff',
            lineHeight: '1.2',
            textAlign: 'left',
            textShadow: '3px 3px 6px rgba(0,0,0,1), 1px 1px 3px rgba(0,0,0,1), -1px -1px 1px rgba(0,0,0,0.8)'
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 8px 0',
            lineHeight: '1.2',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textAlign: 'left',
            textShadow: '2px 2px 4px rgba(0,0,0,1), 1px 1px 2px rgba(0,0,0,1)'
          }}>
            {product.description}
          </p>
          <button 
            className="cta-button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            style={{
              width: '100%',
              backgroundColor: '#27ae60',
              color: '#fff',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#219a52';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#27ae60';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
      
      {/* CSS Animation for NEW badge */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Link>
  );
};

export default ProductCard;
