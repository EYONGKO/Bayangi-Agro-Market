import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { Package, TrendingUp } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEFAULT_COLLECTIONS } from '../config/siteSettingsTypes';
import type { Collection } from '../config/siteSettingsTypes';
import PageLayout from '../components/PageLayout';
import MovingHeroSection from '../components/MovingHeroSection';
import { theme } from '../theme/colors';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`,
  paddingBottom: '80px',
});


const ContentContainer = styled(Container)({
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
  boxSizing: 'border-box',
});

const FilterBar = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '40px',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  overflowX: 'auto',
  padding: '0 20px',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#a8a8a8',
  },
  '@media (max-width: 768px)': {
    padding: '0 16px',
    gap: '8px',
  },
});

const FilterButton = styled('button')<{ active?: boolean }>(({ active }) => ({
  padding: '10px 20px',
  borderRadius: '999px',
  border: active ? 'none' : `2px solid ${theme.colors.neutral[200]}`,
  background: active ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.ui.white,
  color: active ? theme.colors.ui.white : theme.colors.neutral[600],
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: active ? `0 4px 12px ${theme.colors.primary.light}40%` : `0 2px 8px ${theme.colors.ui.shadow}`,
  },
  '@media (max-width: 768px)': {
    padding: '8px 16px',
    fontSize: '13px',
  },
}));

const CollectionsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '30px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const CollectionCard = styled(Box)({
  background: theme.colors.ui.white,
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: `0 4px 20px ${theme.colors.ui.shadow}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 40px ${theme.colors.ui.shadow}`,
  },
});

const CollectionImage = styled('div')<{ image: string }>(({ image }) => ({
  height: '200px',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
}));

const CollectionOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '20px',
});

const CollectionBadge = styled('div')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  padding: '6px 14px',
  borderRadius: '999px',
  background: `${theme.colors.primary.main}e6`,
  fontSize: '11px',
  fontWeight: 800,
  color: theme.colors.ui.white,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const CollectionContent = styled(Box)({
  padding: '24px',
});

const CollectionTitle = styled('h3')({
  fontSize: '20px',
  fontWeight: 800,
  color: theme.colors.neutral[900],
  marginBottom: '8px',
  lineHeight: 1.3,
});

const CollectionDescription = styled('p')({
  fontSize: '14px',
  color: theme.colors.neutral[600],
  lineHeight: 1.6,
  marginBottom: '16px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const CollectionStats = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  paddingTop: '16px',
  borderTop: `1px solid ${theme.colors.neutral[200]}`,
});

const StatItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: theme.colors.neutral[600],
});

const BrowseButton = styled('button')({
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  color: theme.colors.ui.white,
  fontWeight: 800,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginTop: '16px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.colors.primary.light}40%`,
  },
});

const categories = ['All', 'Crafts', 'Agriculture', 'Textiles', 'Home', 'Fashion', 'Food', 'Gifts'];

export default function AllCollectionsPage() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const collections = settings.collections || DEFAULT_COLLECTIONS;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCollections = selectedCategory === 'All'
    ? collections
    : collections.filter(collection => collection.category === selectedCategory);

  return (
    <PageLayout>
      <PageWrapper>
        <MovingHeroSection heroType="collections" />

        <ContentContainer maxWidth={false} disableGutters>
          <FilterBar>
            {categories.map((category) => (
              <FilterButton
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterBar>

          <CollectionsGrid>
            {filteredCollections.map((collection) => (
              <CollectionCard key={collection.id} onClick={() => navigate('/global-market')}>
                <CollectionImage image={collection.image}>
                  {collection.featured && <CollectionBadge>Featured</CollectionBadge>}
                  <CollectionOverlay />
                </CollectionImage>
                <CollectionContent>
                  <CollectionTitle>{collection.name}</CollectionTitle>
                  <CollectionDescription>{collection.description}</CollectionDescription>
                  <CollectionStats>
                    <StatItem>
                      <Package size={16} />
                      {collection.itemCount} Items
                    </StatItem>
                    <StatItem>
                      <TrendingUp size={16} />
                      Popular
                    </StatItem>
                  </CollectionStats>
                  <BrowseButton onClick={(e) => {
                    e.stopPropagation();
                    navigate('/global-market');
                  }}>
                    Browse Collection
                  </BrowseButton>
                </CollectionContent>
              </CollectionCard>
            ))}
          </CollectionsGrid>

          {filteredCollections.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ fontSize: '18px', fontWeight: 600, color: theme.colors.neutral[700], mb: 1 }}>
                No collections found in this category.
              </Box>
              <Box sx={{ fontSize: '14px', color: theme.colors.neutral[600] }}>
                Try selecting a different category to explore more collections.
              </Box>
            </Box>
          )}
        </ContentContainer>
      </PageWrapper>
    </PageLayout>
  );
}
