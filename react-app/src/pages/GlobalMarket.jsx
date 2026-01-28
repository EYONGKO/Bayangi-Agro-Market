import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { getCategories } from '../data/products';

const GlobalMarket = () => {
  const { getAllProductsReactive, lastUpdate } = useProducts();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allProducts = getAllProductsReactive();
    setProducts(allProducts);
    const cats = getCategories();
    setCategories(cats);
  }, [lastUpdate, getAllProductsReactive]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
        padding: '80px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Global Market
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '0',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover products from communities around the world
          </p>
        </div>
      </section>

      {/* Marketplace Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)',
        padding: '60px 0',
        marginTop: '-30px',
        borderRadius: '30px 30px 0 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          {/* Filters and Search */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '40px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: '25px'
            }}>
              {/* Categories */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontWeight: '700', 
                  color: '#2c3e50',
                  fontSize: '1.1rem',
                  marginRight: '15px'
                }}>
                  Categories:
                </span>
                <button
                  onClick={() => setSelectedCategory('')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: selectedCategory === '' ? '#27ae60' : '#fff',
                    color: selectedCategory === '' ? '#fff' : '#2c3e50',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCategory === '' ? '0 4px 15px rgba(39, 174, 96, 0.3)' : '0 3px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '30px',
                      border: 'none',
                      backgroundColor: selectedCategory === category ? '#27ae60' : '#fff',
                      color: selectedCategory === category ? '#fff' : '#2c3e50',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedCategory === category ? '0 4px 15px rgba(39, 174, 96, 0.3)' : '0 3px 10px rgba(0,0,0,0.1)'
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
                  placeholder="Search all products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '15px 50px 15px 25px',
                    borderRadius: '30px',
                    border: '3px solid #e9ecef',
                    width: '320px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#27ae60';
                    e.target.style.boxShadow = '0 0 0 4px rgba(39, 174, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <i className="fas fa-search" style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d',
                  fontSize: '1.1rem',
                  pointerEvents: 'none'
                }}></i>
              </div>
            </div>
          </div>

          {/* Products Count */}
          <div style={{ 
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#7f8c8d',
              fontWeight: '500'
            }}>
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="products-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginTop: '40px'
          }}>
            <style>
              {`
                @media (min-width: 1400px) {
                  .products-grid {
                    grid-template-columns: repeat(4, 1fr) !important;
                  }
                }
                @media (min-width: 1000px) and (max-width: 1399px) {
                  .products-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                  }
                }
                @media (min-width: 768px) and (max-width: 999px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                }
                @media (min-width: 375px) and (max-width: 767px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 15px !important;
                  }
                }
                @media (max-width: 374px) {
                  .products-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 10px !important;
                  }
                }
              `}
            </style>
            {filteredProducts.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '80px 20px',
                color: '#7f8c8d'
              }}>
                <i className="fas fa-globe" style={{ fontSize: '4rem', marginBottom: '25px', opacity: 0.4 }}></i>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#2c3e50' }}>No products found</h3>
                <p style={{ fontSize: '1.1rem' }}>Try adjusting your search or browse all categories</p>
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

export default GlobalMarket;
