const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Local Roots</h4>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              Discover authentic products from local communities and support artisans.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/global-market">Global Market</a></li>
              <li><a href="/add-product">Sell Products</a></li>
              <li><a href="/cart">Cart</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:support@localroots.example">support@localroots.example</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms & Privacy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Local Roots Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
