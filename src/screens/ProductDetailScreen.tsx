import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';

type ProductDetailScreenRouteProp = RouteProp<{
  ProductDetail: {
    product: Product;
  };
}, 'ProductDetail'>;

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { addToCart } = useCart();
  
  const { product } = route.params;

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCommunity}>{product.community}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= (product.rating || 0) ? 'star' : 'star-outline'}
                  size={20}
                  color="#ffc107"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          <Text style={styles.productPrice}>{product.price.toLocaleString()} CFA</Text>
          
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="storefront" size={20} color="#2ecc71" />
              <Text style={styles.metaText}>Vendor: {product.vendor}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cube" size={20} color="#2ecc71" />
              <Text style={styles.metaText}>Category: {product.category}</Text>
            </View>
            {product.stock && (
              <View style={styles.metaItem}>
                <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                <Text style={styles.metaText}>In Stock: {product.stock} units</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart" size={20} color="#2ecc71" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Community</Text>
            <Text style={styles.infoValue}>{product.community}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vendor</Text>
            <Text style={styles.infoValue}>{product.vendor}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>{product.price.toLocaleString()} CFA</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productCommunity: {
    fontSize: 16,
    color: '#2ecc71',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  productMeta: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2ecc71',
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 25,
  },
  addToCartText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalInfo: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProductDetailScreen;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';

type ProductDetailScreenRouteProp = RouteProp<{
  ProductDetail: {
    product: Product;
  };
}, 'ProductDetail'>;

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { addToCart } = useCart();
  
  const { product } = route.params;

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCommunity}>{product.community}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= (product.rating || 0) ? 'star' : 'star-outline'}
                  size={20}
                  color="#ffc107"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          <Text style={styles.productPrice}>{product.price.toLocaleString()} CFA</Text>
          
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="storefront" size={20} color="#2ecc71" />
              <Text style={styles.metaText}>Vendor: {product.vendor}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cube" size={20} color="#2ecc71" />
              <Text style={styles.metaText}>Category: {product.category}</Text>
            </View>
            {product.stock && (
              <View style={styles.metaItem}>
                <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                <Text style={styles.metaText}>In Stock: {product.stock} units</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart" size={20} color="#2ecc71" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Community</Text>
            <Text style={styles.infoValue}>{product.community}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vendor</Text>
            <Text style={styles.infoValue}>{product.vendor}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>{product.price.toLocaleString()} CFA</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productCommunity: {
    fontSize: 16,
    color: '#2ecc71',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  productMeta: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2ecc71',
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 25,
  },
  addToCartText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalInfo: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProductDetailScreen;
