import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';

type CommunityScreenRouteProp = RouteProp<{
  Community: {
    communityId: string;
    communityName: string;
  };
}, 'Community'>;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CommunityScreenRouteProp>();
  const { addToCart, getTotalItems } = useCart();
  
  const { communityId, communityName } = route.params;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample products data - in a real app, this would come from an API
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: 'Handwoven Basket',
      price: 15000,
      description: 'Beautiful handwoven basket made from local materials',
      image: 'https://via.placeholder.com/300x200?text=Handwoven+Basket',
      category: 'Crafts',
      community: communityId,
      vendor: 'Local Artisan',
      stock: 10,
      rating: 4.5,
      reviews: 12
    },
    {
      id: 2,
      name: 'Fresh Cocoa Beans',
      price: 8000,
      description: 'Premium quality cocoa beans from local farms',
      image: 'https://via.placeholder.com/300x200?text=Fresh+Cocoa+Beans',
      category: 'Food',
      community: communityId,
      vendor: 'Farm Fresh',
      stock: 25,
      rating: 4.8,
      reviews: 8
    },
    {
      id: 3,
      name: 'Wooden Carving',
      price: 25000,
      description: 'Intricate wooden carving representing local culture',
      image: 'https://via.placeholder.com/300x200?text=Wooden+Carving',
      category: 'Crafts',
      community: communityId,
      vendor: 'Master Craftsman',
      stock: 5,
      rating: 4.9,
      reviews: 15
    },
    {
      id: 4,
      name: 'Palm Oil',
      price: 5000,
      description: 'Pure, unrefined palm oil from local producers',
      image: 'https://via.placeholder.com/300x200?text=Palm+Oil',
      category: 'Food',
      community: communityId,
      vendor: 'Oil Producers Coop',
      stock: 50,
      rating: 4.3,
      reviews: 20
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, [communityId]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const categories = ['All', 'Food', 'Crafts', 'Textiles', 'Art'];

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>{item.price.toLocaleString()} CFA</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart" size={16} color="#ffffff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{communityName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartButton}>
            <Ionicons name="cart" size={24} color="#333" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category || (category === 'All' && !selectedCategory)
                ? styles.categoryButtonActive
                : null
            ]}
            onPress={() => setSelectedCategory(category === 'All' ? '' : category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category || (category === 'All' && !selectedCategory)
                  ? styles.categoryTextActive
                  : null
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />
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
  cartButton: {
    position: 'relative',
    padding: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#2ecc71',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default CommunityScreen;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';

type CommunityScreenRouteProp = RouteProp<{
  Community: {
    communityId: string;
    communityName: string;
  };
}, 'Community'>;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CommunityScreenRouteProp>();
  const { addToCart, getTotalItems } = useCart();
  
  const { communityId, communityName } = route.params;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample products data - in a real app, this would come from an API
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: 'Handwoven Basket',
      price: 15000,
      description: 'Beautiful handwoven basket made from local materials',
      image: 'https://via.placeholder.com/300x200?text=Handwoven+Basket',
      category: 'Crafts',
      community: communityId,
      vendor: 'Local Artisan',
      stock: 10,
      rating: 4.5,
      reviews: 12
    },
    {
      id: 2,
      name: 'Fresh Cocoa Beans',
      price: 8000,
      description: 'Premium quality cocoa beans from local farms',
      image: 'https://via.placeholder.com/300x200?text=Fresh+Cocoa+Beans',
      category: 'Food',
      community: communityId,
      vendor: 'Farm Fresh',
      stock: 25,
      rating: 4.8,
      reviews: 8
    },
    {
      id: 3,
      name: 'Wooden Carving',
      price: 25000,
      description: 'Intricate wooden carving representing local culture',
      image: 'https://via.placeholder.com/300x200?text=Wooden+Carving',
      category: 'Crafts',
      community: communityId,
      vendor: 'Master Craftsman',
      stock: 5,
      rating: 4.9,
      reviews: 15
    },
    {
      id: 4,
      name: 'Palm Oil',
      price: 5000,
      description: 'Pure, unrefined palm oil from local producers',
      image: 'https://via.placeholder.com/300x200?text=Palm+Oil',
      category: 'Food',
      community: communityId,
      vendor: 'Oil Producers Coop',
      stock: 50,
      rating: 4.3,
      reviews: 20
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, [communityId]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const categories = ['All', 'Food', 'Crafts', 'Textiles', 'Art'];

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>{item.price.toLocaleString()} CFA</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart" size={16} color="#ffffff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{communityName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartButton}>
            <Ionicons name="cart" size={24} color="#333" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category || (category === 'All' && !selectedCategory)
                ? styles.categoryButtonActive
                : null
            ]}
            onPress={() => setSelectedCategory(category === 'All' ? '' : category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category || (category === 'All' && !selectedCategory)
                  ? styles.categoryTextActive
                  : null
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />
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
  cartButton: {
    position: 'relative',
    padding: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#2ecc71',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default CommunityScreen;
