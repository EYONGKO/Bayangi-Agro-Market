import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';
import { useProducts } from '../contexts/ProductsContext';
import { communitiesData, getCommunityByName } from '../config/communities';

const Community = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { getProductsByCommunityReactive, lastUpdate } = useProducts();
  const [community, setCommunity] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load community data and products
  useEffect(() => {
    let isMounted = true;
    
    const loadCommunity = async () => {
      if (!name) return;
      
      // Get community data from config
      const communityData = communitiesData.find(comm => comm.slug === name);
      
      if (!communityData) {
        console.log('Community not found:', name);
        if (isMounted) navigate('/');
        return;
      }
      
      // Only update if community data has changed
      if (isMounted) {
        setCommunity(prev => {
          if (prev && prev.id === communityData.id) return prev;
          return communityData;
        });
        
        // Get products for this community
        const communityProducts = getProductsByCommunityReactive(communityData.id);
        
        // Update products if they've changed
        setProducts(prevProducts => {
          if (JSON.stringify(prevProducts) === JSON.stringify(communityProducts)) {
            return prevProducts;
          }
          return communityProducts;
        });
        
        setFilteredProducts(communityProducts);
        
        // Extract unique categories
        const cats = [...new Set(communityProducts.map(product => product.category))];
        setCategories(prevCats => {
          if (JSON.stringify(prevCats) === JSON.stringify(cats)) {
            return prevCats;
          }
          return cats;
        });
      }
    };
    
    loadCommunity();
    
    return () => {
      isMounted = false;
    };
  }, [name, getProductsByCommunityReactive, navigate]);

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  // Community-specific images for the carousel
  const getCommunityImages = useCallback((communitySlug) => {
    console.log('Getting images for:', communitySlug);
    
    // Always include the default hero image
    const defaultImage = '/images/community/hero section.jpg';
    
    if (!communitySlug) {
      console.log('No community slug provided, using default image');
      return [defaultImage];
    }
    
    // Simple mapping of community slugs to their images
    const imageMap = {
      kendem: '/images/community/kendem-hero.jpg',
      mamfe: '/images/community/mamfe-hero.jpg',
      fonjo: '/images/community/fonjo-hero.jpg',
      membe: '/images/community/membe-hero.jpg',
      'moshie-kekpoti': '/images/community/moshie-kekpoti-hero.png',
      'widikum': '/images/community/widikum-hero.jpg'
    };
    
    // Get the specific image for this community
    const specificImage = imageMap[communitySlug];
    
    // If we have a specific image, use it with the default as fallback
    if (specificImage) {
      console.log('Found specific image:', specificImage);
      return [specificImage, defaultImage];
    }
    
    console.log('No specific image found, using default');
    return [defaultImage];
  }, []);

  const communityImages = useMemo(() => {
    return getCommunityImages(name);
  }, [name]); // Removed getCommunityImages from dependencies as it's stable

  if (!community) {
    return <div>Loading community...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)' }}>
      {/* Hero Section with Image Carousel */}
      <section style={{ 
        position: 'relative', 
        height: '500px', 
        marginBottom: '0'
      }}>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <ImageCarousel 
            images={communityImages} 
            height="600px"
            autoRotate={true}
            interval={3000}
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          zIndex: 3,
          maxWidth: '800px',
          textAlign: 'center',
          width: '90%'
        }}>
          <h1 className="hero-title" style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            lineHeight: '1.2'
          }}>
            Welcome to {community.displayName} Community
          </h1>
          <p className="hero-subtitle" style={{ 
            fontSize: '1.4rem', 
            marginBottom: '2rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            lineHeight: '1.4'
          }}>
            {community.description || 'Discover authentic local products and connect with talented artisans in your community.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            <Link 
              to="/add-product" 
              className="add-product-btn" 
              style={{
                backgroundColor: '#27ae60',
                color: '#fff',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '1.2rem',
                fontWeight: '700',
                boxShadow: '0 6px 20px rgba(39, 174, 96, 0.4)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.5)';
                e.target.style.backgroundColor = '#219a52';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)';
                e.target.style.backgroundColor = '#27ae60';
              }}
            >
              <i className="fas fa-plus-circle" style={{ marginRight: '10px', fontSize: '1.1rem' }}></i>
              Sell Your Products
            </Link>
            
            <Link 
              to="#marketplace" 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '1.1rem',
                fontWeight: '600',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-shopping-bag" style={{ marginRight: '10px' }}></i>
              Browse Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Marketplace Section */}
      <section id="marketplace" style={{ 
        background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)',
        padding: '60px 0',
        margin: '0'
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          {/* Section Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px'
          }}>
            <h2 className="section-title" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#2c3e50',
              marginBottom: '10px'
            }}>
              Community Marketplace
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#7f8c8d',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Support local entrepreneurs and discover unique handcrafted items, fresh produce, and authentic products from your community
            </p>
          </div>

          {/* Filters and Search */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '25px',
            borderRadius: '15px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="filter-container" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {/* Categories */}
              <div className="categories-container" style={{ 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  marginRight: '10px',
                  fontSize: '1rem'
                }}>
                  Shop by Category:
                </span>
                <button
                  className="category-button"
                  onClick={() => setSelectedCategory('')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '25px',
                    border: 'none',
                    backgroundColor: selectedCategory === '' ? '#27ae60' : '#fff',
                    color: selectedCategory === '' ? '#fff' : '#2c3e50',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCategory === '' ? '0 2px 8px rgba(39, 174, 96, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className="category-button"
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '25px',
                      border: 'none',
                      backgroundColor: selectedCategory === category ? '#27ae60' : '#fff',
                      color: selectedCategory === category ? '#fff' : '#2c3e50',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedCategory === category ? '0 2px 8px rgba(39, 174, 96, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search local products, artisans, or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '12px 45px 12px 20px',
                    borderRadius: '25px',
                    border: '2px solid #e9ecef',
                    width: '280px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#27ae60';
                    e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <i className="fas fa-search" style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d',
                  pointerEvents: 'none'
                }}></i>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginTop: '30px'
          }}>
            <style>
              {`
                /* Desktop */
                @media (min-width: 1400px) {
                  .products-grid {
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 30px !important;
                  }
                  .marketplace-section {
                    padding: 60px 40px !important;
                  }
                  .hero-title {
                    font-size: 3.5rem !important;
                  }
                  .hero-subtitle {
                    font-size: 1.4rem !important;
                  }
                }
                
                /* Large Tablets */
                @media (min-width: 1000px) and (max-width: 1399px) {
                  .products-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 25px !important;
                  }
                  .marketplace-section {
                    padding: 50px 30px !important;
                  }
                  .hero-title {
                    font-size: 3rem !important;
                  }
                  .hero-subtitle {
                    font-size: 1.3rem !important;
                  }
                }
                
                /* Tablets */
                @media (min-width: 768px) and (max-width: 999px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 20px !important;
                  }
                  .marketplace-section {
                    padding: 40px 20px !important;
                  }
                  .hero-title {
                    font-size: 2.5rem !important;
                  }
                  .hero-subtitle {
                    font-size: 1.2rem !important;
                  }
                  .filter-container {
                    flex-direction: column !important;
                    gap: 15px !important;
                  }
                  .search-input {
                    width: 100% !important;
                  }
                }
                
                /* Mobile Large (iPhone 6/7/8 Plus) */
                @media (min-width: 414px) and (max-width: 767px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                  }
                  .product-card {
                    height: 220px !important;
                  }
                  .marketplace-section {
                    padding: 30px 15px !important;
                  }
                  .hero-title {
                    font-size: 2rem !important;
                  }
                  .hero-subtitle {
                    font-size: 1rem !important;
                  }
                  .filter-container {
                    flex-direction: column !important;
                    gap: 15px !important;
                  }
                  .categories-container {
                    justify-content: center !important;
                  }
                  .search-input {
                    width: 100% !important;
                  }
                  .section-title {
                    font-size: 2rem !important;
                  }
                  .hero-overlay {
                    left: 50% !important;
                    right: auto !important;
                    transform: translate(-50%, -50%) !important;
                    width: 95% !important;
                  }
                }
                
                /* Mobile Standard (iPhone 6/7/8) */
                @media (min-width: 375px) and (max-width: 413px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 10px !important;
                  }
                  .product-card {
                    height: 200px !important;
                  }
                  .marketplace-section {
                    padding: 25px 12px !important;
                  }
                  .hero-title {
                    font-size: 1.8rem !important;
                  }
                  .hero-subtitle {
                    font-size: 0.95rem !important;
                  }
                  .filter-container {
                    flex-direction: column !important;
                    gap: 12px !important;
                  }
                  .categories-container {
                    justify-content: center !important;
                    gap: 8px !important;
                  }
                  .category-button {
                    padding: 6px 12px !important;
                    font-size: 0.85rem !important;
                  }
                  .search-input {
                    width: 100% !important;
                    padding: 10px 35px 10px 15px !important;
                  }
                  .section-title {
                    font-size: 1.8rem !important;
                  }
                  .hero-overlay {
                    left: 50% !important;
                    right: auto !important;
                    transform: translate(-50%, -50%) !important;
                    width: 95% !important;
                  }
                  .add-product-btn {
                    padding: 12px 20px !important;
                    font-size: 1rem !important;
                  }
                }
                
                /* Mobile Small */
                @media (max-width: 374px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                  }
                  .product-card {
                    height: 180px !important;
                  }
                  .marketplace-section {
                    padding: 20px 10px !important;
                  }
                  .hero-title {
                    font-size: 1.5rem !important;
                  }
                  .hero-subtitle {
                    font-size: 0.9rem !important;
                  }
                  .filter-container {
                    flex-direction: column !important;
                    gap: 10px !important;
                  }
                  .categories-container {
                    justify-content: center !important;
                    gap: 6px !important;
                  }
                  .category-button {
                    padding: 5px 10px !important;
                    font-size: 0.8rem !important;
                  }
                  .search-input {
                    width: 100% !important;
                    padding: 8px 30px 8px 12px !important;
                  }
                  .section-title {
                    font-size: 1.5rem !important;
                  }
                  .hero-overlay {
                    left: 50% !important;
                    right: auto !important;
                    transform: translate(-50%, -50%) !important;
                    width: 95% !important;
                  }
                  .add-product-btn {
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                  }
                }
              `}
            </style>
            {filteredProducts.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: '#7f8c8d'
              }}>
                <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#2c3e50' }}>No products available yet</h3>
                <p style={{ marginBottom: '20px' }}>Be the first to add products to this community marketplace!</p>
                <Link 
                  to="/add-product" 
                  style={{
                    backgroundColor: '#27ae60',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Add First Product
                </Link>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
