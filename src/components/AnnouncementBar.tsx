import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { Mail } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const AnnouncementWrapper = styled(Box)({
  background: '#0f172a',
  color: 'rgba(255, 255, 255, 0.92)',
  fontSize: '12px',
  fontWeight: 600,
  padding: '8px 0',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const AnnouncementInner = styled(Container)({
  maxWidth: '1400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  flexWrap: 'wrap',
  gap: '8px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
  },
});

const PromoText = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const EmailSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  opacity: 0.95,
  '@media (max-width: 768px)': {
    fontSize: '10px',
  },
});

const Divider = styled('span')({
  opacity: 0.7,
  '@media (max-width: 480px)': {
    display: 'none',
  },
});

const Dropdown = styled('select')({
  background: 'transparent',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.92)',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  cursor: 'pointer',
  outline: 'none',
  padding: '2px 4px',
});

interface AnnouncementBarProps {
  promoText?: string;
  email?: string;
  currency?: string;
  language?: string;
  /** If true, show bar regardless of settings. */
  forceShow?: boolean;
}

export default function AnnouncementBar(props: AnnouncementBarProps = {}) {
  const { settings } = useSiteSettings();
  const config = settings.announcementBar ?? {
    enabled: true,
    promoText: 'Get 30% Off On Selected Items',
    email: 'support@localroots.com',
    currency: 'FCFA',
    language: 'English',
    secondaryText: 'Up to 60% off',
  };
  const enabled = props.forceShow ?? config.enabled;
  const promoText = props.promoText ?? config.promoText;
  const email = props.email ?? config.email;
  const currency = props.currency ?? config.currency;
  const language = props.language ?? config.language;
  const secondaryText = config.secondaryText ?? 'Up to 60% off';

  if (!enabled) return null;

  return (
    <AnnouncementWrapper>
      <AnnouncementInner>
        <PromoText>
          <Mail size={14} style={{ flexShrink: 0 }} />
          <span>{promoText}</span>
          <span style={{ marginLeft: '8px', opacity: 0.8 }}>{email}</span>
        </PromoText>
        <EmailSection>
          <span>{secondaryText}</span>
          <Divider>|</Divider>
          <Dropdown value="FCFA" disabled>
            <option value="FCFA">Cameroon (FCFA)</option>
          </Dropdown>
          <Divider>|</Divider>
          <Dropdown defaultValue={language}>
            <option value="English">English</option>
            <option value="French">Français</option>
          </Dropdown>
        </EmailSection>
      </AnnouncementInner>
    </AnnouncementWrapper>
  );
}
