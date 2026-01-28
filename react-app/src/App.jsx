import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Home from './pages/Home';
import Community from './pages/Community';
import GlobalMarket from './pages/GlobalMarket';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community/:name" element={<Community />} />
            <Route path="/global-market" element={<GlobalMarket />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
