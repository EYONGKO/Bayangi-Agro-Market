import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartCount } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 30.0;
  const tax = 0.0;
  const total = subtotal + shipping + tax;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)', padding: '1rem 0' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: 'transparent', borderRadius: '12px' }}>
        <style>
          {`
            @media (max-width: 768px) {
              .container {
                margin: 0 15px !important;
{{ ... }}
              }
              .cart-item {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 1rem !important;
              }
              .cart-item img {
                width: 100% !important;
                max-width: 200px !important;
                height: auto !important;
              }
              .cart-item-controls {
                width: 100% !important;
                justify-content: space-between !important;
              }
            }
            
            @media (max-width: 480px) {
              .container {
                margin: 0 10px !important;
                padding: 1rem !important;
              }
              .cart-summary-line {
                font-size: 1rem !important;
              }
              .cart-summary-line.total {
                font-size: 1.2rem !important;
              }
            }
            
            @media (max-width: 375px) {
              .container {
                margin: 0 5px !important;
                padding: 0.8rem !important;
              }
              h1 {
                font-size: 1.5rem !important;
              }
            }
          `}
        </style>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>Your Cart</h1>
      {cart.length === 0 ? (
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {cart.map((item) => (
              <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <img src={item.image || '/placeholders/no-image.png'} alt={item.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                <div className="cart-item-details" style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#222' }}>{item.name}</h4>
                  <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{item.price.toLocaleString('en-US')} CFA each</span>
                </div>
                <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    className="item-quantity"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.name, e.target.value)}
                    style={{ width: '60px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', textAlign: 'center' }}
                  />
                  <button
                    onClick={() => removeFromCart(item.name)}
                    style={{ backgroundColor: '#e74c3c', border: 'none', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary" style={{ borderTop: '2px solid #27ae60', paddingTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
            <div className="cart-summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString('en-US')} CFA</span>
            </div>
            <div className="cart-summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping:</span>
              <span>{shipping.toFixed(2)} CFA</span>
            </div>
            <div className="cart-summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Tax:</span>
              <span>{tax.toFixed(2)} CFA</span>
            </div>
            <div className="cart-summary-line total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900', color: '#27ae60' }}>
              <span>Total:</span>
              <span>{total.toLocaleString('en-US')} CFA</span>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Cart;
