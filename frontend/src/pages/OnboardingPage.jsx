import React, { useState, useEffect } from "react";
// Import the CSS file
import "./OnboardingPage.css";

const OnboardingPage = () => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // State for language
  const [language, setLanguage] = useState("English");
  
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  
  // State for products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      image: "https://via.placeholder.com/200",
      discount: 15,
      rating: 4.5,
      description: "Premium noise cancelling wireless headphones with 30-hour battery life."
    },
    {
      id: 2,
      name: "Smartphone Pro",
      price: 899.99,
      image: "https://via.placeholder.com/200",
      discount: 10,
      rating: 4.8,
      description: "Latest smartphone with advanced camera system and all-day battery life."
    },
    {
      id: 3,
      name: "Laptop Ultra",
      price: 1299.90,
      image: "https://via.placeholder.com/200",
      discount: 20,
      rating: 4.7,
      description: "Ultra-thin laptop with powerful performance and stunning display."
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 154.33,
      image: "https://via.placeholder.com/200",
      discount: 5,
      rating: 4.3,
      description: "Track your fitness and stay connected with this premium smart watch."
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      price: 31.44,
      image: "https://via.placeholder.com/200",
      discount: 0,
      rating: 4.6,
      description: "True wireless earbuds with immersive sound and compact charging case."
    },
    {
      id: 6,
      name: "4K Smart TV",
      price: 340.00,
      image: "https://via.placeholder.com/200",
      discount: 12,
      rating: 4.4,
      description: "Crystal clear 4K resolution with smart features and slim design."
    },
  ]);
  
  // State for featured deals (carousel)
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const featuredDeals = [
    {
      id: 1,
      title: "Summer Collection 2023",
      description: "Discover the hottest tech deals with up to 50% off on selected premium items",
      image: "https://via.placeholder.com/800x400",
      color: "gradient-purple-pink"
    },
    {
      id: 2,
      title: "New Arrivals This Week",
      description: "Be the first to experience our latest cutting-edge products",
      image: "https://via.placeholder.com/800x400",
      color: "gradient-blue-teal"
    },
    {
      id: 3,
      title: "Flash Sale - 24 Hours Only!",
      description: "Lightning deals on premium electronics. Don't miss out!",
      image: "https://via.placeholder.com/800x400",
      color: "gradient-orange-red"
    },
  ];
  
  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // State for login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };
  
  // Buy now function
  const buyNow = (product) => {
    addToCart(product);
    // In a real app, this would navigate to checkout
    alert(`Proceeding to checkout for ${product.name}`);
  };
  
  // Next deal in carousel
  const nextDeal = () => {
    setCurrentDealIndex((prevIndex) => 
      prevIndex === featuredDeals.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Previous deal in carousel
  const prevDeal = () => {
    setCurrentDealIndex((prevIndex) => 
      prevIndex === 0 ? featuredDeals.length - 1 : prevIndex - 1
    );
  };
  
  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);
  
  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextDeal();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Icons as SVG components
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );

  const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );

  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  );

  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
  
  return (
    <div className={`min-h-screen flex-col ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Navbar */}
      <nav className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-brand">
              <span className="navbar-logo">GULIT</span>
            </div>
            
            <div className="navbar-search">
              <div className="search-container">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="search-input-container">
                  <div className="search-icon">
                    <SearchIcon />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className={`search-input ${darkMode ? 'dark-mode' : 'light-mode'}`}
                    placeholder="Search products..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="navbar-actions">
              <div className="navbar-actions-list">
                {/* Language Selector */}
                <div className="language-menu">
                  <button 
                    className="language-button"
                    onClick={() => document.getElementById('language-menu').classList.toggle('hidden')}
                  >
                    <GlobeIcon />
                    <span>{language}</span>
                  </button>
                  <div 
                    id="language-menu" 
                    className={`language-dropdown hidden ${darkMode ? 'dark-mode' : 'light-mode'}`}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {['English', 'Español', 'Français', '中文', 'العربية'].map((lang) => (
                        <button
                          key={lang}
                          className="language-option"
                          role="menuitem"
                          onClick={() => {
                            setLanguage(lang);
                            document.getElementById('language-menu').classList.add('hidden');
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Dark Mode Toggle */}
                <button 
                  onClick={toggleDarkMode}
                  className="navbar-action-button"
                >
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </button>
                
                {/* Login/Signup */}
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="navbar-action-button"
                >
                  <UserIcon />
                </button>
                
                {/* Cart */}
                <button className="navbar-action-button cart-button">
                  <CartIcon />
                  {cartItems.length > 0 && (
                    <span className="cart-count">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Featured Deals Carousel */}
        <div className="carousel">
          <div className="relative">
            {featuredDeals.map((deal, index) => (
              <div 
                key={deal.id}
                className={`carousel-slide ${index === currentDealIndex ? 'block' : 'hidden'}`}
              >
                <div className={`carousel-gradient ${deal.color}`}></div>
                <div className="carousel-content">
                  <div className="carousel-container">
                    <div className="carousel-text">
                      <span className="carousel-badge">Limited Time Offer</span>
                      <h2 className="carousel-title">{deal.title}</h2>
                      <p className="carousel-description">{deal.description}</p>
                      <div className="carousel-buttons">
                        <button className="carousel-button-primary">Shop Now</button>
                        <button className="carousel-button-secondary">Learn More</button>
                      </div>
                    </div>
                    <div className="carousel-image">
                      <div className="carousel-image-glow"></div>
                      <img
                        src={deal.image || "/placeholder.svg"}
                        alt={deal.title}
                        className="carousel-image-img"
                      />
                      <div className="carousel-discount-badge">Save 50%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Carousel Controls */}
            <button 
              onClick={prevDeal}
              className="carousel-control carousel-control-prev"
            >
              <ChevronLeftIcon />
            </button>
            <button 
              onClick={nextDeal}
              className="carousel-control carousel-control-next"
            >
              <ChevronRightIcon />
            </button>
            
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {featuredDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealIndex(index)}
                  className={`carousel-indicator ${index === currentDealIndex ? 'active' : ''}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Listing */}
        <div className={`products-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <div className="products-container">
            <div className="products-header">
              <h2 className="products-title">Featured Products</h2>
              <div className="products-filters">
                <button className="filter-button">All</button>
                <button className="filter-button">New Arrivals</button>
                <button className="filter-button">Best Sellers</button>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="product-card"
                  >
                    <div className="product-image-container">
                      <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name} 
                        className="product-image"
                      />
                      {product.discount > 0 && (
                        <div className="product-discount-badge">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button className="product-wishlist-button">
                        <HeartIcon />
                      </button>
                      <div className="product-image-overlay"></div>
                      <div className="product-actions">
                        <div className="product-actions-container">
                          <button 
                            onClick={() => addToCart(product)}
                            className="product-action-button product-action-cart"
                          >
                            Add to Cart
                          </button>
                          <button 
                            onClick={() => buyNow(product)}
                            className="product-action-button product-action-buy"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="product-details">
                      <div className="product-header">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-rating">
                          <StarIcon className="product-rating-star" />
                          <span className="product-rating-value">{product.rating}</span>
                        </div>
                      </div>
                      
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-price-container">
                        <div className="product-price">
                          {product.discount > 0 ? (
                            <>
                              <span className="product-current-price">
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              <span className="product-original-price">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="product-current-price">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="product-stock">In Stock</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="load-more-container">
              <button className="load-more-button">Load More Products</button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`footer ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <h3 className="footer-title">GULIT</h3>
              <p className="footer-text">Your one-stop shop for all your needs. Quality products, competitive prices, and exceptional service.</p>
              <div className="footer-social">
                <a href="#" className="social-link"><FacebookIcon /></a>
                <a href="#" className="social-link"><TwitterIcon /></a>
                <a href="#" className="social-link"><InstagramIcon /></a>
                <a href="#" className="social-link"><LinkedinIcon /></a>
              </div>
            </div>
            
            <div>
              <h3 className="footer-title">Shop</h3>
              <ul className="footer-links">
                <li className="footer-link"><a href="#">All Products</a></li>
                <li className="footer-link"><a href="#">Featured Items</a></li>
                <li className="footer-link"><a href="#">New Arrivals</a></li>
                <li className="footer-link"><a href="#">Special Offers</a></li>
                <li className="footer-link"><a href="#">Coming Soon</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li className="footer-link"><a href="#">Contact Us</a></li>
                <li className="footer-link"><a href="#">FAQs</a></li>
                <li className="footer-link"><a href="#">Shipping Policy</a></li>
                <li className="footer-link"><a href="#">Returns & Refunds</a></li>
                <li className="footer-link"><a href="#">Order Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="footer-title">Newsletter</h3>
              <p className="footer-text">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`newsletter-input ${darkMode ? 'dark-mode' : 'light-mode'}`}
                />
                <button 
                  type="submit"
                  className="newsletter-button"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">&copy; {new Date().getFullYear()} GULIT. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#" className="footer-legal-link">Privacy Policy</a>
              <a href="#" className="footer-legal-link">Terms of Service</a>
              <a href="#" className="footer-legal-link">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-overlay" onClick={() => setShowLoginModal(false)}></div>
            
            <div className={`modal-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
              <div className="modal-body">
                <div className="modal-header">
                  <h3 className="modal-title">Sign In</h3>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className={`form-input ${darkMode ? 'dark-mode' : 'light-mode'}`}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className={`form-input ${darkMode ? 'dark-mode' : 'light-mode'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="form-checkbox-group">
                    <div className="form-checkbox-container">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <label htmlFor="remember-me" className="form-checkbox-label">
                        Remember me
                      </label>
                    </div>
                    
                    <div>
                      <a href="#" className="form-link">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <button type="submit" className="form-submit">
                      Sign in
                    </button>
                  </div>
                  
                  <div className="form-text">
                    Don't have an account?{' '}
                    <a href="#" className="form-link">
                      Sign up
                    </a>
                  </div>
                </div>
              </div>
              <div className={`modal-footer ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
