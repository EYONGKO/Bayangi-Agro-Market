import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

async function createPlaceholderImages() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  // Create a simple placeholder canvas
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, 800, 600);

  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Product Image', 400, 280);
  ctx.font = '24px Arial';
  ctx.fillText('Upload your product photo', 400, 320);

  // Save as placeholder
  const buffer = canvas.toBuffer('image/jpeg');
  await fs.writeFile(path.join(uploadsDir, 'placeholder-product.jpg'), buffer);

  // Create a few more placeholders
  const placeholders = ['phone', 'vegetables', 'crafts', 'electronics'];
  
  for (const name of placeholders) {
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 800, 600);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0).toUpperCase() + name.slice(1), 400, 280);
    ctx.font = '24px Arial';
    ctx.fillText('Product Image', 400, 320);
    
    const buffer = canvas.toBuffer('image/jpeg');
    await fs.writeFile(path.join(uploadsDir, `placeholder-${name}.jpg`), buffer);
  }

  console.log('Placeholder images created successfully!');
}

createPlaceholderImages().catch(console.error);
