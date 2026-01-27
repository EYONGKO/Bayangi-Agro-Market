import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { theme } from '../../theme/colors';

type Props = {
  title: string;
  cartCount: number;
  wishlistCount: number;
  onBack: () => void;
  onGoToCart: () => void;
  onGoToWishlist: () => void;
};

const GlobalMarketHeader = ({ title, cartCount, wishlistCount, onBack, onGoToCart, onGoToWishlist }: Props) => {
  return (
    <div
      className="global-market-header"
      style={{
        background: 'white',
        padding: '10px 16px', // Reduced padding
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #e9ecef'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px', // Reduced border radius
            padding: '8px', // Reduced padding
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={20} color={theme.colors.neutral[900]} /> // Reduced icon size
        </button>

        <div className="header-title" style={{ fontSize: '16px', fontWeight: 700, color: theme.colors.neutral[900] }}>{title}</div> // Reduced font size and weight

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}> // Reduced gap
          <button
            onClick={onGoToWishlist}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px', // Reduced border radius
              padding: '8px', // Reduced padding
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Wishlist"
          >
            <Heart className="header-icon" size={20} color={theme.colors.primary.main} /> // Reduced icon size
            {wishlistCount > 0 && (
              <span
                className="badge"
                style={{
                  position: 'absolute',
                  top: '3px', // Adjusted position
                  right: '3px', // Adjusted position
                  background: theme.colors.primary.main,
                  color: 'white',
                  borderRadius: '999px',
                  minWidth: '16px', // Reduced size
                  height: '16px', // Reduced size
                  padding: '0 4px', // Reduced padding
                  fontSize: '10px', // Reduced font size
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onGoToCart}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px', // Reduced border radius
              padding: '8px', // Reduced padding
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Cart"
          >
            <ShoppingCart className="header-icon" size={20} color={theme.colors.neutral[900]} /> // Reduced icon size
            {cartCount > 0 && (
              <span
                className="badge"
                style={{
                  position: 'absolute',
                  top: '3px', // Adjusted position
                  right: '3px', // Adjusted position
                  background: theme.colors.primary.light,
                  color: 'white',
                  borderRadius: '999px',
                  minWidth: '16px', // Reduced size
                  height: '16px', // Reduced size
                  padding: '0 4px', // Reduced padding
                  fontSize: '10px', // Reduced font size
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketHeader;
