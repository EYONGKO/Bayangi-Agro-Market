import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { communities } from '../data/communities';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { getTotalItems } = useCart();

  const handleCommunityPress = (communityId: string) => {
    navigation.navigate('Community', { 
      communityId,
      communityName: communities.find(c => c.id === communityId)?.name 
    });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleGlobalMarketPress = () => {
    navigation.navigate('GlobalMarket');
  };

  const handleTopArtisansPress = () => {
    navigation.navigate('TopArtisans');
  };

  const handleAddProductPress = () => {
    navigation.navigate('AddProduct');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#2ecc71" />
      
      {/* Navigation Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Local Roots</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
            <Ionicons name="cart" size={24} color="#333" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Join Our Community</Text>
          <Text style={styles.heroSubtitle}>
            Connect with local farmers, artisans, and food enthusiasts
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Select Your Community Section */}
        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Select Your Community</Text>
          <Text style={styles.sectionSubtitle}>
            Each community has its own unique global marketplace showcasing local artisans, farmers, and their authentic products
          </Text>
          
          <View style={styles.communityGrid}>
            {communities.map((community) => (
              <TouchableOpacity
                key={community.id}
                style={styles.communityCard}
                onPress={() => handleCommunityPress(community.id)}
              >
                <Image source={community.heroImage} style={styles.communityImage} />
                <View style={styles.communityOverlay}>
                  <Text style={styles.communityName}>Explore {community.name}</Text>
                  <Text style={styles.communityDescription}>{community.description}</Text>
                  
                  <View style={styles.communityStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="storefront" size={20} color="#2ecc71" />
                      <Text style={styles.statText}>{community.vendorCount}+ Vendors</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="cube" size={20} color="#2ecc71" />
                      <Text style={styles.statText}>{community.productCount}+ Products</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Community Stories Section */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Ready to Start Your Global Business?</Text>
          <Text style={styles.sectionSubtitle}>
            Join thousands of artisans and farmers already selling their products worldwide through our platform
          </Text>
          
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Register as Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleGlobalMarketPress}
          >
            <Ionicons name="globe" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Global Market</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleTopArtisansPress}
          >
            <Ionicons name="star" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Top Artisans</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleAddProductPress}
          >
            <Ionicons name="add-circle" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Add Product</Text>
          </TouchableOpacity>
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
    backgroundColor: '#2ecc71',
    borderBottomWidth: 1,
    borderBottomColor: '#27ae60',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 10,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#2ecc71',
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 300,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.95,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
  },
  communitySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  communityCard: {
    width: '48%',
    height: 220,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  communityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  communityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  communityDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    textAlign: 'center',
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  storiesSection: {
    backgroundColor: '#f8f9fa',
    padding: 30,
    alignItems: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2ecc71',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2ecc71',
    marginTop: 5,
    fontWeight: '500',
  },
});

export default HomeScreen;

  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { communities } from '../data/communities';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { getTotalItems } = useCart();

  const handleCommunityPress = (communityId: string) => {
    navigation.navigate('Community', { 
      communityId,
      communityName: communities.find(c => c.id === communityId)?.name 
    });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleGlobalMarketPress = () => {
    navigation.navigate('GlobalMarket');
  };

  const handleTopArtisansPress = () => {
    navigation.navigate('TopArtisans');
  };

  const handleAddProductPress = () => {
    navigation.navigate('AddProduct');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#2ecc71" />
      
      {/* Navigation Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Local Roots</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
            <Ionicons name="cart" size={24} color="#333" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Join Our Community</Text>
          <Text style={styles.heroSubtitle}>
            Connect with local farmers, artisans, and food enthusiasts
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Select Your Community Section */}
        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Select Your Community</Text>
          <Text style={styles.sectionSubtitle}>
            Each community has its own unique global marketplace showcasing local artisans, farmers, and their authentic products
          </Text>
          
          <View style={styles.communityGrid}>
            {communities.map((community) => (
              <TouchableOpacity
                key={community.id}
                style={styles.communityCard}
                onPress={() => handleCommunityPress(community.id)}
              >
                <Image source={community.heroImage} style={styles.communityImage} />
                <View style={styles.communityOverlay}>
                  <Text style={styles.communityName}>Explore {community.name}</Text>
                  <Text style={styles.communityDescription}>{community.description}</Text>
                  
                  <View style={styles.communityStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="storefront" size={20} color="#2ecc71" />
                      <Text style={styles.statText}>{community.vendorCount}+ Vendors</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="cube" size={20} color="#2ecc71" />
                      <Text style={styles.statText}>{community.productCount}+ Products</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Community Stories Section */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Ready to Start Your Global Business?</Text>
          <Text style={styles.sectionSubtitle}>
            Join thousands of artisans and farmers already selling their products worldwide through our platform
          </Text>
          
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Register as Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleGlobalMarketPress}
          >
            <Ionicons name="globe" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Global Market</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleTopArtisansPress}
          >
            <Ionicons name="star" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Top Artisans</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleAddProductPress}
          >
            <Ionicons name="add-circle" size={24} color="#2ecc71" />
            <Text style={styles.quickActionText}>Add Product</Text>
          </TouchableOpacity>
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
    backgroundColor: '#2ecc71',
    borderBottomWidth: 1,
    borderBottomColor: '#27ae60',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 10,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#2ecc71',
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 300,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.95,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
  },
  communitySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  communityCard: {
    width: '48%',
    height: 220,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  communityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  communityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  communityDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    textAlign: 'center',
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  storiesSection: {
    backgroundColor: '#f8f9fa',
    padding: 30,
    alignItems: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2ecc71',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2ecc71',
    marginTop: 5,
    fontWeight: '500',
  },
});

export default HomeScreen;
