import React, { useState, useEffect } from 'react';

const images = [
  '/images/community-hero-background.jpg',
  '/images/hero-moving-bg.jpg',
  '/images/hero-moving-bg%203.jpg'
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" style={{
      backgroundImage: `url('${images[currentImageIndex]}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '4rem 2rem',
      color: '#fff',
      textAlign: 'center',
      transition: 'background-image 0.5s ease-in-out',
      marginTop: '-64px'  // Remove gap above hero to fit under navbar
    }}>
      <style>
        {`
          @media (max-width: 768px) {
            .hero {
              padding: 3rem 1.5rem !important;
            }
            .hero h1 {
              font-size: 2rem !important;
            }
            .hero p {
              font-size: 1rem !important;
            }
            .cta-button {
              padding: 0.8rem 1.5rem !important;
              font-size: 1rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero {
              padding: 2rem 1rem !important;
            }
            .hero h1 {
              font-size: 1.8rem !important;
            }
            .hero p {
              font-size: 0.9rem !important;
            }
            .cta-button {
              padding: 0.7rem 1.2rem !important;
              font-size: 0.9rem !important;
            }
          }
          
          @media (max-width: 375px) {
            .hero {
              padding: 1.5rem 0.8rem !important;
            }
            .hero h1 {
              font-size: 1.5rem !important;
            }
          }
        `}
      </style>
      <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Join Our Community</h1>
        <p>Connect with local farmers, artisans, and food enthusiasts</p>
        <button className="cta-button" style={{
          backgroundColor: '#27ae60',
          border: 'none',
          padding: '1rem 2rem',
          color: '#fff',
          fontSize: '1.25rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
