import Hero from '../components/Hero';
import CommunityGrid from '../components/CommunityGrid';

const Home = () => {
  return (
    <>
      <Hero />
      <CommunityGrid />
      {/* Add Product Section below CommunityGrid and before Footer */}
      <section style={{ background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#333', marginBottom: '1rem' }}>Ready to Start Your Global Business?</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          Join thousands of artisans and farmers already selling their products worldwide through our platform
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{
            background: '#2ecc71',
            color: 'white',
            padding: '12px 36px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
            cursor: 'pointer',
            border: 'none'
          }}>Register as Seller</button>
          <button style={{
            background: 'transparent',
            color: '#2ecc71',
            padding: '12px 36px',
            border: '2px solid #2ecc71',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            cursor: 'pointer'
          }}>Learn More</button>
        </div>
      </section>
    </>
  );
};

export default Home;
