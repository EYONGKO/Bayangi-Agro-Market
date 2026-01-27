import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import type { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';
import { createUserProduct } from '../api/productsApi';
import { notifyProductsChanged } from '../api/productsApi';
import { theme } from '../theme/colors';
import { getCommunities } from '../api/communitiesApi';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    community: string;
    vendor: string;
    stock: string;
    images: string[];
  }>({
    name: '',
    price: '',
    description: '',
    category: '',
    community: '',
    vendor: '',
    stock: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [communitiesList, setCommunitiesList] = useState<string[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);

  const categories = [
    'Agriculture',
    'Community Success',
    'Platform Updates',
    'Marketplace',
    'Resources',
    'Art',
    'Crafts',
    'Food',
    'Textiles',
    'Electronics',
    'Health & Wellness',
    'Education',
    'Technology',
    'Fashion',
    'Home & Garden',
    'Sports & Fitness',
    'Beauty & Personal Care',
    'Toys & Games',
    'Books & Media',
    'Automotive',
    'Business & Services',
    'Entertainment',
    'Travel & Tourism',
    'Pet Supplies',
    'Office Supplies',
    'Industrial'
  ];

  // Fetch communities from API
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const communitiesData = await getCommunities();
        // Extract community names from the API response
        const communityNames = communitiesData.map((community: any) => community.name);
        setCommunitiesList(communityNames);
      } catch (error) {
        console.error('Error fetching communities:', error);
        // Fallback to basic communities if API fails
        setCommunitiesList(['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie/Kekpoti']);
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addImagesFromFiles = (files: File[]) => {
    if (files.length + imagePreview.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(prev => [...prev, e.target!.result as string]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, e.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f: File) => f.type.startsWith('image/'));
    addImagesFromFiles(files);
    e.currentTarget.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const normalizeCommunityId = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.community) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      if (!isAuthenticated || !currentUser) {
        alert('Please login to add products.');
        navigate('/auth');
        return;
      }

      if (currentUser.role === 'buyer') {
        alert('Only sellers can add products. Please contact admin to upgrade your account to seller status.');
        navigate('/dashboard');
        return;
      }

      const communityId = normalizeCommunityId(formData.community);
      const price = Number(formData.price);
      const stock = formData.stock ? Number(formData.stock) : undefined;
      const image = formData.images[0] || 'https://via.placeholder.com/800x600?text=Product';

      const payload: Omit<Product, 'id'> & { images?: string[] } = {
        name: formData.name.trim(),
        price: Number.isFinite(price) ? price : 0,
        description: formData.description.trim(),
        category: formData.category,
        community: communityId,
        vendor: formData.vendor?.trim() || 'Local Vendor',
        stock: Number.isFinite(stock) ? stock : undefined,
        image,
        rating: 4.8,
        reviews: 0,
        images: formData.images.length ? formData.images : [image]
      };

      const created = await createUserProduct(currentUser.id, payload as any);
      notifyProductsChanged();

      alert('Product added successfully!');
      navigate(`/community/${created.community || communityId}`);
    } catch (error: any) {
      console.error('Error adding product:', error);
      
      // Handle duplicate product error
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        alert('This product already exists for this vendor in this community. Please use a different product name or check existing products.');
      } else {
        alert('Error adding product. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTitle = formData.name.trim() || 'Your product title';
  const previewPrice = useMemo(() => {
    const n = Number(formData.price);
    const v = Number.isFinite(n) ? n : 0;
    return `${v.toLocaleString()} CFA`;
  }, [formData.price]);
  const previewCategory = formData.category || 'Category';
  const previewVendor = formData.vendor.trim() || 'Local Vendor';
  const previewCommunity = formData.community || 'Community';
  const previewImage = imagePreview[0] || 'https://via.placeholder.com/800x600?text=Product';

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          {/* Form Container */}
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0',
          position: 'relative'
        }}>
          {/* Header Section */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: theme.colors.ui.white,
                border: `1px solid ${theme.colors.neutral[200]}`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: theme.colors.neutral[900],
                fontSize: '14px',
                padding: '10px 14px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                boxShadow: `0 1px 2px ${theme.colors.ui.shadow}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary.main;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.colors.ui.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.neutral[200];
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 1px 2px ${theme.colors.ui.shadow}`;
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '28px',
                margin: '0 0 6px 0',
                fontWeight: '800',
                color: theme.colors.neutral[900],
                letterSpacing: '-0.02em'
              }}>
                Add a new listing
              </h1>
              <p style={{
                fontSize: '14px',
                margin: 0,
                color: theme.colors.neutral[600],
                lineHeight: '1.6'
              }}>
                Create a product with photos, pricing, and details. Your listing will appear in the selected community and the global market.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.45fr 0.9fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            <form id="add-product-form" onSubmit={handleSubmit} style={{
              background: theme.colors.ui.white,
              borderRadius: '16px',
              padding: '28px',
              boxShadow: `0 12px 30px ${theme.colors.ui.shadow}`,
              border: `1px solid ${theme.colors.neutral[200]}`
            }}>

            {/* Basic Information */}
            <div style={{ marginBottom: '26px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: theme.colors.neutral[900],
                marginBottom: '18px'
              }}>
                Product Information
              </h2>

              <div style={{ display: 'grid', gap: '25px' }}>
                {/* Product Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                  />
                </div>

                {/* Price and Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '8px'
                    }}>
                      Price (CFA) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '8px'
                    }}>
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                    />
                  </div>
                </div>

                {/* Category and Community */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '8px'
                    }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '8px'
                    }}>
                      Community *
                    </label>
                    <select
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                    >
                      <option value="">Select Community</option>
                      {loadingCommunities ? (
                        <option value="">Loading communities...</option>
                      ) : (
                        communitiesList.map(community => (
                          <option key={community} value={community}>{community}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Vendor Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    Vendor/Artisan Name
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    placeholder="Enter vendor or artisan name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product, materials used, and unique features..."
                    rows={5}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#2ecc71'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '18px'
              }}>
                Product Images
              </h2>

              {/* Image Upload Area */}
              <div style={{
                border: isDraggingImages ? '2px solid #2ecc71' : '2px dashed #cbd5e0',
                borderRadius: '16px',
                padding: '26px',
                textAlign: 'center',
                background: isDraggingImages ? 'rgba(46, 204, 113, 0.05)' : '#f9fafb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDraggingImages ? '#2ecc71' : '#cbd5e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingImages(true);
              }}
              onDragLeave={() => setIsDraggingImages(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingImages(false);
                const files = Array.from(e.dataTransfer.files || []).filter((f: File) => f.type.startsWith('image/'));
                addImagesFromFiles(files);
              }}
              onClick={() => document.getElementById('image-upload')?.click()}>
                <Upload size={34} color="#2ecc71" />
                <p style={{ fontSize: '14px', color: '#111827', margin: 0, fontWeight: '700' }}>
                  Drag and drop photos here
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  or click to upload (up to 5 images)
                </p>
              </div>

              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div style={{ marginTop: '25px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '15px'
                  }}>
                    Uploaded Images ({imagePreview.length}/5)
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '15px'
                  }}>
                    {imagePreview.map((image, index) => (
                      <div key={index} style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '12px'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </form>

          <aside style={{
            position: 'sticky',
            top: '110px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 14px 0 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#6b7280'
              }}>
                Preview
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb'
                }}>
                  <img
                    src={previewImage}
                    alt={previewTitle}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: '1.3'
                  }}>
                    {previewTitle}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#111827'
                  }}>
                    {previewPrice}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '4px 8px',
                      borderRadius: '999px'
                    }}>
                      {previewCategory}
                    </span>
                    <span style={{
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '4px 8px',
                      borderRadius: '999px'
                    }}>
                      {previewCommunity}
                    </span>
                  </div>
                  <div style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Sold by <span style={{ color: '#111827', fontWeight: 700 }}>{previewVendor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              padding: '14px'
            }}>
              <button
                form="add-product-form"
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? '#9ca3af' : '#111827',
                  color: 'white',
                  border: 'none',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 22px rgba(17, 24, 39, 0.25)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 14px 28px rgba(17, 24, 39, 0.28)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 22px rgba(17, 24, 39, 0.25)';
                  }
                }}
              >
                {isSubmitting ? 'Publishing…' : 'Publish listing'}
              </button>
              <div style={{
                marginTop: '10px',
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.55'
              }}>
                Tip: add clear photos and a detailed description to help buyers trust your listing.
              </div>
            </div>
          </aside>
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddProductPage;
