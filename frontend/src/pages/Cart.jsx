import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard } from 'lucide-react';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // Handle payment processing here
    alert('Order placed successfully!');
    setCartItems([]);
    localStorage.removeItem('cartItems');
    navigate('/home');
  };

  return (
    <div className="container p-4">
      <header className="flex items-center mb-6">
        <button 
          className="flex items-center text-primary-600"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to Shopping</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p>Your cart is empty</p>
            <button
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded"
              onClick={() => navigate('/home')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-primary-600 font-bold">${item.price}</p>
                  </div>
                  <button
                    className="text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <div className="mt-6 text-right">
                <p className="text-xl font-bold">
                  Total: ${calculateTotal()}
                </p>
                <button
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* Checkout Form */}
            {showCheckout && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Checkout</h2>
                <form onSubmit={handleCheckout}>
                  {/* Form fields */}
                  <div className="grid gap-4">
                    <div>
                      <label className="block mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    {/* Add more form fields */}
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Pay ${calculateTotal()}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;