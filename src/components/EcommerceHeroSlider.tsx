import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEFAULT_HERO_SLIDES, DEFAULT_HERO_BACKGROUND_IMAGES } from '../config/siteSettingsTypes';
import { theme } from '../theme/colors';

const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  minHeight: '450px', // Increased from 400px
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`, // Use theme colors
  '@media (max-width: 768px)': {
    minHeight: '180px', // Reduced from 220px
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    minHeight: '140px', // Reduced from 180px
  },
  '@media (max-width: 375px)': { // iPhone SE
    minHeight: '120px', // Reduced from 160px
  },
});


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

const SlideWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  alignItems: 'center',
  minHeight: '450px', // Increased from 400px
  '@media (max-width: 968px)': {
    gridTemplateColumns: '1fr',
    minHeight: '400px', // Increased from 450px
  },
  '@media (max-width: 768px)': {
    minHeight: '180px', // Reduced from 220px
    position: 'relative', // Ensure relative positioning for absolute children
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const ContentArea = styled(Box)({
  padding: '60px 40px 80px', // Increased from 50px 40px 70px
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  zIndex: 3,
  position: 'relative',
  '@media (max-width: 968px)': {
    padding: '35px 20px 25px', // Increased from 30px 20px 20px
    order: 1,
  },
  '@media (max-width: 768px)': {
    padding: '20px 16px 12px', // Reduced from 25px 16px 16px
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    padding: '16px 12px 10px', // Reduced from 20px 12px 12px
  },
  '@media (max-width: 375px)': { // iPhone SE
    padding: '12px 10px 8px', // Reduced from 16px 10px 10px
  },
});

const ImageArea = styled(Box)({
  position: 'relative',
  height: '100%',
  minHeight: '450px', // Increased from 400px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  '@media (max-width: 968px)': {
    minHeight: '300px', // Increased from 250px
    order: 0,
  },
  '@media (max-width: 768px)': {
    minHeight: '180px', // Reduced from 220px
    position: 'relative', // Ensure relative positioning for absolute children
    justifyContent: 'flex-start', // Allow absolute positioning to work
    alignItems: 'flex-start',
    width: '100%',
  },
});

const Image = styled('img')<{ active: boolean }>(({ active }) => ({
  width: '80%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'right center',
  opacity: active ? 1 : 0,
  transition: 'opacity 1.5s ease-in-out',
  position: 'absolute',
  top: 0,
  right: '-50px',
  background: 'transparent',
  mixBlendMode: 'multiply',
  filter: 'contrast(2) brightness(1.2)',
  zIndex: 10, // Higher z-index to appear above other elements
  '@media (max-width: 968px)': {
    width: '60%',
    right: '0',
    objectPosition: 'center',
  },
  '@media (max-width: 768px)': {
    display: 'none', // Hide original image on mobile
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    display: 'none', // Hide original image on mobile
  },
  '@media (max-width: 375px)': { // iPhone SE
    display: 'none', // Hide original image on mobile
  },
}));

const SmallLabel = styled('div')({
  fontSize: '13px',
  fontWeight: 900,
  color: theme.colors.ui.white, // White text for readability
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '12px',
  '@media (max-width: 768px)': {
    fontSize: '11px',
    marginBottom: '8px',
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    fontSize: '10px',
    marginBottom: '6px',
  },
  '@media (max-width: 375px)': { // iPhone SE
    fontSize: '9px',
    marginBottom: '4px',
  },
});

const MainTitle = styled('h1')({
  fontSize: 'clamp(36px, 5vw, 52px)', // Increased from 32px, 4.5vw, 48px
  fontWeight: 900,
  lineHeight: 1.1,
  marginBottom: '20px', // Increased from 18px
  color: theme.colors.ui.white, // White text for readability
  letterSpacing: '-0.02em',
  '@media (max-width: 768px)': {
    fontSize: '28px', // Increased from 26px
    marginBottom: '16px', // Increased from 14px
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    fontSize: '24px', // Increased from 22px
    marginBottom: '14px', // Increased from 12px
  },
  '@media (max-width: 375px)': { // iPhone SE
    fontSize: '22px', // Increased from 20px
    marginBottom: '12px', // Increased from 10px
  },
});

const Description = styled('p')({
  fontSize: '16px', // Increased from 15px
  lineHeight: 1.75,
  marginBottom: '32px', // Increased from 28px
  color: theme.colors.ui.white, // White text for readability
  maxWidth: '560px', // Increased from 520px
  '@media (max-width: 768px)': {
    fontSize: '15px', // Increased from 14px
    marginBottom: '24px', // Increased from 22px
  },
  '@media (max-width: 414px)': { // iPhone 6/7/8
    fontSize: '14px', // Increased from 13px
    marginBottom: '20px', // Increased from 18px
    maxWidth: '100%',
  },
  '@media (max-width: 375px)': { // iPhone SE
    fontSize: '13px', // Increased from 12px
    marginBottom: '16px', // Increased from 14px
    maxWidth: '100%',
  },
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  '@media (max-width: 768px)': {
    gap: '16px',
  },
});

const ShopButton = styled('button')({
  background: theme.colors.primary.main, // Use primary green from theme
  color: theme.colors.ui.white,
  border: 'none',
  padding: '14px 32px', // Increased from 13px 30px
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '16px', // Increased from 15px
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 12px ${theme.colors.primary.main}66`, // Use theme color with alpha
  '&:hover': {
    background: theme.colors.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 16px ${theme.colors.primary.main}88`, // Use theme color with alpha
  },
  '@media (max-width: 768px)': {
    padding: '12px 24px', // Increased from 11px 22px
    fontSize: '15px', // Increased from 14px
  },
});

const Controls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
});

const NavArrow = styled('button')({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#1e293b',
  },
  '@media (max-width: 768px)': {
    padding: '2px',
  },
});

const Dot = styled('button')<{ active: boolean }>(({ active }) => ({
  width: active ? '40px' : '12px',
  height: '12px',
  borderRadius: '6px',
  border: 'none',
  background: active ? '#1e293b' : '#cbd5e1',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active ? '#1e293b' : '#94a3b8',
  },
}));

const SlideNavButtons = styled(Box)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0 20px',
  pointerEvents: 'none',
  '@media (max-width: 968px)': {
    display: 'none',
  },
});

const SlideNavButton = styled('button')({
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#1e293b',
  transition: 'all 0.3s ease',
  pointerEvents: 'all',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
});

const ContentContainer = styled(Box)({
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
  height: '100%',
  position: 'relative',
});

interface EcommerceHeroSliderProps {
  /** Override slides from settings (e.g. for preview). */
  slides?: typeof DEFAULT_HERO_SLIDES;
}

export default function EcommerceHeroSlider({ slides: slidesProp }: EcommerceHeroSliderProps = {}) {
  const { settings } = useSiteSettings();
  const slides = slidesProp ?? settings.heroSlides ?? DEFAULT_HERO_SLIDES;
  const autoSlideInterval = 4000; // Changed to 4 seconds
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  // Get background images from settings or use defaults
  const movingImages = settings.heroBackgroundImages || DEFAULT_HERO_BACKGROUND_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movingImages.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [autoSlideInterval, movingImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SliderContainer>
      {/* Moving background images carousel */}
      {movingImages.map((image, index) => (
        <BackgroundImage
          key={`bg-${index}`}
          src={image}
          alt={`Background ${index + 1}`}
          active={currentSlide === index}
        />
      ))}
      
      <ContentContainer>
        <SlideWrapper>
          <ContentArea>
            <SmallLabel>{currentSlideData.smallLabel}</SmallLabel>
            <MainTitle>{currentSlideData.title}</MainTitle>
            <Description>{currentSlideData.description}</Description>
            <ButtonContainer>
              <ShopButton
                onClick={() => navigate(currentSlideData.link || '/global-market')}
              >
                {currentSlideData.buttonText || 'Shop Now'}
              </ShopButton>
              <Controls>
                <NavArrow onClick={prevSlide} aria-label="Previous slide">
                  <ChevronLeft size={20} />
                </NavArrow>
                {slides.map((_, index) => (
                  <Dot
                    key={index}
                    active={currentSlide === index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
                <NavArrow onClick={nextSlide} aria-label="Next slide">
                  <ChevronRight size={20} />
                </NavArrow>
              </Controls>
            </ButtonContainer>
          </ContentArea>

          <ImageArea>
            {slides.map((slide, index) => (
              <Image
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                active={currentSlide === index}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            ))}
          </ImageArea>
          
          {/* Mobile positioning image - positioned relative to SlideWrapper */}
          <Box sx={{
            position: 'absolute',
            right: '-40px',
            bottom: '0px',
            width: '180px',
            height: '180px',
            zIndex: 1, // Lower z-index to go behind navigation
            display: { xs: 'block', sm: 'none' }, // Only show on mobile
          }}>
            <img
              src={slides[0]?.image || '/hero person management.png'}
              alt="Mobile Hero Image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          </Box>
        </SlideWrapper>

        <SlideNavButtons>
          <SlideNavButton onClick={prevSlide} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </SlideNavButton>
          <SlideNavButton onClick={nextSlide} aria-label="Next slide">
            <ChevronRight size={24} />
          </SlideNavButton>
        </SlideNavButtons>
      </ContentContainer>
    </SliderContainer>
  );
}
