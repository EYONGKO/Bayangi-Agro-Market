import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Button } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { theme } from '../theme/colors';
import CategoriesDropdown from './CategoriesDropdown';

const HeaderWrapper = styled(Box)({
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 1200, // Higher than admin toolbar to ensure it stays on top
  background: '#ffffff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
});

const HeaderMain = styled(Container)({
  maxWidth: '1400px',
  display: 'flex',
  flexDirection: 'row', // Always row for desktop
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 24px', // Reduced from 12px
  gap: '16px', // Reduced from 20px
  '@media (max-width: 1024px)': {
    padding: '6px 20px', // Reduced from 10px
    gap: '14px', // Reduced from 16px
  },
  '@media (max-width: 768px)': {
    display: 'none', // Hide desktop version on mobile
  },
});

// Mobile-only header container
const MobileHeaderMain = styled(Container)({
  maxWidth: '1400px',
  display: 'none', // Hidden by default
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: '12px 16px',
  gap: '12px',
  '@media (max-width: 768px)': {
    display: 'flex', // Show only on mobile
  },
  '@media (max-width: 414px)': {
    padding: '10px 12px',
    gap: '10px',
  },
  '@media (max-width: 375px)': {
    padding: '8px 10px',
    gap: '8px',
  },
});

const Brand = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#0f172a',
  flex: '0 0 auto', // Don't grow or shrink
  '@media (max-width: 768px)': {
    justifyContent: 'flex-start', // Align left on mobile
  },
});

// Mobile-only top row
const MobileHeaderTopRow = styled(Box)({
  display: 'none', // Hidden by default
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  '@media (max-width: 768px)': {
    display: 'flex', // Show only on mobile
  },
});

const CategoriesButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm, // 4px
  textTransform: 'none',
  color: theme.colors.neutral[900],
  backgroundColor: 'transparent',
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, // 6px 10px
  fontSize: theme.fontSizes.sm, // 13px
  fontWeight: '500',
  borderRadius: theme.borderRadius.lg, // 16px
  '&:hover': {
    backgroundColor: theme.colors.primary.background,
  },
  '@media (max-width: 768px)': {
    fontSize: theme.fontSizes.sm, // 12px
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  },
});

const BrandMark = styled('img')({
  width: '120px',
  height: '120px',
  borderRadius: '10px',
  objectFit: 'contain',
  '@media (max-width: 768px)': {
    width: '120px', // Increased from 100px
    height: '120px', // Increased from 100px
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    width: '100px', // Increased from 80px
    height: '100px', // Increased from 80px
  },
  '@media (max-width: 375px)': { // iPhone SE
    width: '90px', // Increased from 70px
    height: '90px', // Increased from 70px
  },
});


const SearchSection = styled(Box)({
  position: 'relative',
  width: '100%',
  flex: '5', // Take up most space on desktop
  margin: '0 16px', // Reduced from 20px
  zIndex: 10, // Ensure search bar stays above other elements when focused
  '@media (max-width: 1024px)': {
    margin: '0 12px', // Reduced from 16px
    flex: '4',
  },
  '@media (max-width: 768px)': {
    display: 'none', // Hide desktop search on mobile
  },
});

// Mobile-only search section
const MobileSearchSection = styled(Box)({
  position: 'relative',
  width: '100%',
  display: 'none', // Hidden by default
  zIndex: 20, // Ensure mobile search stays above other elements
  '@media (max-width: 768px)': {
    display: 'flex', // Show only on mobile
  },
});

const SearchWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
  '@media (max-width: 768px)': {
    backgroundColor: '#f5f5f5',
    borderRadius: '40px',
    padding: '4px',
    maxWidth: '100%', // Full width on mobile
  },
});

const SearchInput = styled('input')({
  width: '100%',
  padding: '8px 16px', // Removed left padding for search icon
  border: '1px solid #d4d4d8',
  borderRadius: '32px', // Reduced from 40px
  fontSize: '14px', // Reduced from 16px
  outline: 'none',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  backgroundColor: '#fafafa',
  textAlign: 'center', // Always center the text
  '&:focus': {
    borderColor: '#222222',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(34, 34, 34, 0.1)',
    textAlign: 'center', // Keep centered even when focused
  },
  '&::placeholder': {
    color: '#737373',
  },
  '@media (max-width: 768px)': {
    padding: '12px 16px', // Mobile: removed left padding for menu icon
    fontSize: '14px',
    backgroundColor: '#ffffff', // White background like focused state
    border: '1px solid #222222', // Dark border like focused state
    boxShadow: '0 0 0 3px rgba(34, 34, 34, 0.1)', // Shadow like focused state
    flex: '1',
    borderRadius: '24px', // Slightly less rounded on mobile
    textAlign: 'center', // Always center on mobile
    '&:focus': {
      textAlign: 'center', // Keep centered when focused on mobile
    },
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    padding: '10px 14px', // Removed left padding
    fontSize: '13px',
    textAlign: 'center',
    '&:focus': {
      textAlign: 'center',
    },
  },
  '@media (max-width: 375px)': { // iPhone SE
    padding: '8px 12px', // Removed left padding
    fontSize: '12px',
    textAlign: 'center',
    '&:focus': {
      textAlign: 'center',
    },
  },
});

const SearchButton = styled('button')({
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`, // 8px 16px
  borderRadius: '32px',
  border: 'none',
  cursor: 'pointer',
  background: theme.colors.primary.main,
  color: theme.colors.ui.white,
  fontWeight: 600,
  fontSize: theme.fontSizes.base, // 14px
  transition: 'all 0.2s ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    background: theme.colors.primary.dark,
    transform: 'translateY(-1px)',
  },
  '@media (max-width: 768px)': {
    padding: theme.spacing.md, // 12px
    fontSize: theme.fontSizes.base,
    borderRadius: theme.borderRadius.full,
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    background: theme.colors.primary.light,
  },
  '@media (max-width: 414px)': {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    padding: theme.spacing.sm, // 10px
  },
});

const SearchIcon = styled(Search)({
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#64748b',
  pointerEvents: 'none',
  zIndex: 1,
  '@media (max-width: 768px)': {
    display: 'flex', // Show search icon on mobile
    left: '50px', // Position after hamburger menu
    color: '#64748b',
  },
});

// Mobile search icon inside input
const MobileSearchIcon = styled(Search)({
  position: 'absolute',
  left: '50px', // After hamburger menu
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#64748b',
  pointerEvents: 'none',
  zIndex: 1,
  display: 'none', // Hidden by default
  '@media (max-width: 768px)': {
    display: 'flex', // Show only on mobile
  },
});

const MobileMenuButtonInSearch = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#222222',
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '@media (max-width: 768px)': {
    display: 'flex',
    minWidth: '36px',
    minHeight: '36px',
  },
});

const HeaderIcons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '0 0 auto', // Don't grow or shrink
  '@media (max-width: 768px)': {
    gap: '6px',
  },
  '@media (max-width: 414px)': {
    gap: '4px', // Smaller gap for very small screens
  },
});

const IconButton = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '4px', // Reduced from 6px
  cursor: 'pointer',
  borderRadius: '6px', // Reduced from 8px
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#222222',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    color: '#000000',
  },
  '@media (max-width: 768px)': {
    padding: '6px', // Keep icons visible on mobile
    minWidth: '36px', // Ensure minimum touch target size
    minHeight: '36px',
  },
  '@media (max-width: 414px)': {
    padding: '4px',
    minWidth: '32px',
    minHeight: '32px',
  },
});

const CartBadge = styled('span')({
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  background: theme.colors.primary.main, // Use primary green
  color: theme.colors.ui.white,
  borderRadius: theme.borderRadius.full,
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.fontSizes.xs,
  fontWeight: 700,
});

const MobileMenuButton = styled('button')({
  background: 'transparent',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  display: 'none', // Hide on desktop
  alignItems: 'center',
  justifyContent: 'center',
  color: '#222222',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '@media (max-width: 768px)': {
    display: 'flex', // Show only on mobile
  },
});

const WishlistBadge = styled('span')({
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  background: theme.colors.primary.light, // Use light green
  color: theme.colors.ui.white,
  borderRadius: theme.borderRadius.full,
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.fontSizes.xs,
  fontWeight: 700,
});

export default function EcommerceHeader() {
  const { mobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { getTotalWishlisted } = useWishlist();
  const { settings } = useSiteSettings();
  const header = settings.header ?? { brandName: 'Bayangi Agro Market', brandMark: 'BAM', searchPlaceholder: 'Search products...' };
  const cartItems = getTotalItems();
  const wishlistCount = getTotalWishlisted();
  const [searchQuery, setSearchQuery] = useState('');

  const handleMobileMenuClick = () => {
    console.log('Mobile menu clicked, current state:', mobileMenuOpen);
    // Scroll to top when opening mobile menu
    if (!mobileMenuOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    toggleMobileMenu();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performUniversalSearch(searchQuery.trim());
    }
  };

  const performUniversalSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for member/user related searches - open profile modal
    if (lowerQuery.includes('member') || lowerQuery.includes('user') || lowerQuery.includes('profile') || lowerQuery.includes('account')) {
      // Open profile modal instead of navigation
      if (window.openProfileModal) {
        window.openProfileModal();
      } else {
        // Fallback to navigation if modal function not available
        navigate('/account');
      }
      return;
    }
    
    // Check for specific communities - open community write section
    const communities = ['kendem', 'mamfe', 'membe', 'widikum', 'fonjo', 'moshie', 'kepoti', 'bamenda', 'buea', 'douala', 'yaoundé', 'kumba', 'limbe'];
    
    if (communities.includes(lowerQuery)) {
      // Open community write section modal
      if (window.openCommunityWriteModal) {
        window.openCommunityWriteModal(lowerQuery);
      } else {
        // Fallback to navigation if modal function not available
        navigate(`/community/${lowerQuery}`);
      }
      return;
    }
    
    // Check for admin related searches
    if (lowerQuery.includes('admin') || lowerQuery.includes('dashboard') || lowerQuery.includes('manage')) {
      navigate('/admin/dashboard');
      return;
    }
    
    // Check for order related searches
    if (lowerQuery.includes('order') || lowerQuery.includes('purchase') || lowerQuery.includes('buy')) {
      navigate('/admin/orders');
      return;
    }
    
    // Check for cart related searches
    if (lowerQuery.includes('cart') || lowerQuery.includes('shopping') || lowerQuery.includes('checkout')) {
      navigate('/cart');
      return;
    }
    
    // Check for wishlist related searches
    if (lowerQuery.includes('wishlist') || lowerQuery.includes('favorite') || lowerQuery.includes('save')) {
      navigate('/wishlist');
      return;
    }
    
    // Check for chat related searches
    if (lowerQuery.includes('chat') || lowerQuery.includes('message') || lowerQuery.includes('contact')) {
      navigate('/chat');
      return;
    }
    
    // Check for add product related searches
    if (lowerQuery.includes('add') || lowerQuery.includes('create') || lowerQuery.includes('new') || lowerQuery.includes('sell')) {
      navigate('/add-product');
      return;
    }
    
    // Check for artisans related searches
    if (lowerQuery.includes('artisan') || lowerQuery.includes('seller') || lowerQuery.includes('vendor')) {
      navigate('/top-artisans');
      return;
    }
    
    // Check for news related searches
    if (lowerQuery.includes('news') || lowerQuery.includes('blog') || lowerQuery.includes('article')) {
      navigate('/news');
      return;
    }
    
    // Default to global market search
    navigate(`/global-market?search=${encodeURIComponent(query)}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <HeaderWrapper>
      {/* Desktop Version */}
      <HeaderMain>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px',
          flex: '0 0 auto',
        }}>
          <Brand to="/">
            <BrandMark src="/Bayangi agro marke logot.png" alt="Bayangi Agro Market Logo" />
          </Brand>
          <CategoriesDropdown />
        </Box>

        <SearchSection>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <SearchInput 
              type="search" 
              placeholder={header.searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <SearchButton type="submit">
              <Search size={18} />
            </SearchButton>
          </form>
        </SearchSection>

        <HeaderIcons>
          <MobileMenuButton
            onClick={handleMobileMenuClick}
            aria-label="Toggle menu"
          >
            <MenuIcon size={24} />
          </MobileMenuButton>
          <IconButton aria-label="User account" onClick={() => navigate('/account')}>
            <User size={20} />
          </IconButton>
          <IconButton aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <Heart size={20} />
            {wishlistCount > 0 && (
              <WishlistBadge>{wishlistCount}</WishlistBadge>
            )}
          </IconButton>
          <IconButton aria-label="Shopping cart" onClick={() => navigate('/cart')}>
            <ShoppingBag size={20} color={theme.colors.primary.main} />
            {cartItems > 0 && (
              <CartBadge>{cartItems}</CartBadge>
            )}
          </IconButton>
        </HeaderIcons>
      </HeaderMain>

      {/* Mobile Version */}
      <MobileHeaderMain>
        {/* Mobile top row: Logo and icons */}
        <MobileHeaderTopRow>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', // Balanced gap for mobile
            flex: '0 0 auto',
          }}>
            <Brand to="/">
              <BrandMark src="/Bayangi agro marke logot.png" alt="Bayangi Agro Market Logo" />
            </Brand>
            <CategoriesDropdown />
          </Box>

          <HeaderIcons>
            <IconButton aria-label="User account" onClick={() => navigate('/account')}>
              <User size={20} />
            </IconButton>
            <IconButton aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <WishlistBadge>{wishlistCount}</WishlistBadge>
              )}
            </IconButton>
            <IconButton aria-label="Shopping cart" onClick={() => navigate('/cart')}>
              <ShoppingBag size={20} color={theme.colors.primary.main} />
              {cartItems > 0 && (
                <CartBadge>{cartItems}</CartBadge>
              )}
            </IconButton>
          </HeaderIcons>
        </MobileHeaderTopRow>

        {/* Mobile bottom row: Search bar */}
        <MobileSearchSection>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <MobileMenuButtonInSearch
              onClick={handleMobileMenuClick}
              aria-label="Toggle menu"
              type="button"
            >
              <MenuIcon size={20} />
            </MobileMenuButtonInSearch>
            <SearchInput 
              type="search" 
              placeholder={header.searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <SearchButton type="submit">
              <Search size={18} />
            </SearchButton>
          </form>
        </MobileSearchSection>
      </MobileHeaderMain>
    </HeaderWrapper>
  );
}
