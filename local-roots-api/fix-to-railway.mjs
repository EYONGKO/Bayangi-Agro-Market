import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

async function fixProductImagesToRailway() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define Product schema inline
    const ProductSchema = new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      image: String,
      images: [String],
      category: String,
      community: String,
      vendor: String,
      stock: Number,
      rating: Number,
      reviews: Number,
      likes: Number
    });

    const Product = mongoose.model('Product', ProductSchema);

    // Find all products with external image URLs (picsum, placeholder, etc.)
    const productsWithExternalImages = await Product.find({
      $or: [
        { image: { $regex: 'picsum\.photos' } },
        { image: { $regex: 'placeholder.*\.jpg' } },
        { images: { $elemMatch: { $regex: 'picsum\.photos' } } },
        { images: { $elemMatch: { $regex: 'placeholder.*\.jpg' } } }
      ]
    });

    console.log(`Found ${productsWithExternalImages.length} products with external image URLs`);

    // Update each product to use Railway URLs
    const railwayBaseUrl = 'https://bayangi-agro-market-backend-production.up.railway.app';
    
    for (const product of productsWithExternalImages) {
      const updates = {};
      
      // Fix main image
      if (product.image && (product.image.includes('picsum.photos') || product.image.includes('placeholder'))) {
        updates.image = `${railwayBaseUrl}/uploads/placeholder-${product.name || 'product'}.jpg`;
      }
      
      // Fix images array
      if (product.images && product.images.length > 0) {
        updates.images = product.images.map((img, index) => {
          if (img.includes('picsum.photos') || img.includes('placeholder')) {
            return `${railwayBaseUrl}/uploads/placeholder-${product.name || 'product'}.jpg`;
          }
          return img;
        });
      }

      // Update the product
      await Product.findByIdAndUpdate(product._id, updates);
      console.log(`Fixed image URLs for product: ${product.name}`);
    }

    console.log('Image URL fixing completed!');
    
  } catch (error) {
    console.error('Error fixing product image URLs:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixProductImagesToRailway();
