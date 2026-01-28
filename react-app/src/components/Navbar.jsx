import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = 'unset';
    };
  }, [isSideMenuOpen]);

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash === '#communities') {
      setTimeout(() => {
        const element = document.getElementById('communities');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <nav className="navbar" style={{ 
        borderBottom: 'none', 
        padding: '1rem 1.5rem', 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 9997 
      }}>
        <div className="nav-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          maxWidth: '1400px', 
          margin: '0 auto', 
          gap: '1rem' 
        }}>
          <div className="logo" style={{ 
            fontWeight: '800', 
            fontSize: '1.8rem', 
            color: '#27ae60', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            textShadow: '0 2px 4px rgba(39, 174, 96, 0.2)'
          }}>
            <i className="fas fa-leaf" style={{ 
              fontSize: '1.4rem',
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(39, 174, 96, 0.3))'
            }}></i>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Local Roots</Link>
          </div>
          <div className="nav-links desktop-only" style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            fontWeight: '600', 
            fontSize: '1rem',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '8px 12px',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/' ? '#fff' : '#2c3e50',
                backgroundColor: location.pathname === '/' ? '#27ae60' : 'transparent',
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: location.pathname === '/' ? '0 4px 15px rgba(39, 174, 96, 0.4)' : 'none',
                transform: location.pathname === '/' ? 'translateY(-1px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/') {
                  e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.color = '#27ae60';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/') {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#2c3e50';
                }
              }}
            >
              <i className="fas fa-home" style={{ marginRight: '8px', fontSize: '0.9rem' }}></i>
              Home
            </Link>
            <Link 
              to="/#communities"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== '/') {
                  window.location.href = '/#communities';
                } else {
                  const element = document.getElementById('communities');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              style={{ 
                textDecoration: 'none', 
                color: location.pathname.startsWith('/community') ? '#fff' : '#2c3e50',
                backgroundColor: location.pathname.startsWith('/community') ? '#27ae60' : 'transparent',
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: location.pathname.startsWith('/community') ? '0 4px 15px rgba(39, 174, 96, 0.4)' : 'none',
                transform: location.pathname.startsWith('/community') ? 'translateY(-1px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/community')) {
                  e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.color = '#27ae60';
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/community')) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#2c3e50';
                }
              }}
            >
              <i className="fas fa-users" style={{ marginRight: '8px', fontSize: '0.9rem' }}></i>
              Community
            </Link>
            <Link 
              to="/global-market" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/global-market' ? '#fff' : '#2c3e50',
                backgroundColor: location.pathname === '/global-market' ? '#27ae60' : 'transparent',
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: location.pathname === '/global-market' ? '0 4px 15px rgba(39, 174, 96, 0.4)' : 'none',
                transform: location.pathname === '/global-market' ? 'translateY(-1px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/global-market') {
                  e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.color = '#27ae60';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/global-market') {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#2c3e50';
                }
              }}
            >
              <i className="fas fa-globe" style={{ marginRight: '8px', fontSize: '0.9rem' }}></i>
              Global Market
            </Link>
            <Link 
              to="/top-artisans" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/top-artisans' ? '#fff' : '#2c3e50',
                backgroundColor: location.pathname === '/top-artisans' ? '#27ae60' : 'transparent',
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: location.pathname === '/top-artisans' ? '0 4px 15px rgba(39, 174, 96, 0.4)' : 'none',
                transform: location.pathname === '/top-artisans' ? 'translateY(-1px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/top-artisans') {
                  e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.color = '#27ae60';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/top-artisans') {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#2c3e50';
                }
              }}
            >
              <i className="fas fa-star" style={{ marginRight: '8px', fontSize: '0.9rem' }}></i>
              Top Artisans
            </Link>
          </div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="nav-actions desktop-only" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '8px 12px',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button className="search-btn" style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                color: '#2c3e50'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                e.target.style.color = '#27ae60';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#2c3e50';
              }}>
                <i className="fas fa-search" style={{ fontSize: '1rem' }}></i>
              </button>
              <Link to="/cart" className="cart-btn" style={{ 
                position: 'relative', 
                color: '#2c3e50', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                e.target.style.color = '#27ae60';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#2c3e50';
              }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '1rem' }}></i>
                {getCartCount() > 0 && (
                  <span className="cart-count" style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '3px 6px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    minWidth: '18px',
                    textAlign: 'center',
                    lineHeight: '1',
                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)',
                    border: '2px solid white'
                  }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
            
            <Link to="/cart" className="mobile-cart mobile-only" style={{ 
              position: 'relative', 
              color: '#27ae60', 
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              background: 'rgba(39, 174, 96, 0.1)',
              boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)'
            }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem' }}></i>
              {getCartCount() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '3px 6px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  minWidth: '18px',
                  textAlign: 'center',
                  lineHeight: '1',
                  boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)',
                  border: '2px solid white'
                }}>
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <button 
              className="mobile-menu-icon mobile-only" 
              onClick={() => setIsSideMenuOpen(true)} 
              style={{ 
                background: 'rgba(39, 174, 96, 0.1)',
                border: 'none',
                cursor: 'pointer', 
                fontSize: '1.3rem',
                color: '#27ae60',
                padding: '10px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Side Menu */}
      {isSideMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
            onClick={() => setIsSideMenuOpen(false)}
          />
          
          {/* Side Menu */}
          <div className="side-menu" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            color: '#333',
            padding: 0,
            zIndex: 9999,
            boxShadow: '4px 0 30px rgba(0,0,0,0.15)',
            transform: 'translateX(0)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(39, 174, 96, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
              color: '#fff',
              boxShadow: '0 2px 10px rgba(39, 174, 96, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-leaf" style={{ fontSize: '1.3rem' }}></i>
                <span style={{ fontWeight: '800', fontSize: '1.3rem' }}>Local Roots</span>
              </div>
              <button 
                onClick={() => setIsSideMenuOpen(false)} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  fontSize: '1.2rem',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Navigation Links */}
            <div style={{ padding: '1.5rem 0' }}>
              <Link 
                to="/" 
                onClick={() => setIsSideMenuOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 25px',
                  textDecoration: 'none', 
                  color: location.pathname === '/' ? '#27ae60' : '#2c3e50',
                  borderLeft: location.pathname === '/' ? '4px solid #27ae60' : '4px solid transparent',
                  backgroundColor: location.pathname === '/' ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: location.pathname === '/' ? '600' : '500',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-home" style={{ marginRight: '15px', width: '20px', fontSize: '1.1rem' }}></i>
                Home
              </Link>
              
              <Link 
                to="/#communities" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsSideMenuOpen(false);
                  if (location.pathname !== '/') {
                    window.location.href = '/#communities';
                  } else {
                    const element = document.getElementById('communities');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 25px',
                  textDecoration: 'none', 
                  color: location.pathname.startsWith('/community') ? '#27ae60' : '#2c3e50',
                  borderLeft: location.pathname.startsWith('/community') ? '4px solid #27ae60' : '4px solid transparent',
                  backgroundColor: location.pathname.startsWith('/community') ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: location.pathname.startsWith('/community') ? '600' : '500',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-users" style={{ marginRight: '15px', width: '20px', fontSize: '1.1rem' }}></i>
                Community
              </Link>
              
              <Link 
                to="/global-market" 
                onClick={() => setIsSideMenuOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 25px',
                  textDecoration: 'none', 
                  color: location.pathname === '/global-market' ? '#27ae60' : '#2c3e50',
                  borderLeft: location.pathname === '/global-market' ? '4px solid #27ae60' : '4px solid transparent',
                  backgroundColor: location.pathname === '/global-market' ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: location.pathname === '/global-market' ? '600' : '500',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-globe" style={{ marginRight: '15px', width: '20px', fontSize: '1.1rem' }}></i>
                Global Market
              </Link>
              
              <Link 
                to="/cart" 
                onClick={() => setIsSideMenuOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 25px',
                  textDecoration: 'none', 
                  color: location.pathname === '/cart' ? '#27ae60' : '#2c3e50',
                  borderLeft: location.pathname === '/cart' ? '4px solid #27ae60' : '4px solid transparent',
                  backgroundColor: location.pathname === '/cart' ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  fontWeight: location.pathname === '/cart' ? '600' : '500',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-shopping-cart" style={{ marginRight: '15px', width: '20px', fontSize: '1.1rem' }}></i>
                Cart
                {getCartCount() > 0 && (
                  <span style={{
                    position: 'absolute',
                    right: '25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '3px 7px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    minWidth: '20px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)',
                    border: '2px solid white'
                  }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
              
              <Link 
                to="/add-product" 
                onClick={() => setIsSideMenuOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 25px',
                  textDecoration: 'none', 
                  color: location.pathname === '/add-product' ? '#27ae60' : '#2c3e50',
                  borderLeft: location.pathname === '/add-product' ? '4px solid #27ae60' : '4px solid transparent',
                  backgroundColor: location.pathname === '/add-product' ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: location.pathname === '/add-product' ? '600' : '500',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-plus-circle" style={{ marginRight: '15px', width: '20px', fontSize: '1.1rem' }}></i>
                Sell Products
              </Link>
            </div>
          </div>
        </>
      )}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-only {
              display: none !important;
            }
            .mobile-only {
              display: flex !important;
            }
            .nav-container {
              padding: 0 15px !important;
            }
            .logo {
              font-size: 1.3rem !important;
            }
            .logo i {
              font-size: 1.1rem !important;
            }
            .mobile-menu-icon {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
          }
          
          @media (min-width: 769px) {
            .desktop-only {
              display: flex !important;
            }
            .mobile-only {
              display: none !important;
            }
          }
          
          @media (max-width: 480px) {
            .nav-container {
              padding: 0 10px !important;
            }
            .logo {
              font-size: 1.2rem !important;
            }
          }
          
          @media (max-width: 375px) {
            .logo {
              font-size: 1.1rem !important;
            }
            .side-menu {
              width: 280px !important;
            }
          }
          
          /* Mobile menu animations and hover effects */
          .side-menu a:hover {
            background-color: rgba(39, 174, 96, 0.05) !important;
            transform: translateX(5px) !important;
          }
          
          .mobile-menu-icon:hover {
            color: #27ae60 !important;
          }
          
          /* Prevent body scroll when menu is open */
          body.menu-open {
            overflow: hidden;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
