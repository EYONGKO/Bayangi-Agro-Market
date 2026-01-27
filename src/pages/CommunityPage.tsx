import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import { listCommunities, type CommunityRecord } from '../api/adminApi';
import PageLayout from '../components/PageLayout';
import ProductMiniCard from '../components/globalMarket/ProductMiniCard';
import BrowseByInterestPills from '../components/globalMarket/BrowseByInterestPills';
import { GIFT_MODE_INTERESTS } from '../data/giftModeInterests';
import { theme } from '../theme/colors';

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [selectedInterestId, setSelectedInterestId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCommunity, setCurrentCommunity] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Default community data for fallback
  const defaultCommunities = [
    {
      id: 'kendem',
      name: 'Kendem',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/kendem-hero.jpg',
      vendorCount: 60,
      productCount: 100
    },
    {
      id: 'mamfe',
      name: 'Mamfe',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/mamfe-hero.jpg',
      vendorCount: 50,
      productCount: 100
    },
    {
      id: 'membe',
      name: 'Membe',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/membe-hero.jpg',
      vendorCount: 50,
      productCount: 100
    },
    {
      id: 'widikum',
      name: 'Widikum',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/widikum-hero.jpg',
      vendorCount: 50,
      productCount: 100
    },
    {
      id: 'fonjo',
      name: 'Fonjo',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/fonjo-hero.jpg',
      vendorCount: 50,
      productCount: 100
    },
    {
      id: 'moshie-kekpoti',
      name: 'Moshie/Kekpoti',
      description: 'Discover unique products and support local artisans.',
      heroImage: '/moshie-kekpoti-hero.jpg',
      vendorCount: 50,
      productCount: 100
    }
  ];

  // Load community data from API
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const apiCommunities = await listCommunities();
        
        // Find the community from API
        const community = apiCommunities.find(c => c.slug === id);
        
        if (community) {
          // Use API community with fallback data
          const fallbackData = defaultCommunities.find(dc => dc.id === id);
          setCurrentCommunity({
            id: community.slug,
            name: community.name,
            description: community.description || fallbackData?.description || 'Discover unique products and support local artisans.',
            heroImage: community.image || fallbackData?.heroImage || '/default-community.jpg',
            vendorCount: fallbackData?.vendorCount || 50,
            productCount: fallbackData?.productCount || 100
          });
        } else {
          // Fallback to default community
          const fallbackCommunity = defaultCommunities.find(dc => dc.id === id);
          setCurrentCommunity(fallbackCommunity || null);
        }
      } catch (error) {
        console.error('Error loading community:', error);
        // Fallback to default community
        const fallbackCommunity = defaultCommunities.find(dc => dc.id === id);
        setCurrentCommunity(fallbackCommunity || null);
      }
    };

    loadCommunity();
    
    // Refresh community data every 30 seconds
    const interval = setInterval(loadCommunity, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  const communityName = currentCommunity?.name || (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Community');
  const heroImage = currentCommunity?.heroImage || '/hero-moving-bg.jpg';

  const communityId = id || 'kendem';

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = () => {
      fetchAllProducts()
        .then((data) => {
          setAllProducts(data);
        })
        .catch(() => {
          setAllProducts([]);
        });
    };
    loadProducts();
    const unsubscribe = subscribeProductsChanged(() => loadProducts());
    return unsubscribe;
  }, []);

  const communityProducts = useMemo(() => {
    return allProducts.filter((p) => (p.community ?? '').toLowerCase() === communityId.toLowerCase());
  }, [allProducts, communityId]);

  // Create pill items for BrowseByInterestPills
  const pillItems = useMemo(() => {
    return GIFT_MODE_INTERESTS.map((i) => ({ id: i.id, label: i.label }));
  }, []);

  // Filter community products based on selected interest and search
  const filteredCommunityProducts = useMemo(() => {
    let filtered = communityProducts;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected interest
    if (selectedInterestId !== 'all') {
      const interest = GIFT_MODE_INTERESTS.find((i) => i.id === selectedInterestId);
      if (interest) {
        filtered = filtered.filter((product) => 
          interest.categories.includes(product.category)
        );
      }
    }

    return filtered;
  }, [communityProducts, searchQuery, selectedInterestId]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        {/* Main Content */}
      <div style={{ paddingTop: '0px' }}>
        {/* Hero Section with Community Background */}
        <section style={{
          minHeight: '400px',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              marginBottom: '20px',
              color: theme.colors.ui.white,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Welcome to {communityName}
            </h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              marginBottom: '30px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              lineHeight: '1.6'
            }}>
              {currentCommunity?.description || 'Discover unique products and support local artisans.'}
            </p>

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => scrollToSection('community-section')}
                style={{
                  background: theme.colors.primary.main,
                  color: theme.colors.ui.white,
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: `0 4px 6px ${theme.colors.ui.shadow}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Shop Market
              </button>
              <Link
                to={`/top-artisans/${id}`}
                style={{
                  background: theme.colors.ui.white,
                  color: theme.colors.neutral[900],
                  textDecoration: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                  boxShadow: `0 4px 6px ${theme.colors.ui.shadow}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Top Artisans
              </Link>
            </div>

            <div style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '30px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '5px', color: theme.colors.ui.white }}>
                  {currentCommunity?.vendorCount || 50}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Local Vendors</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '5px', color: theme.colors.ui.white }}>
                  {currentCommunity?.productCount || 100}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Products</div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Market Section */}
        <section id="community-section" style={{ 
          padding: '40px 20px', 
          background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}20% 100%)`,
          minHeight: '300px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              textAlign: 'center',
              marginBottom: '15px',
              color: theme.colors.neutral[900],
              fontWeight: '700'
            }}>
              {communityName} Market
            </h2>
            <p style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              textAlign: 'center',
              color: theme.colors.neutral[600],
              maxWidth: '500px',
              margin: '0 auto 30px',
              lineHeight: '1.5'
            }}>
              Explore authentic products from {communityName} community vendors and artisans.
            </p>

            {/* Browse By Interest Pills - Same as Global Market */}
            <BrowseByInterestPills
              title={`Browse ${communityName} by interest`}
              items={pillItems}
              selectedId={selectedInterestId}
              onSelect={(id: string) => setSelectedInterestId(id)}
              showMore={false}
            />

            {/* Local Search Bar */}
            <div style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px 40px 12px 40px',
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: '25px',
                  fontSize: '14px',
                  width: '280px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  background: theme.colors.ui.white,
                  color: theme.colors.neutral[700]
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary.main;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.neutral[200];
                }}
              />
              <svg 
                style={{
                  position: 'absolute',
                  left: '12px',
                  pointerEvents: 'none'
                }}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#999999" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            {/* Community Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '20px',
              marginTop: '40px',
              justifyItems: 'center'
            }}>
              {filteredCommunityProducts.map((product) => (
                <ProductMiniCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onAddToCart={() => addToCart(product)}
                  style={{ 
                    width: '100%', 
                    maxWidth: '340px'
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer is provided by PageLayout */}
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
