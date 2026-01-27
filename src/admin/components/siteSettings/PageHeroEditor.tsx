import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Trash2, Plus } from 'lucide-react';
import type { PageHeroConfig, SiteSettings } from '../../../config/siteSettingsTypes';
import AdminImagePicker from '../AdminImagePicker';

export interface PageHeroEditorProps {
  token: string;
  title: string;
  heroConfig?: PageHeroConfig;
  onChange: (patch: Partial<Pick<SiteSettings, 'collectionsHero' | 'newsHero'>>) => void;
  heroType: 'collections' | 'news';
}

export default function PageHeroEditor({
  token,
  title,
  heroConfig,
  onChange,
  heroType,
}: PageHeroEditorProps) {
  const [editingImages, setEditingImages] = useState(false);
  
  const updateConfig = (patch: Partial<PageHeroConfig>) => {
    const config = { ...heroConfig, ...patch };
    if (heroType === 'collections') {
      onChange({ collectionsHero: config });
    } else {
      onChange({ newsHero: config });
    }
  };

  const updateBackgroundImage = (index: number, url: string) => {
    const images = [...(heroConfig?.backgroundImages || [])];
    images[index] = url;
    updateConfig({ backgroundImages: images });
  };

  const addBackgroundImage = () => {
    const images = [...(heroConfig?.backgroundImages || [])];
    images.push('');
    updateConfig({ backgroundImages: images });
  };

  const removeBackgroundImage = (index: number) => {
    const images = [...(heroConfig?.backgroundImages || [])];
    if (images.length > 1) {
      images.splice(index, 1);
      updateConfig({ backgroundImages: images });
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>{title}</Typography>
          <Button 
            startIcon={<Plus size={16} />} 
            variant="outlined" 
            size="small" 
            onClick={() => setEditingImages(!editingImages)} 
            sx={{ borderRadius: 2, fontWeight: 800 }}
          >
            {editingImages ? 'Hide Images' : 'Edit Images'}
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            label="Hero Title"
            value={heroConfig?.title || ''}
            onChange={(e) => updateConfig({ title: e.target.value })}
            fullWidth
          />
          <TextField
            size="small"
            label="Hero Subtitle"
            value={heroConfig?.subtitle || ''}
            onChange={(e) => updateConfig({ subtitle: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            size="small"
            label="Auto Slide Interval (milliseconds)"
            type="number"
            value={heroConfig?.autoSlideInterval || 4000}
            onChange={(e) => updateConfig({ autoSlideInterval: Math.max(1000, Number(e.target.value) || 4000) })}
            fullWidth
            inputProps={{ min: 1000, step: 500 }}
          />
        </Box>

        {editingImages && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#64748b' }}>
                Background Images ({heroConfig?.backgroundImages?.length || 0})
              </Typography>
              <Button 
                startIcon={<Plus size={14} />} 
                variant="outlined" 
                size="small" 
                onClick={addBackgroundImage} 
                sx={{ borderRadius: 2, fontWeight: 800 }}
              >
                Add Image
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {(heroConfig?.backgroundImages || []).map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid rgba(15,23,42,0.10)',
                    borderRadius: 2,
                    p: 1.5,
                    background: '#fafafa',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#64748b' }}>
                      Image {index + 1}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => removeBackgroundImage(index)} 
                      disabled={(heroConfig?.backgroundImages?.length || 0) <= 1} 
                      sx={{ p: 0.5, ml: 'auto' }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Box>
                  <AdminImagePicker
                    token={token}
                    value={image}
                    onChange={(url) => updateBackgroundImage(index, url)}
                    label={`Image ${index + 1}`}
                    compact
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
