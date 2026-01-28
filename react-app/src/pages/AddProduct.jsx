import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communitiesData } from '../config/communities';
import { useProducts } from '../contexts/ProductsContext';
import Toast from '../components/Toast';

const categories = [
  'Accessories',
  'Art & Collectibles',
  'Baby',
  'Bags & Purses',
  'Bath & Beauty',
  'Books, Movies & Music',
  'Clothing',
  'Craft Supplies & Tools',
  'Electronics & Accessories',
  'Gifts',
  'Home & Living',
  'Jewelry'
];

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    community: 'Kendem',
    images: [],
    video: null
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (e) => {
    setProduct({
      ...product,
      category: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    setImageFiles(files);
    Promise.all(files.map(fileToDataUrl))
      .then((imageDataUrls) => {
        setProduct(prev => ({
          ...prev,
          images: imageDataUrls
        }));
        setCurrentImageIndex(0);
      })
      .catch((error) => {
        console.error('Error reading images:', error);
        setToast({
          message: 'Failed to read one or more images. Please try again.',
          type: 'error'
        });
      });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileToDataUrl(file)
        .then((videoDataUrl) => {
          setProduct(prev => ({
            ...prev,
            video: videoDataUrl
          }));
        })
        .catch((error) => {
          console.error('Error reading video:', error);
          setToast({
            message: 'Failed to read the video. Please try again.',
            type: 'error'
          });
        });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!product.name || !product.description || !product.price || !product.category || !product.community) {
        setToast({
          message: 'Please fill in all required fields.',
          type: 'error'
        });
        setIsSubmitting(false);
        return;
      }

      // Create the product data object
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        community: product.community,
        images: product.images,
        video: product.video
      };

      // Add the product to the data store
      const newProduct = addProduct(productData);
      
      // Show success message
      setToast({
        message: `Product "${newProduct.name}" has been successfully added to ${product.community} community!`,
        type: 'success'
      });
      
      // Wait a moment for the toast to show, then navigate
      setTimeout(() => {
        const communitySlug = product.community.toLowerCase();
        navigate(`/community/${communitySlug}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error adding product:', error);
      setToast({
        message: 'There was an error adding your product. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0',
        margin: '0',
        width: '100%',
        position: 'relative'
      }}>
      {/* Background Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(39, 174, 96, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(39, 174, 96, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(39, 174, 96, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(39, 174, 96, 0.1) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
      }}></div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.98)', 
          borderRadius: '20px', 
          padding: '3rem 2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          marginBottom: '2rem',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#27ae60',
            borderRadius: '50px',
            marginBottom: '1.5rem'
          }}>
            <i className="fas fa-plus-circle" style={{ 
              fontSize: '2rem', 
              color: 'white',
              marginRight: '0.5rem'
            }}></i>
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              color: 'white'
            }}>New Product</span>
          </div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            margin: '0 0 1rem 0',
            color: '#2c3e50',
            background: 'linear-gradient(135deg, #2c3e50, #27ae60)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Add a New Product
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#7f8c8d',
            margin: '0',
            fontWeight: '400'
          }}>
            Share your amazing products with the community
          </p>
        </div>

        {/* Main Form Container */}
        <div className="form-container" style={{ 
          backgroundColor: 'rgba(255,255,255,0.98)', 
          borderRadius: '20px', 
          padding: '4rem',
          boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Form Background Decoration */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(39, 174, 96, 0.05))',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
          <form onSubmit={handleSubmit} style={{ 
            maxWidth: '1000px', 
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}>
            
            {/* Select Community */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem',
                position: 'relative'
              }}>
                <i className="fas fa-map-marker-alt" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Select Community:
              </label>
              <select 
                name="community" 
                value={product.community} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#27ae60';
                  e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                {communitiesData.map(community => (
                  <option key={community.id} value={community.name}>
                    {community.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-tag" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Product Name:
              </label>
              <input 
                type="text" 
                name="name" 
                value={product.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter your product name"
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#27ae60';
                  e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-dollar-sign" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Price (CFA):
              </label>
              <input 
                type="number" 
                name="price" 
                value={product.price} 
                onChange={handleChange} 
                required 
                placeholder="Enter price in CFA"
                min="0"
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#27ae60';
                  e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-align-left" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Description:
              </label>
              <textarea 
                name="description" 
                value={product.description} 
                onChange={handleChange} 
                required 
                placeholder="Describe your product in detail..."
                rows="5"
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  fontWeight: '500',
                  minHeight: '120px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#27ae60';
                  e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-list" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Category:
              </label>
              <input 
                type="text" 
                name="category" 
                value={product.category} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Food, Crafts, Textiles, Art"
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.5rem', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#27ae60';
                  e.target.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              />
            </div>

            {/* Product Images */}
            <div style={{ marginBottom: '3rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-images" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Product Images (you can select multiple):
              </label>
              
              <div style={{
                position: 'relative',
                border: '2px dashed #e9ecef',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  pointerEvents: 'none'
                }}>
                  <i className="fas fa-cloud-upload-alt" style={{
                    fontSize: '3rem',
                    color: '#27ae60',
                    marginBottom: '1rem',
                    display: 'block'
                  }}></i>
                  <p style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    margin: '0 0 0.5rem 0'
                  }}>Click to upload images</p>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#7f8c8d',
                    margin: '0'
                  }}>or drag and drop your images here</p>
                </div>
              </div>

              {/* Image Preview Carousel */}
              {product.images.length > 0 && (
                <div style={{ 
                  marginTop: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '1rem',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div className="image-preview" style={{ 
                    position: 'relative',
                    width: '300px',
                    height: '200px',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid #eee'
                  }}>
                    {product.images.length > 0 ? (
                      <>
                        <img 
                          src={product.images[currentImageIndex]} 
                          alt={`Product ${currentImageIndex + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                        
                        {product.images.length > 1 && (
                          <>
                            <button 
                              type="button"
                              onClick={prevImage}
                              className="nav-button"
                              style={{ 
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ←
                            </button>
                            
                            <button 
                              type="button"
                              onClick={nextImage}
                              className="nav-button"
                              style={{ 
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              →
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: '#ccc',
                        fontSize: '48px'
                      }}>
                        ♡
                      </div>
                    )}
                  </div>
                  
                  {product.images.length > 1 && (
                    <div style={{ 
                      textAlign: 'center', 
                      marginTop: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#666'
                    }}>
                      {currentImageIndex + 1} of {product.images.length}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Video */}
            <div style={{ marginBottom: '3rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '1.1rem', 
                fontWeight: '700', 
                color: '#2c3e50',
                marginBottom: '0.8rem'
              }}>
                <i className="fas fa-video" style={{ 
                  marginRight: '0.5rem', 
                  color: '#27ae60' 
                }}></i>
                Product Video (optional):
              </label>
              
              <div style={{
                position: 'relative',
                border: '2px dashed #e9ecef',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <input 
                  type="file" 
                  name="video"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  pointerEvents: 'none'
                }}>
                  <i className="fas fa-play-circle" style={{
                    fontSize: '2.5rem',
                    color: '#6c757d',
                    marginBottom: '1rem',
                    display: 'block'
                  }}></i>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    margin: '0 0 0.5rem 0'
                  }}>Upload product video</p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#7f8c8d',
                    margin: '0'
                  }}>Optional: Add a video to showcase your product</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-button"
                style={{ 
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, #95a5a6, #bdc3c7)' 
                    : 'linear-gradient(135deg, #27ae60, #2ecc71)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '1.5rem 4rem', 
                  borderRadius: '50px', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  transition: 'all 0.3s ease',
                  boxShadow: isSubmitting 
                    ? '0 4px 15px rgba(149, 165, 166, 0.3)' 
                    : '0 8px 25px rgba(39, 174, 96, 0.4)',
                  width: '100%',
                  maxWidth: '400px',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = 'linear-gradient(135deg, #219a52, #27ae60)';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(39, 174, 96, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.4)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ 
                      marginRight: '0.8rem', 
                      fontSize: '1.1rem' 
                    }}></i>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle" style={{ 
                      marginRight: '0.8rem', 
                      fontSize: '1.1rem' 
                    }}></i>
                    Add Product to Marketplace
                  </>
                )}
              </button>
              
              <p style={{
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#7f8c8d',
                fontStyle: 'italic'
              }}>
                Your product will be reviewed and published within 24 hours
              </p>
            </div>
          </form>
        </div>

        <style>
          {`
            /* Desktop Enhancements */
            @media (min-width: 1200px) {
              .form-container {
                padding: 5rem !important;
              }
            }
            
            /* Tablet Styles */
            @media (max-width: 768px) {
              .form-container {
                padding: 2.5rem !important;
                margin: 1rem !important;
              }
              
              .image-preview {
                width: 280px !important;
                height: 180px !important;
              }
              
              .submit-button {
                width: 100% !important;
                max-width: none !important;
                padding: 1.2rem 2rem !important;
                font-size: 1.1rem !important;
              }
              
              h1 {
                font-size: 2.8rem !important;
              }
            }
            
            /* Mobile Styles */
            @media (max-width: 480px) {
              .form-container {
                padding: 1.5rem !important;
                margin: 0.5rem !important;
                border-radius: 15px !important;
              }
              
              .image-preview {
                width: 220px !important;
                height: 140px !important;
              }
              
              .nav-button {
                width: 25px !important;
                height: 25px !important;
                font-size: 14px !important;
              }
              
              .submit-button {
                padding: 1rem 1.5rem !important;
                font-size: 1rem !important;
              }
              
              h1 {
                font-size: 2.2rem !important;
              }
              
              /* Form field adjustments */
              input, textarea, select {
                padding: 1rem 1.2rem !important;
                font-size: 0.95rem !important;
              }
              
              label {
                font-size: 1rem !important;
              }
            }
            
            /* Hover effects for upload areas */
            .upload-area:hover {
              border-color: #27ae60 !important;
              background-color: rgba(39, 174, 96, 0.05) !important;
            }
          `}
        </style>
      </div>
    </div>
    </>
  );
};

export default AddProduct;
