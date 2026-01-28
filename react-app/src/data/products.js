const STORAGE_KEY = 'local-roots-products-v1';

const defaultProducts = {
  kendem: [
    {
      id: 1,
      name: 'Bamboo Basket',
      price: 2500,
      description: 'Handwoven bamboo basket, perfect for storage.',
      image: '/images/community/kendem-hero.jpg',
      category: 'Crafts',
      community: 'kendem'
    },
    {
      id: 2,
      name: 'Traditional Mat',
      price: 1500,
      description: 'Beautiful traditional mat made from local materials.',
      image: '/images/community/kendem-hero.jpg',
      category: 'Home',
      community: 'kendem'
    },
    {
      id: 6,
      name: 'Handmade Jewelry',
      price: 3500,
      description: 'Unique handmade jewelry from Kendem artisans.',
      image: '/images/community/kendem-hero.jpg',
      category: 'Jewelry',
      community: 'kendem'
    },
    {
      id: 7,
      name: 'Artisan Pottery',
      price: 4000,
      description: 'Beautiful pottery crafted by local artists.',
      image: '/images/community/kendem-hero.jpg',
      category: 'Art',
      community: 'kendem'
    },
    {
      id: 8,
      name: 'Traditional Clothing',
      price: 5000,
      description: 'Authentic traditional clothing from Kendem.',
      image: '/images/community/kendem-hero.jpg',
      category: 'Clothing',
      community: 'kendem'
    }
  ],
  mamfe: [
    {
      id: 3,
      name: 'Coffee Beans',
      price: 5000,
      description: 'Freshly roasted coffee beans from Mamfe.',
      image: '/images/community/mamfe-hero.jpg',
      category: 'Food',
      community: 'mamfe'
    },
    {
      id: 9,
      name: 'Organic Honey',
      price: 3000,
      description: 'Pure organic honey from Mamfe farms.',
      image: '/images/community/mamfe-hero.jpg',
      category: 'Food',
      community: 'mamfe'
    },
    {
      id: 10,
      name: 'Spice Mix',
      price: 2000,
      description: 'Traditional spice mix for authentic flavors.',
      image: '/images/community/mamfe-hero.jpg',
      category: 'Food',
      community: 'mamfe'
    },
    {
      id: 11,
      name: 'Farm Tools',
      price: 6000,
      description: 'Durable farm tools made in Mamfe.',
      image: '/images/community/mamfe-hero.jpg',
      category: 'Tools',
      community: 'mamfe'
    }
  ],
  fonjo: [
    {
      id: 4,
      name: 'Fonjo Handicraft',
      price: 3000,
      description: 'Beautiful handicraft from Fonjo community.',
      image: '/images/community/fonjo-hero.jpg',
      category: 'Crafts',
      community: 'fonjo'
    },
    {
      id: 12,
      name: 'Wooden Sculpture',
      price: 4500,
      description: 'Intricate wooden sculptures from Fonjo.',
      image: '/images/community/fonjo-hero.jpg',
      category: 'Art',
      community: 'fonjo'
    },
    {
      id: 13,
      name: 'Leather Goods',
      price: 5500,
      description: 'High-quality leather products.',
      image: '/images/community/fonjo-hero.jpg',
      category: 'Accessories',
      community: 'fonjo'
    },
    {
      id: 14,
      name: 'Textile Fabrics',
      price: 2500,
      description: 'Colorful textile fabrics from Fonjo.',
      image: '/images/community/fonjo-hero.jpg',
      category: 'Clothing',
      community: 'fonjo'
    }
  ],
  moshie: [
    {
      id: 18,
      name: 'Moshie Traditional Pot',
      price: 3500,
      description: 'Authentic clay pot handcrafted by Moshie artisans.',
      image: '/images/community/moshie-hero.jpg',
      category: 'Crafts',
      community: 'moshie'
    },
    {
      id: 19,
      name: 'Woven Palm Basket',
      price: 2200,
      description: 'Beautiful palm leaf basket from Moshie community.',
      image: '/images/community/moshie-hero.jpg',
      category: 'Home',
      community: 'moshie'
    },
    {
      id: 20,
      name: 'Traditional Beads',
      price: 1800,
      description: 'Colorful traditional beads made by local artisans.',
      image: '/images/community/moshie-hero.jpg',
      category: 'Jewelry',
      community: 'moshie'
    }
  ],
  membe: [
    {
      id: 21,
      name: 'Membe Wood Carving',
      price: 4200,
      description: 'Intricate wood carving showcasing Membe craftsmanship.',
      image: '/images/community/membe-hero.jpg',
      category: 'Art',
      community: 'membe'
    },
    {
      id: 22,
      name: 'Handwoven Fabric',
      price: 3800,
      description: 'Traditional fabric handwoven by Membe women.',
      image: '/images/community/membe-hero.jpg',
      category: 'Clothing',
      community: 'membe'
    },
    {
      id: 23,
      name: 'Organic Honey',
      price: 2500,
      description: 'Pure organic honey from Membe beekeepers.',
      image: '/images/community/membe-hero.jpg',
      category: 'Food',
      community: 'membe'
    }
  ],
  'moshie-kekpoti': [
    {
      id: 5,
      name: 'Kekpoti Basket',
      price: 2800,
      description: 'Traditional basket from Moshie Kekpoti.',
      image: '/images/community/moshie-kekpoti-hero.png',
      category: 'Crafts',
      community: 'moshie-kekpoti'
    },
    {
      id: 15,
      name: 'Beaded Necklace',
      price: 3200,
      description: 'Beautiful beaded necklace from Moshie Kekpoti.',
      image: '/images/community/moshie-kekpoti-hero.png',
      category: 'Jewelry',
      community: 'moshie-kekpoti'
    },
    {
      id: 16,
      name: 'Herbal Remedies',
      price: 1800,
      description: 'Natural herbal remedies from local plants.',
      image: '/images/community/moshie-kekpoti-hero.png',
      category: 'Health',
      community: 'moshie-kekpoti'
    },
    {
      id: 17,
      name: 'Musical Instruments',
      price: 7000,
      description: 'Traditional musical instruments.',
      image: '/images/community/moshie-kekpoti-hero.png',
      category: 'Music',
      community: 'moshie-kekpoti'
    }
  ],
  // Add more communities and products
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const loadProductsFromStorage = () => {
  if (!canUseStorage()) return deepClone(defaultProducts);
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return deepClone(defaultProducts);
  const parsed = safeParseJson(stored);
  if (!parsed || typeof parsed !== 'object') return deepClone(defaultProducts);
  return parsed;
};

let products = loadProductsFromStorage();

export const persistProducts = () => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProductsByCommunity = (community) => {
  const communityProducts = (products[community] || []).slice();
  // Sort products with newest first (by dateAdded, then by ID for older products)
  return communityProducts.sort((a, b) => {
    // If both have dateAdded, sort by date (newest first)
    if (a.dateAdded && b.dateAdded) {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
    // If only one has dateAdded, prioritize the one with dateAdded
    if (a.dateAdded && !b.dateAdded) return -1;
    if (!a.dateAdded && b.dateAdded) return 1;
    // If neither has dateAdded, sort by ID (highest first for newer products)
    return b.id - a.id;
  });
};

export const getAllProducts = () => {
  const allProducts = Object.values(products).flat();
  // Sort all products with newest first
  return allProducts.sort((a, b) => {
    // If both have dateAdded, sort by date (newest first)
    if (a.dateAdded && b.dateAdded) {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
    // If only one has dateAdded, prioritize the one with dateAdded
    if (a.dateAdded && !b.dateAdded) return -1;
    if (!a.dateAdded && b.dateAdded) return 1;
    // If neither has dateAdded, sort by ID (highest first for newer products)
    return b.id - a.id;
  });
};

export const getProductById = (id) => {
  const allProducts = getAllProducts();
  return allProducts.find(product => product.id === parseInt(id));
};

export const getCategories = () => {
  const allProducts = getAllProducts();
  const categoriesSet = new Set(allProducts.map(product => product.category));
  return Array.from(categoriesSet);
};

// Function to add a new product
export const addProduct = (productData) => {
  const previousProducts = deepClone(products);

  // Generate a new ID
  const allProducts = getAllProducts();
  const newId = Math.max(...allProducts.map(p => p.id), 0) + 1;
  
  // Create the new product object with timestamp for sorting
  const newProduct = {
    id: newId,
    name: productData.name,
    price: parseInt(productData.price),
    description: productData.description,
    image: productData.images && productData.images.length > 0 ? productData.images[0] : '/images/placeholder-product.jpg',
    images: productData.images || [],
    video: productData.video || null,
    category: productData.category,
    community: productData.community.toLowerCase(),
    dateAdded: new Date().toISOString(), // Add timestamp for sorting
    isNew: true // Flag to identify newly added products
  };
  
  // Add to the appropriate community
  const communityKey = productData.community.toLowerCase();
  if (!products[communityKey]) {
    products[communityKey] = [];
  }
  
  // Add to the beginning of the array so it appears first
  products[communityKey].unshift(newProduct);

  try {
    persistProducts();
  } catch (e) {
    products = previousProducts;
    throw e;
  }

  return newProduct;
};

// Function to get the next available product ID
export const getNextProductId = () => {
  const allProducts = getAllProducts();
  return Math.max(...allProducts.map(p => p.id), 0) + 1;
};

// Export the products object for direct manipulation
export { products };
