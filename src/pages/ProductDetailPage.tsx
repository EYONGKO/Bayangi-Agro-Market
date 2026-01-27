import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import { addReviewForProduct, getReviewStatsForProduct, getReviewsForProduct } from '../data/reviewsStore';
import PageLayout from '../components/PageLayout';
import SellerContactWidget from '../components/chat/SellerContactWidget';
import { theme } from '../theme/colors';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [reviewsVersion, setReviewsVersion] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', author: '' });
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState(0);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stateProduct = (location.state as { product?: Product } | null)?.product;

  useEffect(() => {
    let mounted = true;
    const loadProducts = () => {
      setIsLoading(true);
      fetchAllProducts()
        .then((data) => {
          if (mounted) {
            setAllProducts(data);
            setProductsLoaded(true);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setAllProducts([]);
            setProductsLoaded(true);
            setIsLoading(false);
          }
        });
    };
    
    // Only fetch if we don't have a product from state
    if (!stateProduct) {
      loadProducts();
    } else {
      // Load products in background for related products (no loading state needed)
      fetchAllProducts()
        .then((data) => {
          if (mounted) {
            setAllProducts(data);
            setProductsLoaded(true);
          }
        })
        .catch(() => {
          if (mounted) {
            setAllProducts([]);
            setProductsLoaded(true);
          }
        });
    }
    
    const unsubscribe = subscribeProductsChanged(() => loadProducts());
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [stateProduct]);

  const storedProduct = useMemo(() => {
    if (!id) return undefined;
    return allProducts.find((p) => p.id === Number(id));
  }, [allProducts, id]);

  const product = useMemo(() => {
    const resolved = stateProduct || storedProduct;

    if (resolved) {
      const images = (resolved as Product & { images?: string[] }).images;

      // Only show related products when products are loaded
      const related = productsLoaded ? allProducts
        .filter(p => p.id !== resolved.id)
        .filter(p => p.category === resolved.category || p.community === resolved.community)
        .slice(0, 4)
        .map(p => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          image: p.image,
          rating: p.rating ?? 4.8
        })) : [];

      return {
        ...resolved,
        images: images && images.length ? images : [resolved.image],
        originalPrice: resolved.price,
        discount: 0,
        rating: resolved.rating ?? 4.8,
        reviewCount: resolved.reviews ?? 127,
        inStock: true,
        stockCount: resolved.stock ?? 10,
        features: [
          'Handcrafted by skilled artisans',
          'Quality-checked product',
          'Authentic local marketplace item',
          'Support local community vendors'
        ],
        shipping: {
          freeShipping: true,
          estimatedDays: '3-5 business days',
          returns: '30-day returns',
          warranty: '1-year warranty'
        },
        relatedProducts: related
      };
    }

    // Show loading state instead of "Product Not Found" when loading
    if (isLoading && !stateProduct) {
      return {
        id: id ? Number(id) : 0,
        name: 'Loading...',
        price: 0,
        description: 'Loading product details...',
        image: '',
        category: 'Loading',
        community: 'Loading',
        vendor: 'Loading',
        originalPrice: 0,
        discount: 0,
        rating: 0,
        reviewCount: 0,
        inStock: false,
        stockCount: 0,
        images: [''],
        features: [],
        shipping: {
          freeShipping: false,
          estimatedDays: 'Loading...',
          returns: 'Loading...',
          warranty: 'Loading...'
        },
        relatedProducts: []
      };
    }

    return {
      id: id ? Number(id) : 0,
      name: 'Product Not Found',
      price: 0,
      description: 'This product could not be found or has been removed.',
      image: '',
      category: 'Unknown',
      community: 'Unknown',
      vendor: 'Unknown',
      originalPrice: 0,
      discount: 0,
      rating: 0,
      reviewCount: 0,
      inStock: false,
      stockCount: 0,
      images: [''],
      features: [],
      shipping: {
        freeShipping: false,
        estimatedDays: 'N/A',
        returns: 'N/A',
        warranty: 'N/A'
      },
      relatedProducts: []
    };
  }, [id, stateProduct, storedProduct, allProducts, productsLoaded, isLoading]);

  const reviewStats = useMemo(() => {
    return getReviewStatsForProduct(Number(product.id));
  }, [product.id, reviewsVersion]);

  const displayedReviewCount = reviewStats.count > 0 ? reviewStats.count : product.reviewCount;
  const displayedRating = reviewStats.count > 0 ? Number(reviewStats.avg.toFixed(1)) : product.rating;

  const reviews = useMemo(() => {
    return getReviewsForProduct(Number(product.id));
  }, [product.id, reviewsVersion]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stockCount, prev + delta)));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart({
        id: Number(product.id),
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        community: product.community,
        vendor: product.vendor,
        stock: product.stockCount,
        rating: product.rating,
        reviews: product.reviewCount
      });
    }
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/product/${product.id}`;
    const title = product.name;
    const text = `Check out ${product.name} on Local Roots`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareStatus('Shared');
        window.setTimeout(() => setShareStatus(null), 2000);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied');
        window.setTimeout(() => setShareStatus(null), 2000);
        return;
      }

      window.prompt('Copy this link:', url);
    } catch {
      setShareStatus('Could not share');
      window.setTimeout(() => setShareStatus(null), 2000);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
      alert('Please add a title and review.');
      return;
    }

    addReviewForProduct(Number(product.id), {
      rating: reviewForm.rating,
      title: reviewForm.title,
      body: reviewForm.body,
      author: reviewForm.author
    });

    setReviewForm({ rating: 5, title: '', body: '', author: '' });
    setReviewsVersion(v => v + 1);
  };

  return (
    <PageLayout>
      <div style={{ background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`, minHeight: '100vh' }}>
        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px' }}>
          <style jsx>{`
            @media (max-width: 968px) {
              .product-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
            }
            @media (max-width: 768px) {
              .product-grid {
                gap: 15px !important;
              }
              .main-image {
                aspect-ratio: 4/3 !important;
              }
              .action-buttons {
                grid-template-columns: 1fr !important;
                gap: 10px !important;
              }
              .thumbnail-grid {
                grid-template-columns: repeat(4, 1fr) !important;
              }
              .product-title {
                font-size: 24px !important;
              }
              .product-price {
                font-size: 28px !important;
              }
              .quantity-selector {
                flex-direction: column !important;
                gap: 10px !important;
              }
            }
            @media (max-width: 480px) {
              .product-title {
                font-size: 20px !important;
              }
              .product-price {
                font-size: 24px !important;
              }
              .thumbnail-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
              .action-buttons button {
                padding: 14px 20px !important;
                font-size: 14px !important;
              }
            }
          `}</style>
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="main-image" style={{
              position: 'relative',
              marginBottom: '20px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: `0 8px 32px ${theme.colors.ui.shadow}`,
              aspectRatio: '1'
            }}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setIsImageViewerOpen(true);
                  setViewerImageIndex(selectedImage);
                }}
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '15px',
                      transform: 'translateY(-50%)',
                      background: `${theme.colors.ui.white}e6`,
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px ${theme.colors.ui.shadow}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.colors.ui.white;
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${theme.colors.ui.white}e6`;
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronLeft size={20} color={theme.colors.primary.main} />
                  </button>

                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      background: `${theme.colors.ui.white}e6`,
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px ${theme.colors.ui.shadow}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.colors.ui.white;
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${theme.colors.ui.white}e6`;
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronRight size={20} color={theme.colors.primary.main} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                background: `${theme.colors.neutral[900]}e6`,
                color: theme.colors.ui.white,
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="thumbnail-grid" style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${product.images.length}, 1fr)`,
                gap: '10px'
              }}>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsImageViewerOpen(true);
                      setViewerImageIndex(index);
                    }}
                    style={{
                      border: selectedImage === index ? `3px solid ${theme.colors.primary.main}` : '2px solid transparent',
                      borderRadius: '8px',
                      padding: '0',
                      background: 'transparent',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      opacity: selectedImage === index ? 1 : 0.7
                    }}
                    onMouseEnter={(e) => {
                      if (selectedImage !== index) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImage !== index) {
                        e.currentTarget.style.opacity = '0.7';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div style={{
              background: theme.colors.ui.white,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: `0 4px 20px ${theme.colors.ui.shadow}`,
              border: `1px solid ${theme.colors.neutral[200]}`,
              marginTop: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: theme.colors.neutral[900] }}>Reviews</h3>
                <div style={{ color: theme.colors.neutral[600], fontSize: '13px', fontWeight: 600 }}>
                  {displayedReviewCount} total
                </div>
              </div>

              <form onSubmit={handleSubmitReview} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name (optional)"
                    style={{
                      width: '100%',
                      padding: '12px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      outline: 'none'
                    }}
                  />
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '12px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      outline: 'none',
                      background: theme.colors.ui.white,
                      color: theme.colors.neutral[900]
                    }}
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r} star{r === 1 ? '' : 's'}</option>
                    ))}
                  </select>
                </div>

                <input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  style={{
                    width: '100%',
                    padding: '12px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.colors.neutral[200]}`,
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />

                <textarea
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Write your review"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.colors.neutral[200]}`,
                    outline: 'none',
                    resize: 'vertical',
                    marginBottom: '12px'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
                    color: theme.colors.ui.white,
                    border: 'none',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 800
                  }}
                >
                  Post review
                </button>
              </form>

              <div style={{ display: 'grid', gap: '12px' }}>
                {reviews.length === 0 ? (
                  <div style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>No reviews yet. Be the first to review this item.</div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} style={{ border: `1px solid ${theme.colors.neutral[200]}`, borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                        <div style={{ fontWeight: 800, color: theme.colors.neutral[900] }}>{r.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              color={star <= r.rating ? theme.colors.primary.main : theme.colors.neutral[200]}
                              fill={star <= r.rating ? theme.colors.primary.main : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: '6px', color: theme.colors.neutral[600], fontSize: '13px', lineHeight: 1.6 }}>{r.body}</div>
                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', color: theme.colors.neutral[500], fontSize: '12px' }}>
                        <span>{r.author || 'Anonymous'}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Breadcrumb */}
            <div style={{
              marginBottom: '20px',
              fontSize: '14px',
              color: theme.colors.neutral[600]
            }}>
              <Link to="/" style={{ color: theme.colors.primary.main, textDecoration: 'none' }}>Home</Link>
              {' > '}
              <Link
                to={product.community.toLowerCase() === 'global' ? '/global-market' : `/community/${product.community.toLowerCase()}`}
                style={{ color: theme.colors.primary.main, textDecoration: 'none' }}
              >
                {product.community}
              </Link>
              {' > '}
              <span style={{ color: theme.colors.neutral[900] }}>{product.name}</span>
            </div>

            {/* Product Title */}
            <h1 className="product-title" style={{
              fontSize: '32px',
              fontWeight: '700',
              color: theme.colors.neutral[900],
              marginBottom: '15px',
              lineHeight: '1.2'
            }}>
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    color={star <= Math.floor(displayedRating) ? theme.colors.primary.main : theme.colors.neutral[200]}
                    fill={star <= Math.floor(displayedRating) ? theme.colors.primary.main : 'none'}
                  />
                ))}
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.colors.neutral[900],
                  marginLeft: '8px'
                }}>
                  {displayedRating}
                </span>
              </div>
              <span style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
                ({displayedReviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span className="product-price" style={{
                fontSize: '32px',
                fontWeight: '700',
                color: theme.colors.neutral[900]
              }}>
                FCFA{product.price.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <>
                  <span style={{
                    fontSize: '18px',
                    color: theme.colors.neutral[500],
                    textDecoration: 'line-through'
                  }}>
                    FCFA{product.originalPrice.toLocaleString()}
                  </span>
                  <span style={{
                    background: theme.colors.primary.main,
                    color: theme.colors.ui.white,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div style={{
              marginBottom: '30px',
              padding: '12px 16px',
              background: product.inStock ? `${theme.colors.primary.light}40%` : `${theme.colors.neutral[200]}`,
              borderRadius: '8px',
              border: `1px solid ${product.inStock ? theme.colors.primary.main : theme.colors.neutral[500]}`,
              color: product.inStock ? theme.colors.primary.main : theme.colors.neutral[700],
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {product.inStock ? `✓ In Stock (${product.stockCount} available)` : '✗ Out of Stock'}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector" style={{
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: theme.colors.neutral[900]
              }}>
                Quantity:
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: `2px solid ${theme.colors.neutral[200]}`,
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{
                    padding: '8px 12px',
                    background: quantity <= 1 ? theme.colors.neutral[100] : theme.colors.ui.white,
                    border: 'none',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    color: quantity <= 1 ? theme.colors.neutral[500] : theme.colors.neutral[900],
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  −
                </button>
                <span style={{
                  padding: '8px 20px',
                  background: theme.colors.ui.white,
                  borderLeft: `1px solid ${theme.colors.neutral[200]}`,
                  borderRight: `1px solid ${theme.colors.neutral[200]}`,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.colors.neutral[900],
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockCount}
                  style={{
                    padding: '8px 12px',
                    background: quantity >= product.stockCount ? theme.colors.neutral[100] : theme.colors.ui.white,
                    border: 'none',
                    cursor: quantity >= product.stockCount ? 'not-allowed' : 'pointer',
                    color: quantity >= product.stockCount ? theme.colors.neutral[500] : theme.colors.neutral[900],
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '40px'
            }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  background: product.inStock ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.neutral[400],
                  color: theme.colors.ui.white,
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: product.inStock ? `0 4px 15px ${theme.colors.primary.light}40%` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (product.inStock) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primary.dark} 0%, ${theme.colors.primary.main} 100%)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${theme.colors.primary.light}60%`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.inStock) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${theme.colors.primary.light}40%`;
                  }
                }}
              >
                <ShoppingCart size={20} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                onClick={() => {
                  toggleWishlist(Number(product.id));
                }}
                style={{
                  background: isWishlisted(Number(product.id)) ? theme.colors.primary.main : 'transparent',
                  color: isWishlisted(Number(product.id)) ? theme.colors.ui.white : theme.colors.neutral[600],
                  border: `2px solid ${theme.colors.neutral[200]}`,
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary.main;
                  e.currentTarget.style.color = theme.colors.primary.main;
                }}
                onMouseLeave={(e) => {
                  if (!isWishlisted(Number(product.id))) {
                    e.currentTarget.style.borderColor = theme.colors.neutral[200];
                    e.currentTarget.style.color = theme.colors.neutral[600];
                  }
                }}
              >
                <Heart size={20} fill={isWishlisted(Number(product.id)) ? 'white' : 'none'} />
                {isWishlisted(Number(product.id)) ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              style={{
              background: 'transparent',
              border: `2px solid ${theme.colors.neutral[200]}`,
              color: theme.colors.neutral[600],
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '40px',
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2ecc71';
              e.currentTarget.style.color = '#2ecc71';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.color = '#666666';
            }}>
              <Share2 size={18} />
              {shareStatus ? shareStatus : 'Share this product'}
            </button>

            {/* Product Details */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef'
            }}>
              {/* Description */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '15px'
                }}>
                  Description
                </h3>
                <p style={{
                  color: '#6c757d',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '15px'
                }}>
                  Features
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {product.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#2ecc71',
                        borderRadius: '50%'
                      }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping & Policies */}
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '15px'
                }}>
                  Shipping & Policies
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <Truck size={20} color="#2ecc71" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                        {product.shipping.freeShipping ? 'Free Shipping' : 'Standard Shipping'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {product.shipping.estimatedDays}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <RotateCcw size={20} color="#2ecc71" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                        {product.shipping.returns}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Easy returns and exchanges
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <Shield size={20} color="#2ecc71" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                        {product.shipping.warranty}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Quality guarantee included
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            You might also like
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px'
          }}>
            {product.relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: '1px solid #e9ecef'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {relatedProduct.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={star <= Math.floor(relatedProduct.rating) ? '#ffc107' : '#e9ecef'}
                          fill={star <= Math.floor(relatedProduct.rating) ? '#ffc107' : 'none'}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                      ({relatedProduct.rating})
                    </span>
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#2ecc71'
                  }}>
                    FCFA{relatedProduct.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </div>

        {/* Full-Screen Image Viewer Modal */}
        {isImageViewerOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsImageViewerOpen(false)}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.images[viewerImageIndex]}
                alt={`${product.name} - Image ${viewerImageIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={() => setIsImageViewerOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#333',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setViewerImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#333',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    ‹
                  </button>
                  
                  <button
                    onClick={() => setViewerImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#333',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {viewerImageIndex + 1} / {product.images.length}
              </div>
            </div>
          </div>
        )}
        <SellerContactWidget
          product={product as Product}
          sellerName={(product as Product).vendor}
          sellerId={(product as Product).sellerId}
          sellerPhone={(product as Product).sellerPhone}
          sellerWhatsApp={(product as Product).sellerWhatsApp}
        />
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
