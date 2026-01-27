import { theme } from '../theme/colors';

/**
 * Type definitions for site-wide settings (admin-controlled frontend config).
 * Kept in a dedicated module for clarity and reuse across admin + frontend.
 */

export interface HeroSlideItem {
  id: number;
  smallLabel: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  link?: string;
}

export interface PageHeroConfig {
  title: string;
  subtitle: string;
  backgroundImages: string[];
  autoSlideInterval?: number;
}

export interface FeatureItem {
  id: string;
  iconId: 'headphones' | 'shield' | 'truck' | 'gift' | string;
  title: string;
  subtitle: string;
  bgColor: string;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  promoText: string;
  email: string;
  currency: string;
  language: string;
  secondaryText?: string;
}

export interface HeaderConfig {
  brandName: string;
  brandMark: string; // e.g. "LR"
  searchPlaceholder: string;
}

export interface FooterLink {
  label: string;
  path: string;
}

export interface FooterConfig {
  tagline: string;
  description: string;
  quickLinks: FooterLink[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  bottomLine: string;
}

export interface NavLinkItem {
  path: string;
  label: string;
}

export interface SectionVisibility {
  announcementBar: boolean;
  categoryNav: boolean;
  pricesButton: boolean;
  pricesButtonLabel: string;
  hero: boolean;
  features: boolean;
  communities: boolean;
  sellerSection: boolean;
}

/** Single product row in the Prices modal (Local | World). */
export interface PriceItem {
  id: string;
  name: string;
  /** Unit label, e.g. "/1Kg" or "35 liter of oil". */
  unitLabel: string;
  localPrice: number | null;
  worldPrice: number;
  localEmptyMessage?: string;
  worldReferenceLabel?: string;
}

/** Config for the Prices modal (World vs Local snapshot). Editable from admin. */
export interface MarketPricesConfig {
  modalTitle: string;
  modalSubtitle: string;
  explanationText: string;
  currency: string;
  priceItems: PriceItem[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  itemCount: number;
  featured: boolean;
}

export interface SiteSettings {
  heroSlides?: HeroSlideItem[];
  heroAutoSlideInterval?: number;
  heroBackgroundImages?: string[];
  collections?: Collection[];
  collectionsHero?: PageHeroConfig;
  newsHero?: PageHeroConfig;
  features?: FeatureItem[];
  announcementBar?: AnnouncementBarConfig;
  header?: HeaderConfig;
  footer?: FooterConfig;
  navLinks?: NavLinkItem[];
  sectionVisibility?: SectionVisibility;
  marketPrices?: MarketPricesConfig;
}

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  { id: 1, smallLabel: 'New Fashion', title: 'New Collection 2025', description: 'Discover authentic community products and artisan-made goods. Shop curated collections, support local vendors, and explore new arrivals.', image: '/hero person management.png', buttonText: 'Shop Now', link: '/global-market' },
  { id: 2, smallLabel: 'Fresh Produce', title: 'Local Farmers Market', description: 'Connect with local farmers and get the freshest produce. Support sustainable farming and enjoy quality products from trusted local sources.', image: '/hero person management.png', buttonText: 'Shop Now', link: '/global-market' },
  { id: 3, smallLabel: 'Artisan Crafts', title: 'Handmade Excellence', description: 'Explore unique handmade crafts and traditional arts from skilled artisans. Each piece tells a story and supports local communities.', image: '/hero person management.png', buttonText: 'Shop Now', link: '/global-market' },
];

export const DEFAULT_HERO_BACKGROUND_IMAGES = [
  '/hero-moving-bg.jpg',
  '/hero-moving-bg-2.jpg',
  '/hero-moving-bg-3.jpg'
];

export const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'handmade-crafts',
    name: 'Handmade Crafts',
    description: 'Unique artisan-made products crafted with traditional techniques and modern designs.',
    category: 'Crafts',
    image: '/kendem-hero.jpg',
    itemCount: 145,
    featured: true,
  },
  {
    id: 'agricultural-products',
    name: 'Agricultural Products',
    description: 'Fresh produce and agricultural goods from local farmers and communities.',
    category: 'Agriculture',
    image: '/mamfe-hero.jpg',
    itemCount: 89,
    featured: true,
  },
  {
    id: 'textiles-fabrics',
    name: 'Textiles & Fabrics',
    description: 'Beautiful handwoven textiles, traditional fabrics, and textile-based products.',
    category: 'Textiles',
    image: '/widikum-hero.jpg',
    itemCount: 67,
    featured: false,
  },
  {
    id: 'home-decor',
    name: 'Home & Decor',
    description: 'Decorative items and home accessories that bring cultural beauty to your space.',
    category: 'Home',
    image: '/kendem-hero.jpg',
    itemCount: 92,
    featured: false,
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion & Accessories',
    description: 'Stylish fashion items and accessories that blend traditional and contemporary styles.',
    category: 'Fashion',
    image: '/mamfe-hero.jpg',
    itemCount: 156,
    featured: false,
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Artisanal food products and beverages made from locally sourced ingredients.',
    category: 'Food',
    image: '/widikum-hero.jpg',
    itemCount: 73,
    featured: false,
  },
  {
    id: 'pottery-ceramics',
    name: 'Pottery & Ceramics',
    description: 'Functional and decorative pottery pieces crafted using time-honored methods.',
    category: 'Crafts',
    image: '/kendem-hero.jpg',
    itemCount: 54,
    featured: false,
  },
  {
    id: 'woodwork',
    name: 'Woodwork & Carvings',
    description: 'Intricate wood carvings and furniture pieces showcasing masterful craftsmanship.',
    category: 'Crafts',
    image: '/mamfe-hero.jpg',
    itemCount: 48,
    featured: false,
  },
  {
    id: 'seasonal-gifts',
    name: 'Seasonal & Gift Items',
    description: 'Perfect gifts for any occasion, curated from our best-selling products.',
    category: 'Gifts',
    image: '/widikum-hero.jpg',
    itemCount: 128,
    featured: true,
  },
];

export const DEFAULT_COLLECTIONS_HERO: PageHeroConfig = {
  title: 'All Collections',
  subtitle: 'Explore our curated collections of authentic products from artisans and farmers around the world.',
  backgroundImages: [
    '/hero-moving-bg.jpg',
    '/hero-moving-bg-2.jpg',
    '/hero-moving-bg-3.jpg'
  ],
  autoSlideInterval: 4000,
};

export const DEFAULT_NEWS_HERO: PageHeroConfig = {
  title: 'Latest News & Stories',
  subtitle: 'Stay updated with the latest news, success stories, and insights from our global community of artisans and farmers.',
  backgroundImages: [
    '/hero-moving-bg.jpg',
    '/hero-moving-bg-2.jpg',
    '/hero-moving-bg-3.jpg'
  ],
  autoSlideInterval: 4000,
};

export const DEFAULT_FEATURES: FeatureItem[] = [
  { id: 'support', iconId: 'headphones', title: '24 X 7 Free Support', subtitle: 'Online Support 24/7', bgColor: theme.colors.primary.main },
  { id: 'guarantee', iconId: 'shield', title: 'Money Back Guarantee', subtitle: '100% Secure Payment', bgColor: theme.colors.primary.light },
  { id: 'shipping', iconId: 'truck', title: 'Free Worldwide Shipping', subtitle: 'On Order Over 5000 FCFA', bgColor: theme.colors.primary.dark },
  { id: 'gift', iconId: 'gift', title: 'Win 10000 FCFA To Shop', subtitle: 'Give The Perfect Gift', bgColor: theme.colors.primary.background },
];

export const DEFAULT_ANNOUNCEMENT: AnnouncementBarConfig = {
  enabled: true,
  promoText: 'Get 30% Off On Selected Items',
  email: 'support@bayangiagromarket.com',
  currency: 'FCFA',
  language: 'English',
  secondaryText: 'Up to 60% off',
};

export const DEFAULT_HEADER: HeaderConfig = {
  brandName: 'Bayangi Agro Market',
  brandMark: 'BAM',
  searchPlaceholder: 'Search products...',
};

export const DEFAULT_FOOTER: FooterConfig = {
  tagline: 'Connecting farmers to markets',
  description: 'Empowering agricultural communities through authentic products and meaningful connections across global markets.',
  quickLinks: [
    { label: 'Home', path: '/' },
    { label: 'Global Market', path: '/global-market' },
    { label: 'Top Artisans', path: '/top-artisans' },
    { label: 'Add Product', path: '/add-product' },
  ],
  contactEmail: 'eyongkomatchfire@gmail.com',
  contactPhone: '+237 681 006 594',
  contactAddress: 'Cameroon',
  bottomLine: 'Empowering agricultural communities • Connecting global markets',
};

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { path: '/global-market', label: 'Global Market' },
  { path: '/top-artisans', label: 'Top Artisans' },
  { path: '/all-collections', label: 'All Collections' },
  { path: '/news', label: 'News' },
  { path: '/dashboard', label: 'Dashboard' },
];

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  announcementBar: true,
  categoryNav: true,
  pricesButton: true,
  pricesButtonLabel: 'PRICES',
  hero: true,
  features: true,
  communities: true,
  sellerSection: true,
};

export const DEFAULT_PRICE_ITEMS: PriceItem[] = [
  {
    id: 'cocoa',
    name: 'Cocoa',
    unitLabel: ' /1Kg',
    localPrice: 2500,
    worldPrice: 8000,
    localEmptyMessage: 'No local cocoa product yet',
    worldReferenceLabel: 'Using reference price',
  },
  {
    id: 'palm-oil',
    name: 'Palm oil',
    unitLabel: '35 liter of oil',
    localPrice: 25000,
    worldPrice: 25000,
  },
];

export const DEFAULT_MARKET_PRICES: MarketPricesConfig = {
  modalTitle: 'Prices',
  modalSubtitle: 'World vs Local market snapshot',
  explanationText: 'Local price is averaged from cocoa products in non-global communities. World price is averaged from global cocoa products, or a reference value if none exist.',
  currency: 'FCFA',
  priceItems: [...DEFAULT_PRICE_ITEMS],
};

export function mergeWithDefaults(partial: Partial<SiteSettings> | null): SiteSettings {
  if (!partial || typeof partial !== 'object') {
    return {
      heroSlides: [...DEFAULT_HERO_SLIDES],
      heroAutoSlideInterval: 5000,
      heroBackgroundImages: [...DEFAULT_HERO_BACKGROUND_IMAGES],
      collections: [...DEFAULT_COLLECTIONS],
      collectionsHero: { ...DEFAULT_COLLECTIONS_HERO },
      newsHero: { ...DEFAULT_NEWS_HERO },
      features: [...DEFAULT_FEATURES],
      announcementBar: { ...DEFAULT_ANNOUNCEMENT },
      header: { ...DEFAULT_HEADER },
      footer: { ...DEFAULT_FOOTER },
      navLinks: [...DEFAULT_NAV_LINKS],
      sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY } as SectionVisibility,
      marketPrices: { ...DEFAULT_MARKET_PRICES },
    };
  }
  return {
    heroSlides: partial.heroSlides && partial.heroSlides.length > 0 ? partial.heroSlides : DEFAULT_HERO_SLIDES,
    heroAutoSlideInterval: typeof partial.heroAutoSlideInterval === 'number' ? partial.heroAutoSlideInterval : 5000,
    heroBackgroundImages: partial.heroBackgroundImages && partial.heroBackgroundImages.length > 0 ? partial.heroBackgroundImages : DEFAULT_HERO_BACKGROUND_IMAGES,
    collections: partial.collections && partial.collections.length > 0 ? partial.collections : DEFAULT_COLLECTIONS,
    collectionsHero: { ...DEFAULT_COLLECTIONS_HERO, ...partial.collectionsHero },
    newsHero: { ...DEFAULT_NEWS_HERO, ...partial.newsHero },
    features: partial.features && partial.features.length > 0 ? partial.features : DEFAULT_FEATURES,
    announcementBar: { ...DEFAULT_ANNOUNCEMENT, ...partial.announcementBar },
    header: { ...DEFAULT_HEADER, ...partial.header },
    footer: { ...DEFAULT_FOOTER, ...partial.footer },
    navLinks: partial.navLinks && partial.navLinks.length > 0 ? partial.navLinks : DEFAULT_NAV_LINKS,
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY, ...partial.sectionVisibility } as SectionVisibility,
    marketPrices: (() => {
      const base = { ...DEFAULT_MARKET_PRICES, ...partial.marketPrices };
      const items = base.priceItems && base.priceItems.length > 0 ? base.priceItems : DEFAULT_PRICE_ITEMS;
      return { ...base, priceItems: items };
    })(),
  };
}
