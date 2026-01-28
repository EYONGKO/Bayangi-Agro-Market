import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    vendor: '',
    community: '',
    stock: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(formData.price))) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    // In a real app, this would submit to an API
    Alert.alert(
      'Success',
      'Product added successfully! It will be reviewed before going live.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const categories = ['Food', 'Crafts', 'Textiles', 'Art', 'Other'];
  const communities = ['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie-Kekpoti'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Product Image */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Image *</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter product name"
            />
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price (CFA) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="Enter price in CFA"
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your product"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.categoryButtonActive
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vendor Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vendor Name</Text>
            <TextInput
              style={styles.input}
              value={formData.vendor}
              onChangeText={(value) => handleInputChange('vendor', value)}
              placeholder="Your name or business name"
            />
          </View>

          {/* Community */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community</Text>
            <View style={styles.communityContainer}>
              {communities.map((community) => (
                <TouchableOpacity
                  key={community}
                  style={[
                    styles.communityButton,
                    formData.community === community && styles.communityButtonActive
                  ]}
                  onPress={() => handleInputChange('community', community)}
                >
                  <Text
                    style={[
                      styles.communityText,
                      formData.community === community && styles.communityTextActive
                    ]}
                  >
                    {community}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stock */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              value={formData.stock}
              onChangeText={(value) => handleInputChange('stock', value)}
              placeholder="Enter available quantity"
              keyboardType="numeric"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Product</Text>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 200,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  communityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  communityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  communityButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  communityText: {
    fontSize: 14,
    color: '#666',
  },
  communityTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    vendor: '',
    community: '',
    stock: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(formData.price))) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    // In a real app, this would submit to an API
    Alert.alert(
      'Success',
      'Product added successfully! It will be reviewed before going live.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const categories = ['Food', 'Crafts', 'Textiles', 'Art', 'Other'];
  const communities = ['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie-Kekpoti'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Product Image */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Image *</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#ccc" />
                  <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter product name"
            />
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price (CFA) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="Enter price in CFA"
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your product"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.categoryButtonActive
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vendor Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vendor Name</Text>
            <TextInput
              style={styles.input}
              value={formData.vendor}
              onChangeText={(value) => handleInputChange('vendor', value)}
              placeholder="Your name or business name"
            />
          </View>

          {/* Community */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community</Text>
            <View style={styles.communityContainer}>
              {communities.map((community) => (
                <TouchableOpacity
                  key={community}
                  style={[
                    styles.communityButton,
                    formData.community === community && styles.communityButtonActive
                  ]}
                  onPress={() => handleInputChange('community', community)}
                >
                  <Text
                    style={[
                      styles.communityText,
                      formData.community === community && styles.communityTextActive
                    ]}
                  >
                    {community}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stock */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              value={formData.stock}
              onChangeText={(value) => handleInputChange('stock', value)}
              placeholder="Enter available quantity"
              keyboardType="numeric"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Product</Text>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 200,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  communityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  communityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  communityButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  communityText: {
    fontSize: 14,
    color: '#666',
  },
  communityTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;
