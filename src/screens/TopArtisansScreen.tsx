import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  community: string;
  rating: number;
  productsSold: number;
  image: string;
  description: string;
  featuredProducts: string[];
}

const TopArtisansScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [selectedFilter, setSelectedFilter] = useState('All');

  const artisans: Artisan[] = [
    {
      id: 1,
      name: 'Marie Nguema',
      specialty: 'Wood Carving',
      community: 'Kendem',
      rating: 4.9,
      productsSold: 156,
      image: 'https://via.placeholder.com/150x150?text=Marie+Nguema',
      description: 'Master wood carver with 20+ years of experience creating traditional African sculptures.',
      featuredProducts: ['Wooden Mask', 'Sculpture Set', 'Decorative Bowl']
    },
    {
      id: 2,
      name: 'John Fon',
      specialty: 'Textile Weaving',
      community: 'Mamfe',
      rating: 4.8,
      productsSold: 203,
      image: 'https://via.placeholder.com/150x150?text=John+Fon',
      description: 'Expert weaver specializing in traditional patterns and modern designs.',
      featuredProducts: ['Handwoven Scarf', 'Table Runner', 'Wall Hanging']
    },
    {
      id: 3,
      name: 'Grace Moshie',
      specialty: 'Pottery',
      community: 'Moshie-Kekpoti',
      rating: 4.9,
      productsSold: 189,
      image: 'https://via.placeholder.com/150x150?text=Grace+Moshie',
      description: 'Ceramic artist creating functional and decorative pottery pieces.',
      featuredProducts: ['Ceramic Vase', 'Coffee Mug Set', 'Decorative Plate']
    },
    {
      id: 4,
      name: 'Peter Widikum',
      specialty: 'Basket Weaving',
      community: 'Widikum',
      rating: 4.7,
      productsSold: 134,
      image: 'https://via.placeholder.com/150x150?text=Peter+Widikum',
      description: 'Traditional basket weaver using sustainable materials and techniques.',
      featuredProducts: ['Storage Basket', 'Market Basket', 'Decorative Basket']
    },
    {
      id: 5,
      name: 'Sarah Membe',
      specialty: 'Jewelry Making',
      community: 'Membe',
      rating: 4.8,
      productsSold: 167,
      image: 'https://via.placeholder.com/150x150?text=Sarah+Membe',
      description: 'Jewelry designer creating unique pieces with local materials and modern techniques.',
      featuredProducts: ['Beaded Necklace', 'Earring Set', 'Bracelet Collection']
    },
    {
      id: 6,
      name: 'David Fonjo',
      specialty: 'Metal Work',
      community: 'Fonjo',
      rating: 4.6,
      productsSold: 98,
      image: 'https://via.placeholder.com/150x150?text=David+Fonjo',
      description: 'Metal craftsman specializing in traditional tools and decorative items.',
      featuredProducts: ['Decorative Spoon', 'Wall Art', 'Garden Tool']
    }
  ];

  const communities = ['All', 'Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie-Kekpoti'];

  const filteredArtisans = selectedFilter === 'All' 
    ? artisans 
    : artisans.filter(artisan => artisan.community === selectedFilter);

  const renderArtisan = ({ item }: { item: Artisan }) => (
    <View style={styles.artisanCard}>
      <Image source={{ uri: item.image }} style={styles.artisanImage} />
      
      <View style={styles.artisanInfo}>
        <Text style={styles.artisanName}>{item.name}</Text>
        <Text style={styles.artisanSpecialty}>{item.specialty}</Text>
        <Text style={styles.artisanCommunity}>{item.community}</Text>
        
        <View style={styles.artisanStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cube" size={16} color="#2ecc71" />
            <Text style={styles.statText}>{item.productsSold} sold</Text>
          </View>
        </View>
        
        <Text style={styles.artisanDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.featuredProducts}>
          <Text style={styles.featuredTitle}>Featured Products:</Text>
          <Text style={styles.featuredList}>
            {item.featuredProducts.join(' • ')}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
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
        <Text style={styles.headerTitle}>Top Artisans</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {communities.map((community) => (
          <TouchableOpacity
            key={community}
            style={[
              styles.filterButton,
              selectedFilter === community && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(community)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === community && styles.filterTextActive
              ]}
            >
              {community}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Featured Artisans</Text>
        <Text style={styles.infoText}>
          Discover our top-rated artisans and their amazing work. 
          These talented creators have earned recognition for their quality and craftsmanship.
        </Text>
      </View>

      {/* Artisans List */}
      <FlatList
        data={filteredArtisans}
        renderItem={renderArtisan}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.artisansList}
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
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#2ecc71',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  artisansList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  artisanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artisanImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
  },
  artisanInfo: {
    alignItems: 'center',
  },
  artisanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  artisanSpecialty: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '500',
    marginBottom: 5,
  },
  artisanCommunity: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  artisanStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    fontWeight: '500',
  },
  artisanDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  featuredProducts: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featuredList: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  viewProfileButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewProfileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopArtisansScreen;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  community: string;
  rating: number;
  productsSold: number;
  image: string;
  description: string;
  featuredProducts: string[];
}

const TopArtisansScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [selectedFilter, setSelectedFilter] = useState('All');

  const artisans: Artisan[] = [
    {
      id: 1,
      name: 'Marie Nguema',
      specialty: 'Wood Carving',
      community: 'Kendem',
      rating: 4.9,
      productsSold: 156,
      image: 'https://via.placeholder.com/150x150?text=Marie+Nguema',
      description: 'Master wood carver with 20+ years of experience creating traditional African sculptures.',
      featuredProducts: ['Wooden Mask', 'Sculpture Set', 'Decorative Bowl']
    },
    {
      id: 2,
      name: 'John Fon',
      specialty: 'Textile Weaving',
      community: 'Mamfe',
      rating: 4.8,
      productsSold: 203,
      image: 'https://via.placeholder.com/150x150?text=John+Fon',
      description: 'Expert weaver specializing in traditional patterns and modern designs.',
      featuredProducts: ['Handwoven Scarf', 'Table Runner', 'Wall Hanging']
    },
    {
      id: 3,
      name: 'Grace Moshie',
      specialty: 'Pottery',
      community: 'Moshie-Kekpoti',
      rating: 4.9,
      productsSold: 189,
      image: 'https://via.placeholder.com/150x150?text=Grace+Moshie',
      description: 'Ceramic artist creating functional and decorative pottery pieces.',
      featuredProducts: ['Ceramic Vase', 'Coffee Mug Set', 'Decorative Plate']
    },
    {
      id: 4,
      name: 'Peter Widikum',
      specialty: 'Basket Weaving',
      community: 'Widikum',
      rating: 4.7,
      productsSold: 134,
      image: 'https://via.placeholder.com/150x150?text=Peter+Widikum',
      description: 'Traditional basket weaver using sustainable materials and techniques.',
      featuredProducts: ['Storage Basket', 'Market Basket', 'Decorative Basket']
    },
    {
      id: 5,
      name: 'Sarah Membe',
      specialty: 'Jewelry Making',
      community: 'Membe',
      rating: 4.8,
      productsSold: 167,
      image: 'https://via.placeholder.com/150x150?text=Sarah+Membe',
      description: 'Jewelry designer creating unique pieces with local materials and modern techniques.',
      featuredProducts: ['Beaded Necklace', 'Earring Set', 'Bracelet Collection']
    },
    {
      id: 6,
      name: 'David Fonjo',
      specialty: 'Metal Work',
      community: 'Fonjo',
      rating: 4.6,
      productsSold: 98,
      image: 'https://via.placeholder.com/150x150?text=David+Fonjo',
      description: 'Metal craftsman specializing in traditional tools and decorative items.',
      featuredProducts: ['Decorative Spoon', 'Wall Art', 'Garden Tool']
    }
  ];

  const communities = ['All', 'Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie-Kekpoti'];

  const filteredArtisans = selectedFilter === 'All' 
    ? artisans 
    : artisans.filter(artisan => artisan.community === selectedFilter);

  const renderArtisan = ({ item }: { item: Artisan }) => (
    <View style={styles.artisanCard}>
      <Image source={{ uri: item.image }} style={styles.artisanImage} />
      
      <View style={styles.artisanInfo}>
        <Text style={styles.artisanName}>{item.name}</Text>
        <Text style={styles.artisanSpecialty}>{item.specialty}</Text>
        <Text style={styles.artisanCommunity}>{item.community}</Text>
        
        <View style={styles.artisanStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cube" size={16} color="#2ecc71" />
            <Text style={styles.statText}>{item.productsSold} sold</Text>
          </View>
        </View>
        
        <Text style={styles.artisanDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.featuredProducts}>
          <Text style={styles.featuredTitle}>Featured Products:</Text>
          <Text style={styles.featuredList}>
            {item.featuredProducts.join(' • ')}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
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
        <Text style={styles.headerTitle}>Top Artisans</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {communities.map((community) => (
          <TouchableOpacity
            key={community}
            style={[
              styles.filterButton,
              selectedFilter === community && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(community)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === community && styles.filterTextActive
              ]}
            >
              {community}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Featured Artisans</Text>
        <Text style={styles.infoText}>
          Discover our top-rated artisans and their amazing work. 
          These talented creators have earned recognition for their quality and craftsmanship.
        </Text>
      </View>

      {/* Artisans List */}
      <FlatList
        data={filteredArtisans}
        renderItem={renderArtisan}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.artisansList}
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
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#2ecc71',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  artisansList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  artisanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artisanImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
  },
  artisanInfo: {
    alignItems: 'center',
  },
  artisanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  artisanSpecialty: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '500',
    marginBottom: 5,
  },
  artisanCommunity: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  artisanStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    fontWeight: '500',
  },
  artisanDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  featuredProducts: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featuredList: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  viewProfileButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewProfileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TopArtisansScreen;
