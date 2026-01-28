import { Link } from 'react-router-dom';
import { communitiesData } from '../config/communities';

const CommunityGrid = () => {

  return (
    <section id="communities" className="select-community">
      <div className="container">
        <h2>Select Your Community</h2>
        <p>Each community has its own unique global marketplace showcasing local artisans, farmers, and their authentic products</p>
        <div className="community-grid">
          {communitiesData.map(community => (
            <div key={community.id} className="community-card" style={{ backgroundImage: `url('/images/community/${community.slug}-hero.jpg')` }}>
              <Link to={`/community/${community.slug}`} className="community-link">
                <div className="community-content">
                  <h3>Explore {community.displayName}</h3>
                  <p className="community-description">{community.description}</p>
                  <div className="community-stats-overview">
                    <div className="stat-item-small">
                      <i className="fas fa-store"></i>
                      <p>50+ Vendors</p>
                    </div>
                    <div className="stat-item-small">
                      <i className="fas fa-box"></i>
                      <p>100+ Products</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGrid;
