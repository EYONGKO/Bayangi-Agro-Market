import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import GlobalMarketScreen from './src/screens/GlobalMarketScreen';
import TopArtisansScreen from './src/screens/TopArtisansScreen';

// Import context providers
import { CartProvider } from './src/context/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2ecc71',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Local Roots Commerce' }}
            />
            <Stack.Screen 
              name="Community" 
              component={CommunityScreen}
              options={({ route }) => ({ title: route.params?.communityName || 'Community' })}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ title: 'Shopping Cart' }}
            />
            <Stack.Screen 
              name="AddProduct" 
              component={AddProductScreen}
              options={{ title: 'Add Product' }}
            />
            <Stack.Screen 
              name="GlobalMarket" 
              component={GlobalMarketScreen}
              options={{ title: 'Global Market' }}
            />
            <Stack.Screen 
              name="TopArtisans" 
              component={TopArtisansScreen}
              options={{ title: 'Top Artisans' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import GlobalMarketScreen from './src/screens/GlobalMarketScreen';
import TopArtisansScreen from './src/screens/TopArtisansScreen';

// Import context providers
import { CartProvider } from './src/context/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2ecc71',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Local Roots Commerce' }}
            />
            <Stack.Screen 
              name="Community" 
              component={CommunityScreen}
              options={({ route }) => ({ title: route.params?.communityName || 'Community' })}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ title: 'Shopping Cart' }}
            />
            <Stack.Screen 
              name="AddProduct" 
              component={AddProductScreen}
              options={{ title: 'Add Product' }}
            />
            <Stack.Screen 
              name="GlobalMarket" 
              component={GlobalMarketScreen}
              options={{ title: 'Global Market' }}
            />
            <Stack.Screen 
              name="TopArtisans" 
              component={TopArtisansScreen}
              options={{ title: 'Top Artisans' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
