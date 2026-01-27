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
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import type { HeroSlideItem, SiteSettings } from '../../../config/siteSettingsTypes';
import { DEFAULT_HERO_SLIDES, DEFAULT_HERO_BACKGROUND_IMAGES } from '../../../config/siteSettingsTypes';
import AdminImagePicker from '../AdminImagePicker';

export interface HeroSlidesEditorProps {
  token: string;
  slides: HeroSlideItem[];
  autoSlideInterval?: number;
  backgroundImages?: string[];
  onChange: (patch: Partial<Pick<SiteSettings, 'heroSlides' | 'heroAutoSlideInterval' | 'heroBackgroundImages'>>) => void;
}

export default function HeroSlidesEditor({
  token,
  slides,
  autoSlideInterval = 5000,
  backgroundImages,
  onChange,
}: HeroSlidesEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingBackgroundImages, setEditingBackgroundImages] = useState(false);
  const items = slides.length ? slides : [...DEFAULT_HERO_SLIDES];
  const bgImages = backgroundImages && backgroundImages.length > 0 ? backgroundImages : [...DEFAULT_HERO_BACKGROUND_IMAGES];

  const updateSlide = (index: number, patch: Partial<HeroSlideItem>) => {
    const next = items.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange({ heroSlides: next });
  };

  const addSlide = () => {
    const maxId = Math.max(0, ...items.map((s) => s.id));
    onChange({ heroSlides: [...items, { id: maxId + 1, smallLabel: '', title: '', description: '', image: '', buttonText: 'Shop Now', link: '/global-market' }] });
  };

  const removeSlide = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange({ heroSlides: next.length ? next : DEFAULT_HERO_SLIDES });
    setEditingIndex(null);
  };

  const moveSlide = (index: number, dir: 'up' | 'down') => {
    const to = dir === 'up' ? index - 1 : index + 1;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    onChange({ heroSlides: next });
    setEditingIndex(to);
  };

  const updateBackgroundImage = (index: number, url: string) => {
    const images = [...bgImages];
    images[index] = url;
    onChange({ heroBackgroundImages: images });
  };

  const addBackgroundImage = () => {
    const images = [...bgImages];
    images.push('');
    onChange({ heroBackgroundImages: images });
  };

  const removeBackgroundImage = (index: number) => {
    const images = [...bgImages];
    if (images.length > 1) {
      images.splice(index, 1);
      onChange({ heroBackgroundImages: images });
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>Hero Slider</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Auto slide (ms)"
              type="number"
              value={autoSlideInterval}
              onChange={(e) => onChange({ heroAutoSlideInterval: Math.max(1000, Number(e.target.value) || 5000) })}
              sx={{ width: 130 }}
              inputProps={{ min: 1000, step: 500 }}
            />
            <Button startIcon={<Plus size={16} />} variant="outlined" size="small" onClick={addSlide} sx={{ borderRadius: 2, fontWeight: 800 }}>
              Add slide
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.map((slide, index) => (
            <Box
              key={slide.id}
              sx={{
                border: '1px solid rgba(15,23,42,0.10)',
                borderRadius: 2,
                p: 1.5,
                background: editingIndex === index ? 'rgba(239,68,68,0.04)' : '#fafafa',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#64748b' }}>Slide {index + 1}</Typography>
                <IconButton size="small" onClick={() => moveSlide(index, 'up')} disabled={index === 0} sx={{ p: 0.5 }}>
                  <ChevronUp size={16} />
                </IconButton>
                <IconButton size="small" onClick={() => moveSlide(index, 'down')} disabled={index === items.length - 1} sx={{ p: 0.5 }}>
                  <ChevronDown size={16} />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => removeSlide(index)} disabled={items.length <= 1} sx={{ p: 0.5, ml: 'auto' }}>
                  <Trash2 size={16} />
                </IconButton>
                <Button size="small" onClick={() => setEditingIndex(editingIndex === index ? null : index)} sx={{ fontWeight: 800 }}>
                  {editingIndex === index ? 'Collapse' : 'Expand'}
                </Button>
              </Box>
              {editingIndex === index && (
                <Box sx={{ display: 'grid', gap: 1.5, mt: 1 }}>
                  <TextField
                    size="small"
                    label="Small label"
                    value={slide.smallLabel}
                    onChange={(e) => updateSlide(index, { smallLabel: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Title"
                    value={slide.title}
                    onChange={(e) => updateSlide(index, { title: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Description"
                    value={slide.description}
                    onChange={(e) => updateSlide(index, { description: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <AdminImagePicker
                    token={token}
                    value={slide.image}
                    onChange={(url) => updateSlide(index, { image: url })}
                    label="Image"
                    compact
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      label="Button text"
                      value={slide.buttonText || ''}
                      onChange={(e) => updateSlide(index, { buttonText: e.target.value })}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Link"
                      value={slide.link || ''}
                      onChange={(e) => updateSlide(index, { link: e.target.value })}
                      sx={{ flex: 1 }}
                      placeholder="/global-market"
                    />
                  </Box>
                </Box>
              )}
              {editingIndex !== index && (
                <Typography sx={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>{slide.title || 'Untitled'}</Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Background Images Section */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(15,23,42,0.10)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 14, color: '#64748b' }}>
              Background Images ({bgImages.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button 
                startIcon={<Plus size={14} />} 
                variant="outlined" 
                size="small" 
                onClick={() => setEditingBackgroundImages(!editingBackgroundImages)} 
                sx={{ borderRadius: 2, fontWeight: 800 }}
              >
                {editingBackgroundImages ? 'Hide Images' : 'Edit Images'}
              </Button>
            </Box>
          </Box>

          {editingBackgroundImages && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {bgImages.map((image, index) => (
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
                      Background Image {index + 1}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => removeBackgroundImage(index)} 
                      disabled={bgImages.length <= 1} 
                      sx={{ p: 0.5, ml: 'auto' }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Box>
                  <AdminImagePicker
                    token={token}
                    value={image}
                    onChange={(url) => updateBackgroundImage(index, url)}
                    label={`Background ${index + 1}`}
                    compact
                  />
                </Box>
              ))}
              <Button 
                startIcon={<Plus size={14} />} 
                variant="outlined" 
                size="small" 
                onClick={addBackgroundImage} 
                sx={{ borderRadius: 2, fontWeight: 800, mt: 1 }}
              >
                Add Background Image
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
