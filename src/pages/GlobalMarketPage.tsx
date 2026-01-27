import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import BrowseByInterestPills from '../components/globalMarket/BrowseByInterestPills';
import ProductCarouselSection from '../components/globalMarket/ProductCarouselSection';
import { GIFT_MODE_INTERESTS } from '../data/giftModeInterests';
import PageLayout from '../components/PageLayout';
import { theme } from '../theme/colors';

const GlobalMarketPage = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterestId, setSelectedInterestId] = useState<string>('all');

  // Get category from URL parameter
  const urlCategory = searchParams.get('category');

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

  const selectedInterest = useMemo(() => {
    if (selectedInterestId === 'all') return null;
    return GIFT_MODE_INTERESTS.find((i) => i.id === selectedInterestId) ?? null;
  }, [selectedInterestId]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

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
  }, [allProducts, searchQuery, selectedInterestId]);

  const latestProducts = useMemo(() => {
    return filteredProducts.slice(0, 12);
  }, [filteredProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const pillItems = useMemo(() => {
    return GIFT_MODE_INTERESTS.map((i) => ({ id: i.id, label: i.label }));
  }, []);

  const sectionInterests = useMemo(() => {
    if (selectedInterestId !== 'all') {
      const interest = GIFT_MODE_INTERESTS.find((i) => i.id === selectedInterestId);
      return interest ? [interest] : [];
    }
    // Exclude 'all' from the sections and show first 8 actual categories
    return GIFT_MODE_INTERESTS.filter(i => i.id !== 'all').slice(0, 8);
  }, [selectedInterestId]);

  // Generate curator names and subtitles based on interests
  const getCuratorInfo = (interestId: string) => {
    const curatorMap: Record<string, { name: string; subtitle: string }> = {
      all: { name: 'All Products', subtitle: 'Browse All Categories' },
      agriculture: { name: 'Farmer\'s Choice', subtitle: 'Agricultural Products' },
      'community-success': { name: 'Community Builder', subtitle: 'Success Stories' },
      'platform-updates': { name: 'Platform News', subtitle: 'Latest Updates' },
      marketplace: { name: 'Market Trader', subtitle: 'Marketplace Items' },
      resources: { name: 'Resource Hub', subtitle: 'Helpful Resources' },
      art: { name: 'Art Lover', subtitle: 'Artistic Creations' },
      crafts: { name: 'Craft Master', subtitle: 'Handmade Crafts' },
      food: { name: 'Foodie', subtitle: 'Delicious Food Items' },
      textiles: { name: 'Textile Expert', subtitle: 'Fabric & Textiles' },
      electronics: { name: 'Tech Guru', subtitle: 'Electronic Devices' },
      'health-wellness': { name: 'Wellness Coach', subtitle: 'Health Products' },
      education: { name: 'Educator', subtitle: 'Learning Materials' },
      technology: { name: 'Tech Innovator', subtitle: 'Tech Solutions' },
      fashion: { name: 'Fashionista', subtitle: 'Fashion & Style' },
      'home-garden': { name: 'Home Designer', subtitle: 'Home & Garden' },
      'sports-fitness': { name: 'Athlete', subtitle: 'Sports & Fitness' },
      'beauty-personal-care': { name: 'Beauty Expert', subtitle: 'Beauty & Care' },
      'toys-games': { name: 'Game Master', subtitle: 'Toys & Games' },
      'books-media': { name: 'Bookworm', subtitle: 'Books & Media' },
      automotive: { name: 'Car Expert', subtitle: 'Automotive' },
      'business-services': { name: 'Business Pro', subtitle: 'Business Services' },
      entertainment: { name: 'Entertainer', subtitle: 'Entertainment' },
      'travel-tourism': { name: 'Travel Guide', subtitle: 'Travel & Tourism' },
      'pet-supplies': { name: 'Pet Lover', subtitle: 'Pet Supplies' },
      'office-supplies': { name: 'Office Manager', subtitle: 'Office Supplies' },
      industrial: { name: 'Industrial Pro', subtitle: 'Industrial Products' },
    };

    return curatorMap[interestId] || { name: 'Local Roots', subtitle: 'Curated Collection' };
  };

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <BrowseByInterestPills
          title="Browse by interest for the best gifts!"
          items={pillItems}
          selectedId={selectedInterestId}
          onSelect={(id: string) => setSelectedInterestId(id)}
          showMore={false}
        />

        {/* Search Bar */}
        <div style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '0 20px'
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
              width: '100%',
              maxWidth: '400px',
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
              left: '20px',
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

        <div style={{ background: theme.colors.ui.white, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Only show Latest Products when "All" is selected */}
            {selectedInterestId === 'all' && latestProducts.length > 0 && (
              <ProductCarouselSection
                key="latest"
                curatorName="All Communities"
                curatorLabel="New listings"
                title="Latest products"
                subtitle="Fresh listings from Kendem and all communities"
                products={latestProducts}
                onBrowseAll={() => setSelectedInterestId('all')}
                isWishlisted={isWishlisted}
                onToggleWishlist={(productId) => toggleWishlist(productId)}
                onAddToCart={(product) => handleAddToCart(product)}
              />
            )}

            {(() => {
              const usedProductIds = new Set<number>();
              
              return sectionInterests.map((interest) => {
                const products = filteredProducts
                  .filter((p) => !usedProductIds.has(p.id)) // Only show products not already used
                  .slice(0, 12);

                // Mark these products as used so they don't appear in other sections
                products.forEach(p => usedProductIds.add(p.id));

                if (products.length === 0) return null;

                const curatorInfo = getCuratorInfo(interest.id);

                return (
                  <ProductCarouselSection
                    key={interest.id}
                    curatorName={curatorInfo.name}
                    curatorLabel="Curated by"
                    title={curatorInfo.name}
                    subtitle={curatorInfo.subtitle}
                    products={products}
                    onBrowseAll={() => setSelectedInterestId(interest.id)}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={(productId) => toggleWishlist(productId)}
                    onAddToCart={(product) => handleAddToCart(product)}
                  />
                );
              });
            })()}

            {selectedInterestId !== 'all' && sectionInterests.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                  No products found
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Try selecting a different interest category
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageLayout>
  );
};

export default GlobalMarketPage;
