import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEFAULT_COLLECTIONS_HERO } from '../config/siteSettingsTypes';
import { theme } from '../theme/colors';

const HeroContainer = styled(Box)<{ minHeight?: string }>(({ minHeight = '450px' }) => ({
  position: 'relative',
  width: '100%',
  minHeight,
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  '@media (max-width: 768px)': {
    minHeight: '180px',
  },
  '@media (max-width: 414px)': {
    minHeight: '140px',
  },
  '@media (max-width: 375px)': {
    minHeight: '120px',
  },
}));

const BackgroundImage = styled('img')<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: active ? 1 : 0,
  transition: 'opacity 1.5s ease-in-out',
  zIndex: 1,
}));

const ContentOverlay = styled(Box)({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '60px 20px',
  minHeight: 'inherit',
  '@media (max-width: 768px)': {
    padding: '40px 16px',
  },
});

const HeroTitle = styled('h1')({
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: 900,
  marginBottom: '16px',
  color: theme.colors.ui.white,
  letterSpacing: '-0.02em',
  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  '@media (max-width: 768px)': {
    fontSize: '28px',
    marginBottom: '12px',
  },
});

const HeroSubtitle = styled('p')({
  fontSize: '18px',
  opacity: 0.95,
  color: theme.colors.ui.white,
  maxWidth: '700px',
  margin: '0 auto',
  lineHeight: 1.6,
  textShadow: '0 1px 5px rgba(0,0,0,0.3)',
  '@media (max-width: 768px)': {
    fontSize: '16px',
  },
});

interface MovingHeroSectionProps {
  title?: string;
  subtitle?: string;
  minHeight?: string;
  autoSlideInterval?: number;
  heroType?: 'collections' | 'news';
}

export default function MovingHeroSection({ 
  title,
  subtitle,
  minHeight,
  autoSlideInterval,
  heroType
}: MovingHeroSectionProps) {
  const { settings } = useSiteSettings();
  const [currentImage, setCurrentImage] = useState(0);
  
  // Get hero configuration based on type or use props
  let heroConfig;
  if (heroType === 'collections') {
    heroConfig = settings.collectionsHero || DEFAULT_COLLECTIONS_HERO;
  } else if (heroType === 'news') {
    heroConfig = settings.newsHero || { ...DEFAULT_COLLECTIONS_HERO, title: 'Latest News & Stories', subtitle: 'Stay updated with the latest news, success stories, and insights from our global community of artisans and farmers.' };
  } else {
    // Fallback to props for backward compatibility
    heroConfig = {
      title: title || 'Hero Section',
      subtitle: subtitle || '',
      backgroundImages: ['/hero-moving-bg.jpg', '/hero-moving-bg-2.jpg', '/hero-moving-bg-3.jpg'],
      autoSlideInterval: autoSlideInterval || 4000
    };
  }
  
  const movingImages = heroConfig.backgroundImages;
  const interval = heroConfig.autoSlideInterval || 4000;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % movingImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, movingImages.length]);

  return (
    <HeroContainer minHeight={minHeight}>
      {/* Moving background images carousel */}
      {movingImages.map((image, index) => (
        <BackgroundImage
          key={`bg-${index}`}
          src={image}
          alt={`Background ${index + 1}`}
          active={currentImage === index}
        />
      ))}
      
      <ContentOverlay>
        <HeroTitle>{heroConfig.title}</HeroTitle>
        <HeroSubtitle>{heroConfig.subtitle}</HeroSubtitle>
      </ContentOverlay>
    </HeroContainer>
  );
}
