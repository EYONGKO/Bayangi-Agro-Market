import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { Calendar, User, ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import MovingHeroSection from '../components/MovingHeroSection';
import { NEWS_CATEGORIES } from '../data/newsStore';
import { listPosts, type PostRecord } from '../api/adminApi';
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

const NewsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '30px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const NewsCard = styled(Box)({
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

const NewsImage = styled('div')<{ image: string }>(({ image }) => ({
  height: '220px',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
}));

const CategoryBadge = styled('div')({
  position: 'absolute',
  top: '16px',
  left: '16px',
  padding: '6px 14px',
  borderRadius: '999px',
  background: `${theme.colors.ui.white}e6`,
  fontSize: '12px',
  fontWeight: 800,
  color: theme.colors.primary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const NewsContent = styled(Box)({
  padding: '24px',
});

const NewsTitle = styled('h3')({
  fontSize: '20px',
  fontWeight: 800,
  color: theme.colors.neutral[900],
  marginBottom: '12px',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const NewsExcerpt = styled('p')({
  fontSize: '14px',
  color: theme.colors.neutral[600],
  lineHeight: 1.7,
  marginBottom: '16px',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const NewsMeta = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  paddingTop: '16px',
  borderTop: `1px solid ${theme.colors.neutral[200]}`,
  fontSize: '13px',
  color: theme.colors.neutral[600],
  fontWeight: 600,
});

const MetaItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const ReadMoreLink = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: theme.colors.primary.main,
  fontWeight: 800,
  fontSize: '14px',
  marginTop: '12px',
  cursor: 'pointer',
  transition: 'gap 0.2s ease',
  '&:hover': {
    gap: '10px',
  },
});

const categories = [...NEWS_CATEGORIES];

export default function NewsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [articles, setArticles] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await listPosts();
        if (!cancelled) {
          setArticles(posts);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load news');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredNews = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <PageLayout>
      <PageWrapper>
        <MovingHeroSection heroType="news" />

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

          {error && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="error" fontWeight={700}>
                {error}
              </Typography>
            </Box>
          )}

          {loading && articles.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                Loading news articles...
              </Typography>
            </Box>
          )}

          <NewsGrid>
            {filteredNews.map((article) => (
              <NewsCard key={article._id} onClick={() => navigate(`/news/${article._id}`)}>
                <NewsImage image={article.image}>
                  <CategoryBadge>{article.category}</CategoryBadge>
                </NewsImage>
                <NewsContent>
                  <NewsTitle>{article.title}</NewsTitle>
                  <NewsExcerpt>{article.excerpt}</NewsExcerpt>
                  <NewsMeta>
                    <MetaItem>
                      <Calendar size={14} />
                      {article.date}
                    </MetaItem>
                    <MetaItem>
                      <User size={14} />
                      {article.author}
                    </MetaItem>
                  </NewsMeta>
                  <ReadMoreLink
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/news/${article._id}`);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    Read More <ArrowRight size={16} />
                  </ReadMoreLink>
                </NewsContent>
              </NewsCard>
            ))}
          </NewsGrid>

          {!loading && filteredNews.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No news articles found in this category.
              </Typography>
            </Box>
          )}
        </ContentContainer>
      </PageWrapper>
    </PageLayout>
  );
}
