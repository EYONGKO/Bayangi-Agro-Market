# Community Images

This directory contains images for the community carousel functionality.

## Required Images for Kendem Community:
- kendem-1.jpg - Main community image
- kendem-2.jpg - Local market scene
- kendem-3.jpg - Artisan at work
- kendem-4.jpg - Community products display

## Image Requirements:
- **Resolution**: 1920x1080 or higher
- **Format**: JPG or PNG
- **Size**: Optimized for web (under 500KB each)
- **Aspect Ratio**: 16:9 for best carousel display

## Fallback:
If images are not available, the carousel will show a placeholder with "No images available" message.

## Adding New Communities:
For each new community, create images following the pattern:
- `{community-name}-1.jpg`
- `{community-name}-2.jpg`
- etc.

Then update the `communityImages` array in the Community component to reference the correct image paths.
