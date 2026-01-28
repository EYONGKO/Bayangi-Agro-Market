// DOM Elements
const modal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const closeBtn = document.querySelector('.close');

// Get current community name from the page title
const communityName = document.title.split(' - ')[0].toLowerCase();

// Construct the localStorage key for products in this community
const communityProductsKey = `community-products-${communityName}`;

// Initialize cart count
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Modal Functions
function openAddProductModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    addProductForm.reset();
}

// Event Listeners
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Product Management
function addProduct(e) {
    e.preventDefault();
    
    const product = {
        id: Date.now(),
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value), // Ensure price is a number
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        community: communityName // Store community name with the product
    };

    // Get existing products for this community using the specific key
    let products = JSON.parse(localStorage.getItem(communityProductsKey)) || [];
    
    // Add the new product and save back to localStorage
    products.push(product);
    localStorage.setItem(communityProductsKey, JSON.stringify(products));

    console.log(`Product added to community ${communityName}. Saved to key: ${communityProductsKey}`, product);

    closeModal();
    loadProducts(); // Reload products for the current community page
}

if (addProductForm) {
    addProductForm.addEventListener('submit', addProduct);
}

// Load Products for the *current* community page
function loadProducts() {
    // Load products specifically for this community using the specific key
    const communityProducts = JSON.parse(localStorage.getItem(communityProductsKey)) || [];
    
    console.log(`Loading products for community ${communityName} from key: ${communityProductsKey}`, communityProducts);

    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
        console.error('Product grid element (#product-grid) not found on this page.');
        return;
    }
    
    productGrid.innerHTML = ''; // Clear current products
    
    if (communityProducts.length === 0) {
        productGrid.innerHTML = '<p>No products posted in this community yet.</p>';
    } else {
        communityProducts.forEach(product => {
             // Ensure product and its ID are valid before creating card
             if (product && product.id !== undefined && product.id !== null) {
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
             } else {
                 console.warn('Skipping invalid product data during load:', product);
             }
        });
    }
}

// Create Product Card (used by loadProducts on community pages)
// This function is for rendering products on the *community* pages, not the global market
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <span class="product-badge">$${product.price}</span>
        <span class="heart-icon"><i class="fas fa-heart"></i></span>
        <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.name}">
        <!-- Optional: Seller avatar (use product.sellerAvatar or fallback) -->
        ${product.sellerAvatar ? `<img src="${product.sellerAvatar}" class="seller-avatar" alt="Seller">` : ''}
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <!-- Link to the product detail page -->
            <a href="product-details.html?community=${product.community}&id=${product.id}" class="add-to-cart-btn" style="text-decoration: none; display: inline-block; padding: 10px; background-color: #28a745; color: white; border-radius: 5px; margin-top: 10px;">
                 View Details
            </a>
             <!-- Removed direct Add to Cart button here to avoid confusion -->
        </div>
    `;
    return card;
}

// Cart Functions
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Only attempt to load products if a productGrid element exists (i.e., on a community page)
    if (document.getElementById('product-grid')) {
        loadProducts();
    }
}); 