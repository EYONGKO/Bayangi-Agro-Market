import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { Headphones, Shield, Truck, Gift } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEFAULT_FEATURES } from '../config/siteSettingsTypes';
import type { FeatureItem } from '../config/siteSettingsTypes';
import { theme } from '../theme/colors';

const ICON_MAP: Record<string, React.ReactNode> = {
  headphones: <Headphones size={24} color={theme.colors.ui.white} />,
  shield: <Shield size={24} color={theme.colors.ui.white} />,
  truck: <Truck size={24} color={theme.colors.ui.white} />,
  gift: <Gift size={24} color={theme.colors.ui.white} />,
};

const FeaturesWrapper = styled(Box)({
  padding: '24px 20px',
  background: theme.colors.ui.white,
  '@media (max-width: 768px)': {
    padding: '20px 16px',
  },
});

const FeaturesContainer = styled(Container)({
  maxWidth: '1400px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
  },
});

const FeatureCard = styled(Box)({
  background: theme.colors.ui.white,
  borderRadius: '14px',
  padding: '20px 16px',
  border: `1px solid ${theme.colors.neutral[200]}`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.colors.ui.shadow}`,
    borderColor: theme.colors.primary.main,
  },
  '@media (max-width: 768px)': {
    padding: '16px 12px',
    gap: '10px',
  },
});

const IconWrapper = styled(Box)<{ bgColor: string }>(({ bgColor }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '@media (max-width: 768px)': {
    width: '40px',
    height: '40px',
  },
}));

const FeatureContent = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const FeatureTitle = styled('div')({
  fontSize: '13px',
  fontWeight: 900,
  color: theme.colors.neutral[900], // Use neutral dark color
  marginBottom: '4px',
  '@media (max-width: 768px)': {
    fontSize: '12px',
  },
});

const FeatureSubtitle = styled('div')({
  fontSize: '12px',
  color: theme.colors.neutral[500], // Use neutral medium color
  fontWeight: 700,
  '@media (max-width: 768px)': {
    fontSize: '11px',
  },
});

interface FeatureHighlightsProps {
  /** Override features from settings. */
  features?: FeatureItem[];
}

export default function FeatureHighlights({ features: featuresProp }: FeatureHighlightsProps = {}) {
  const { settings } = useSiteSettings();
  // Temporarily force use of DEFAULT_FEATURES to bypass cached API data
  const features = featuresProp ?? DEFAULT_FEATURES;

  return (
    <FeaturesWrapper>
      <FeaturesContainer>
        {features.map((feature) => (
          <FeatureCard key={feature.id}>
            <IconWrapper bgColor={feature.bgColor}>
              {ICON_MAP[feature.iconId] ?? <Gift size={24} color={theme.colors.ui.white} />}
            </IconWrapper>
            <FeatureContent>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureSubtitle>{feature.subtitle}</FeatureSubtitle>
            </FeatureContent>
          </FeatureCard>
        ))}
      </FeaturesContainer>
    </FeaturesWrapper>
  );
}
