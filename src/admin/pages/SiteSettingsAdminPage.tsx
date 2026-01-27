import { useEffect, useState } from 'react';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Save, RefreshCw, ExternalLink } from 'lucide-react';
import {
  HeroSlidesEditor,
  FeaturesEditor,
  AnnouncementEditor,
  HeaderFooterEditor,
  NavLinksEditor,
  SectionTogglesEditor,
  PageHeroEditor,
} from '../components/siteSettings';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAdminAuth } from '../AdminAuthContext';
import { updateSiteSettings } from '../../api/siteSettingsApi';
import type { SiteSettings } from '../../config/siteSettingsTypes';
import { mergeWithDefaults } from '../../config/siteSettingsTypes';

type TabKey = 'hero' | 'features' | 'announcement' | 'headerFooter' | 'nav' | 'sections' | 'pageHeroes';

export default function SiteSettingsAdminPage() {
  const { token } = useAdminAuth();
  const { settings, loading, error, refetch } = useSiteSettings();
  const [local, setLocal] = useState<SiteSettings>(() => mergeWithDefaults(null));
  const [tab, setTab] = useState<TabKey>('hero');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setLocal(mergeWithDefaults(settings as Partial<SiteSettings>));
  }, [settings]);

  const handleChange = (patch: Partial<SiteSettings>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Filter out invalid nav links before saving (empty labels, placeholders, etc.)
      const navLinks = local.navLinks?.filter((link) => {
        const label = (link.label || '').trim();
        const path = (link.path || '').trim();
        if (!label || !path) return false;
        const labelLower = label.toLowerCase();
        if (labelLower === 'new link' || labelLower === 'new' || labelLower === 'newlink') return false;
        return true;
      }) || [];
      
      const cleaned = { ...local, navLinks };
      await updateSiteSettings(token, cleaned);
      await refetch();
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Site Settings</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 700, color: '#64748b' }}>
            Control hero, features, header, footer, nav links, and section visibility on the frontend.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => refetch()}
            disabled={loading}
            sx={{ borderRadius: 2, fontWeight: 900 }}
          >
            Refresh
          </Button>
          <Button
            component={Link}
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<ExternalLink size={16} />}
            sx={{ borderRadius: 2, fontWeight: 900 }}
          >
            View site
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 2, fontWeight: 950 }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {error}
        </Box>
      )}
      {saveError && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {saveError}
        </Box>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label="Hero" value="hero" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Page Heroes" value="pageHeroes" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Features" value="features" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Announcement" value="announcement" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Header & Footer" value="headerFooter" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Nav links" value="nav" sx={{ fontWeight: 800, textTransform: 'none' }} />
        <Tab label="Sections" value="sections" sx={{ fontWeight: 800, textTransform: 'none' }} />
      </Tabs>

      {tab === 'hero' && (
        <HeroSlidesEditor
          token={token}
          slides={local.heroSlides || []}
          autoSlideInterval={local.heroAutoSlideInterval}
          backgroundImages={local.heroBackgroundImages}
          onChange={handleChange}
        />
      )}
      {tab === 'pageHeroes' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PageHeroEditor
            token={token}
            title="All Collections Hero"
            heroConfig={local.collectionsHero}
            onChange={handleChange}
            heroType="collections"
          />
          <PageHeroEditor
            token={token}
            title="News Hero"
            heroConfig={local.newsHero}
            onChange={handleChange}
            heroType="news"
          />
        </Box>
      )}
      {tab === 'features' && (
        <FeaturesEditor features={local.features || []} onChange={handleChange} />
      )}
      {tab === 'announcement' && (
        <AnnouncementEditor
          config={local.announcementBar!}
          onChange={handleChange}
        />
      )}
      {tab === 'headerFooter' && (
        <HeaderFooterEditor
          header={local.header!}
          footer={local.footer!}
          onChange={handleChange}
        />
      )}
      {tab === 'nav' && (
        <NavLinksEditor navLinks={local.navLinks || []} onChange={handleChange} />
      )}
      {tab === 'sections' && (
        <SectionTogglesEditor
          sectionVisibility={local.sectionVisibility!}
          onChange={handleChange}
        />
      )}
    </Box>
  );
}
