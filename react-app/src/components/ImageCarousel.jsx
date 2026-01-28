import { useState, useEffect, useCallback, useMemo } from 'react';

const ImageCarousel = ({ 
  images = [], 
  autoRotate = true, 
  interval = 5000, 
  height = '500px',
  style = {} // Add default empty object for style prop
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Preload images
  useEffect(() => {
    if (images && images.length > 0) {
      images.forEach(src => {
        if (src) {  // Only try to load if src exists
          const img = new Image();
          img.src = src;
        }
      });
    }
  }, [images]);

  // Ensure we always have at least one image to display
  const displayImages = useMemo(() => {
    if (!images || images.length === 0) {
      console.log('No images provided to carousel');
      return ['/images/community/hero section.jpg']; // Fallback image
    }
    console.log('Carousel images:', images);
    return images;
  }, [images]);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, images.length, isHovered, goToNext]);

  // Reset transition state after animation
  useEffect(() => {
    if (!isTransitioning) return;
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with your CSS transition duration

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Add container styles for better image display
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    ...style // Merge any additional styles passed as props
  };

  if (!displayImages || displayImages.length === 0) {
    // Fallback to a default background if no images are available
    console.log('No images to display in carousel');
    return (
      <div style={{
        height,
        backgroundColor: '#f0f0f0',
        backgroundImage: 'url("/images/community/hero section.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <i className="fas fa-image" style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '20px' }}></i>
          <p style={{ 
            color: '#2c3e50', 
            fontSize: '1.2rem',
            maxWidth: '400px',
            lineHeight: '1.6'
          }}>
            No community images available. Check back soon for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          .carousel-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          
          .carousel-slide.active {
            opacity: 1;
          }
          
          .carousel-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            z-index: 10;
          }
          
          .carousel-nav-btn:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: translateY(-50%) scale(1.1);
          }
          
          .carousel-nav-btn.prev {
            left: 20px;
          }
          
          .carousel-nav-btn.next {
            right: 20px;
          }
          
          .carousel-dots {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 10px;
            z-index: 10;
          }
          
          .carousel-dots .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            border: none;
            cursor: pointer;
            padding: 0;
            transition: all 0.3s ease;
          }
          
          .carousel-dots .dot.active {
            background: white;
            transform: scale(1.2);
          }
          
          @media (max-width: 768px) {
            .carousel-nav-btn {
              width: 40px !important;
              height: 40px !important;
              font-size: 16px !important;
            }
            .carousel-dots .dot {
              width: 10px !important;
              height: 10px !important;
            }
          }
          
          @media (max-width: 480px) {
            .carousel-nav-btn {
              width: 35px !important;
              height: 35px !important;
              font-size: 14px !important;
            }
            .carousel-dots {
              bottom: 10px !important;
            }
            .carousel-dots .dot {
              width: 8px !important;
              height: 8px !important;
            }
          }
        `}
      </style>
      {/* Main Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: index === currentIndex ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              transform: 'scale(1.02)' // Slight zoom effect
            }}
          />
        ))}
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)'
        }} />
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="carousel-nav-btn prev"
              aria-label="Previous slide"
            >
              &larr;
            </button>
            <button
              onClick={goToNext}
              className="carousel-nav-btn next"
              aria-label="Next slide"
            >
              &rarr;
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {displayImages.length > 1 && (
          <div className="carousel-dots">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  transition: 'all 0.3s ease',
                  background: index === currentIndex 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.5)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
