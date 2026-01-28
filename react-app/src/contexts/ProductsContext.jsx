import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts, getProductsByCommunity, addProduct as addProductToData, persistProducts } from '../data/products';

// Import the products object directly for manipulation
import { products } from '../data/products';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load initial products
  useEffect(() => {
    setAllProducts(getAllProducts());
  }, []);

  // Function to add a new product and trigger re-render
  const addProduct = (productData) => {
    const newProduct = addProductToData(productData);
    setAllProducts(getAllProducts()); // Refresh all products
    setLastUpdate(Date.now()); // Trigger updates in components
    return newProduct;
  };

  // Function to check and remove NEW flags from old products
  const updateNewFlags = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let hasUpdates = false;
    
    Object.keys(products).forEach(communityKey => {
      products[communityKey].forEach(product => {
        if (product.isNew && product.dateAdded) {
          const productDate = new Date(product.dateAdded);
          if (productDate < sevenDaysAgo) {
            product.isNew = false;
            hasUpdates = true;
          }
        }
      });
    });
    
    if (hasUpdates) {
      persistProducts();
      setLastUpdate(Date.now());
    }
  };

  // Function to get products by community (reactive)
  const getProductsByCommunityReactive = (communityName) => {
    updateNewFlags(); // Check for expired NEW flags
    return getProductsByCommunity(communityName);
  };

  // Function to get all products (reactive)
  const getAllProductsReactive = () => {
    updateNewFlags(); // Check for expired NEW flags
    return getAllProducts();
  };

  const value = {
    allProducts,
    lastUpdate,
    addProduct,
    getProductsByCommunityReactive,
    getAllProductsReactive
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
