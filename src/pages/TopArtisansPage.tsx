import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Search, Star, MapPin, Award, RefreshCw } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { theme } from '../theme/colors';
import ArtisanProfileModal from '../components/ArtisanProfileModal';

// API_BASE for consistent endpoint usage
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://bayangi-agro-market-backend-production.up.railway.app';

// API types
interface ArtisanStats {
  totalProducts: number;
  avgRating: number;
  totalLikes: number;
  reviews: number;
}

interface Artisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  community: string;
  specialty: string;
  role: string;
  verifiedSeller: boolean;
  avatar: string;
  bio: string;
  createdAt: string;
  stats: ArtisanStats;
}

const TopArtisansPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId?: string }>();
  
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'top-rated' | 'most-sold'>('top-rated');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load artisans from backend API on component mount and set up periodic refresh
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        console.log('Fetching artisans from:', `${API_BASE}/api/artisans`);
        
        const response = await fetch(`${API_BASE}/api/artisans`);
        if (response.ok) {
          const data = await response.json();
          console.log('Artisans data received:', data);
          setArtisans(data);
        } else {
          console.error('Failed to fetch artisans:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching artisans:', error);
      }
    };

    // Initial fetch
    fetchArtisans();
    
    // Set up periodic refresh every 10 seconds for more responsive updates
    const interval = setInterval(fetchArtisans, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for artisans updates from admin panel (for real-time updates)
  useEffect(() => {
    const handleArtisansUpdate = (event: CustomEvent) => {
      console.log('Received artisansUpdated event:', event.detail);
      setArtisans(event.detail);
    };

    window.addEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    
    return () => {
      window.removeEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    };
  }, []);

  const filteredArtisans = useMemo(() => {
    let filtered = [...artisans];
    
    // Filter by community if specified
    if (communityId) {
      filtered = filtered.filter(artisan => artisan.community.toLowerCase() === communityId.toLowerCase());
    }
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(artisan => 
        artisan.name.toLowerCase().includes(query.toLowerCase()) ||
        artisan.specialty.toLowerCase().includes(query.toLowerCase()) ||
        artisan.community.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by selected filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(artisan => artisan.specialty === selectedFilter);
    }
    
    // Sort artisans
    filtered.sort((a, b) => {
      if (sortBy === 'top-rated') {
        return (b.stats?.avgRating || 0) - (a.stats?.avgRating || 0);
      } else {
        return (b.stats?.totalProducts || 0) - (a.stats?.totalProducts || 0);
      }
    });
    
    return filtered;
  }, [artisans, communityId, query, selectedFilter, sortBy]);

  const communities = useMemo(() => {
    const base = new Set<string>();
    artisans.forEach((a) => base.add(a.community));
    return ['All', ...Array.from(base)];
  }, [artisans]);

  const specialties = useMemo(() => {
    const base = new Set<string>();
    artisans.forEach((a) => base.add(a.specialty));
    return ['All', ...Array.from(base)];
  }, [artisans]);

  const handleViewProfile = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
    setProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
    setSelectedArtisan(null);
  };

  const handleRefresh = async () => {
    try {
      // Use production URL for deployed app, localhost for development
      const isProduction = window.location.hostname !== 'localhost';
      const apiUrl = isProduction 
        ? 'https://bayangi-agro-market-backend-production.up.railway.app/api/artisans'
        : 'http://localhost:3001/api/artisans';
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setArtisans(data);
        console.log('Manually refreshed artisans data');
      }
    } catch (error) {
      console.error('Error refreshing artisans:', error);
    }
  };

  const handleTestEvent = () => {
    console.log('Testing event dispatch...');
    window.dispatchEvent(new CustomEvent('artisansUpdated', { 
      detail: [
        {
          id: 'test-1',
          name: 'Test Artisan',
          email: 'test@example.com',
          phone: '+1234567890',
          community: 'Test Community',
          specialty: 'Test Specialty',
          role: 'seller',
          verifiedSeller: true,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6cd?w=400&h=400&fit=crop&crop=face&auto=format',
          bio: 'Test bio',
          createdAt: new Date().toISOString(),
          stats: {
            totalProducts: 5,
            avgRating: 4.5,
            totalLikes: 25,
            reviews: 8
          }
        }
      ]
    }));
  };

  const toCommunityId = (community: string) =>
    community
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Top Artisans</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleTestEvent}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Test Event
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search artisans..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Community Filter */}
              <select
                value={communityId || 'All'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'All') {
                    navigate('/top-artisans');
                  } else {
                    navigate(`/top-artisans/${toCommunityId(value)}`);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {communities.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>

              {/* Specialty Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Sort by:</span>
              <button
                onClick={() => setSortBy('top-rated')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'top-rated'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setSortBy('most-sold')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'most-sold'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Sold
              </button>
            </div>
          </div>

          {/* Artisans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtisans.map((artisan) => (
              <div key={artisan.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Large Profile Image Section */}
                <div className="relative h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                    {/* Profile Image */}
                    {artisan.avatar ? (
                      <img 
                        src={artisan.avatar.startsWith('http') 
                          ? artisan.avatar 
                          : `http://localhost:3001${artisan.avatar}`
                        } 
                        alt={artisan.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{artisan.name.charAt(0)}</span>
                      </div>
                    )}
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{artisan.name}</h3>
                            <div className="flex items-center gap-2 text-white/90">
                              <MapPin size={14} />
                              <span className="text-sm">{artisan.community}</span>
                            </div>
                          </div>
                          
                          {/* Verified Badge */}
                          {artisan.verifiedSeller && (
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Award size={12} />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    {/* Specialty and Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {artisan.specialty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{artisan.stats?.avgRating || 0}</span>
                        <span className="text-gray-500 text-sm">({artisan.stats?.reviews || 0})</span>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {artisan.bio}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {artisan.stats?.totalProducts || 0}
                        </div>
                        <div className="text-xs text-gray-500">Products</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {artisan.stats?.reviews || 0}
                        </div>
                        <div className="text-xs text-gray-500">Reviews</div>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>{artisan.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>{artisan.phone}</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      onClick={() => handleViewProfile(artisan)}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      View Artisan Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArtisans.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No artisans found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
          
          {/* Artisan Profile Modal */}
          <ArtisanProfileModal 
            artisan={selectedArtisan ? {
              ...selectedArtisan,
              rating: selectedArtisan.stats?.avgRating || 0,
              reviews: selectedArtisan.stats?.reviews || 0,
              verified: selectedArtisan.verifiedSeller,
              joinedDate: selectedArtisan.createdAt,
              totalSales: (selectedArtisan.stats?.totalProducts || 0) * 1000 // Estimate sales
            } : null}
            open={profileModalOpen}
            onClose={handleCloseProfile}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default TopArtisansPage;
