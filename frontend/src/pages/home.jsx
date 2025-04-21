import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Globe, ChevronDown, Sun, Moon } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [darkTheme, setDarkTheme] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    } else {
      setLoggedInUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    localStorage.setItem('cartItems', JSON.stringify([...cartItems, product]));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    navigate('/');
  };

  // Rest of your existing product data...
  const featuredProducts = [
    // Your existing featured products data
  ];

  return (
    <div className={`container ${darkTheme ? "dark-theme" : "light-theme"}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>GULIT</h1>
        </div>
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={() => setDarkTheme(!darkTheme)}
          >
            {darkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="language-selector">
            <Globe size={20} />
            <span>{language}</span>
            <ChevronDown size={16} />
          </div>
          <button 
            className="cart-button"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={20} />
            <span>Cart ({cartItems.length})</span>
          </button>
          {loggedInUser && (
            <div className="user-menu">
              <button className="user-button">
                <User size={20} />
                <span>{loggedInUser.email}</span>
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Your existing sections from OnboardingPage */}
        <section className="featured-section">
          <h2>Featured Products</h2>
          <div className="featured-products">
            {featuredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button 
                    className="buy-button"
                    onClick={() => navigate('/checkout', { state: { product }})}
                  >
                    Buy Now
                  </button>
                  <button 
                    className="cart-add-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Additional sections from your OnboardingPage */}
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Your existing footer content */}
      </footer>
    </div>
  );
}

export default Home;