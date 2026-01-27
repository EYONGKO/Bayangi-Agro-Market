export type GiftModeInterest = {
  id: string;
  label: string;
  categories: string[];
};

export const GIFT_MODE_INTERESTS: GiftModeInterest[] = [
  { id: 'all', label: 'All', categories: [] },
  { id: 'agriculture', label: 'Agriculture', categories: ['Agriculture'] },
  { id: 'community-success', label: 'Community Success', categories: ['Community Success'] },
  { id: 'platform-updates', label: 'Platform Updates', categories: ['Platform Updates'] },
  { id: 'marketplace', label: 'Marketplace', categories: ['Marketplace'] },
  { id: 'resources', label: 'Resources', categories: ['Resources'] },
  { id: 'art', label: 'Art', categories: ['Art'] },
  { id: 'crafts', label: 'Crafts', categories: ['Crafts'] },
  { id: 'food', label: 'Food', categories: ['Food'] },
  { id: 'textiles', label: 'Textiles', categories: ['Textiles'] },
  { id: 'electronics', label: 'Electronics', categories: ['Electronics'] },
  { id: 'health-wellness', label: 'Health & Wellness', categories: ['Health & Wellness'] },
  { id: 'education', label: 'Education', categories: ['Education'] },
  { id: 'technology', label: 'Technology', categories: ['Technology'] },
  { id: 'fashion', label: 'Fashion', categories: ['Fashion'] },
  { id: 'home-garden', label: 'Home & Garden', categories: ['Home & Garden'] },
  { id: 'sports-fitness', label: 'Sports & Fitness', categories: ['Sports & Fitness'] },
  { id: 'beauty-personal-care', label: 'Beauty & Personal Care', categories: ['Beauty & Personal Care'] },
  { id: 'toys-games', label: 'Toys & Games', categories: ['Toys & Games'] },
  { id: 'books-media', label: 'Books & Media', categories: ['Books & Media'] },
  { id: 'automotive', label: 'Automotive', categories: ['Automotive'] },
  { id: 'business-services', label: 'Business & Services', categories: ['Business & Services'] },
  { id: 'entertainment', label: 'Entertainment', categories: ['Entertainment'] },
  { id: 'travel-tourism', label: 'Travel & Tourism', categories: ['Travel & Tourism'] },
  { id: 'pet-supplies', label: 'Pet Supplies', categories: ['Pet Supplies'] },
  { id: 'office-supplies', label: 'Office Supplies', categories: ['Office Supplies'] },
  { id: 'industrial', label: 'Industrial', categories: ['Industrial'] },
];
