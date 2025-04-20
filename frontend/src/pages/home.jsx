"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Globe, ChevronDown, X, Sun, Moon, Plus, Minus, CreditCard, MapPin, Truck } from "lucide-react"
import "./onboardingpage.css"

export default function Home() {
  const [darkTheme, setDarkTheme] = useState(false)
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  const toggleTheme = () => {
    setDarkTheme(!darkTheme)
  }
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [language, setLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [cart, setCart] = useState([])

  const languages = ["English", "Spanish", "French", "German", "Japanese"]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts([...featuredProducts, ...popularProducts])
    } else {
      const query = searchQuery.toLowerCase()
      const combined = [...featuredProducts, ...popularProducts, ...specialDeals]
      const filtered = combined.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery])

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError('')
    setFormSuccess('')

    try {
      const response = await fetch('http://localhost/gulit/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        setFormSuccess(data.message)
        setLoggedInUser(data.user)
        setTimeout(() => {
          setShowLoginModal(false)
        }, 1500)
      } else {
        setFormError(data.message)
      }
    } catch (error) {
      setFormError('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError('')
    setFormSuccess('')

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('All fields are required')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost/gulit/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        setFormSuccess(data.message)
        // Auto switch to login form after successful registration
        setTimeout(() => {
          setIsLoginForm(true)
          setFormData({
            ...formData,
            password: ''
          })
          setFormSuccess('')
        }, 1500)
      } else {
        setFormError(data.message)
      }
    } catch (error) {
      setFormError('An error occurred. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null)
  }

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm)
    setFormError('')
    setFormSuccess('')
    setFormData({
      email: '',
      password: '',
      name: ''
    })
  }

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  // Update item quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price
      return total + (price * item.quantity)
    }, 0)
  }

  // Handle buy now
  const handleBuyNow = (product) => {
    addToCart(product)
    setShowCart(true)
  }

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPaymentModal(true)
    setShowCart(false)
  }

  // Process payment
  const processPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setFormSuccess('Payment successful! Your order is being processed.')
      setCart([])
      setShowPaymentModal(false)
    }, 1500)
  }

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
      price: 199.99,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your fitness, sleep, and notifications with this sleek smartwatch",
      price: 249.99,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Portable Speaker",
      description: "Waterproof Bluetooth speaker with immersive 360° sound",
      price: 129.99,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Laptop Backpack",
      description: "Anti-theft backpack with USB charging port and laptop compartment",
      price: 79.99,
      image: "/placeholder.svg",
    },
  ]

  const specialDeals = [
    {
      id: 5,
      name: "Premium Smartphone",
      description: "Latest model with advanced camera system and all-day battery life",
      originalPrice: 999.99,
      salePrice: 849.99,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      description: "True wireless earbuds with active noise cancellation",
      originalPrice: 179.99,
      salePrice: 129.99,
      image: "/placeholder.svg",
    },
  ]

  const popularProducts = [
    {
      id: 7,
      name: "Coffee Maker",
      description: "Programmable coffee maker with thermal carafe",
      price: 89.99,
      image: "/placeholder.svg",
    },
    {
      id: 8,
      name: "Fitness Tracker",
      description: "Track steps, heart rate, and sleep quality",
      price: 69.99,
      image: "/placeholder.svg",
    },
    {
      id: 9,
      name: "Wireless Charger",
      description: "Fast wireless charging pad for smartphones",
      price: 39.99,
      image: "/placeholder.svg",
    },
    {
      id: 10,
      name: "Bluetooth Speaker",
      description: "Compact speaker with powerful bass",
      price: 59.99,
      image: "/placeholder.svg",
    },
    {
      id: 11,
      name: "Smart Bulb Set",
      description: "Color-changing smart bulbs with voice control",
      price: 49.99,
      image: "/placeholder.svg",
    },
    {
      id: 12,
      name: "Portable Power Bank",
      description: "20,000mAh high-capacity power bank",
      price: 45.99,
      image: "/placeholder.svg",
    },
  ]

  return (
    <div className={`onboarding-container ${darkTheme ? "dark-theme" : "light-theme"}`}>
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
            onChange={handleSearchChange}
          />
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="language-selector" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
            <Globe size={20} />
            <span>{language}</span>
            <ChevronDown size={16} />
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="language-option"
                    onClick={() => {
                      setLanguage(lang)
                      setShowLanguageDropdown(false)
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="cart-button" onClick={() => setShowCart(true)}>
            <ShoppingCart size={20} />
            <span>Cart ({cart.length})</span>
          </button>
          {loggedInUser ? (
            <div className="user-menu">
              <button className="user-button">
                <User size={20} />
                <span>{loggedInUser.email}</span>
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowLoginModal(true)}>
              <User size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Gulit</h1>
            <p>Discover the latest tech products at unbeatable prices</p>
            <button className="cta-button">Shop Now</button>
          </div>
        </section>

        {searchQuery ? (
          <section className="search-results-section">
            <h2>Search Results for "{searchQuery}"</h2>
            <div className="search-results">
              {filteredProducts.length > 0 ? (
                <div className="featured-products">
                  {filteredProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">
                        {product.salePrice ? (
                          <>
                            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                            <span className="sale-price">${product.salePrice.toFixed(2)}</span>
                          </>
                        ) : (
                          `$${product.price.toFixed(2)}`
                        )}
                      </p>
                      <div className="product-actions">
                        <button className="buy-button" onClick={() => handleBuyNow(product)}>Buy Now</button>
                        <button className="cart-add-button" onClick={() => addToCart(product)}>Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No products found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="featured-section">
              <h2>Featured Products</h2>
              <div className="featured-products">
                {featuredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <div className="product-actions">
                      <button className="buy-button" onClick={() => handleBuyNow(product)}>Buy Now</button>
                      <button className="cart-add-button" onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="special-deals-section">
              <h2>Special Deals</h2>
              <div className="special-deals-header">
                <p>Limited time offers on our best products</p>
              </div>
              <div className="special-deals">
                {specialDeals.map((deal) => (
                  <div className="deal-card" key={deal.id}>
                    <div className="deal-badge">SPECIAL OFFER</div>
                    <div className="deal-discount-badge">
                      {Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100)}% OFF
                    </div>
                    <img src={deal.image || "/placeholder.svg"} alt={deal.name} />
                    <div className="deal-content">
                      <h3>{deal.name}</h3>
                      <p className="product-description">{deal.description}</p>
                      <div className="deal-price">
                        <p className="original-price">${deal.originalPrice.toFixed(2)}</p>
                        <p className="sale-price">${deal.salePrice.toFixed(2)}</p>
                      </div>
                      <div className="product-actions">
                        <button className="buy-button" onClick={() => handleBuyNow(deal)}>Buy Now</button>
                        <button className="cart-add-button" onClick={() => addToCart(deal)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="popular-section">
              <h2>Popular Items</h2>
              <div className="section-header">
                <p>Trending products loved by our customers</p>
              </div>
              <div className="popular-products-container">
                <div className="popular-products">
                  {popularProducts.map((product) => (
                    <div className="popular-product-card" key={product.id}>
                      <div className="popular-badge">Popular</div>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      <div className="popular-product-content">
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="popular-product-footer">
                          <p className="product-price">${product.price.toFixed(2)}</p>
                          <button className="cart-add-button" onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>GULIT is your one-stop destination for the latest technology products and accessories.</p>
        </div>
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>My Account</h3>
          <ul>
            <li>Sign In</li>
            <li>View Cart</li>
            <li>Order History</li>
            <li>Track Order</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@Gulitshop.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Tech Street, Digital City</p>
        </div>
      </footer>

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="modal-header">
              <h2>{isLoginForm ? 'Login to Your Account' : 'Create an Account'}</h2>
              <button className="close-button" onClick={() => setShowLoginModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            {formError && <div className="form-error">{formError}</div>}
            {formSuccess && <div className="form-success">{formSuccess}</div>}
            
            <form className="login-form" onSubmit={isLoginForm ? handleLogin : handleSignup}>
              {!isLoginForm && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="login-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Please wait...' : (isLoginForm ? 'Login' : 'Sign Up')}
                </button>
              </div>
              
              <div className="form-footer">
                <p>
                  {isLoginForm ? "Don't have an account? " : "Already have an account? "}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                    {isLoginForm ? 'Sign up' : 'Login'}
                  </a>
                </p>
                {isLoginForm && (
                  <p>
                    <a href="#">Forgot password?</a>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="cart-overlay">
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2>Your Shopping Cart</h2>
              <button className="close-button" onClick={() => setShowCart(false)}>
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={50} />
                <p>Your cart is empty</p>
                <button className="cta-button" onClick={() => setShowCart(false)}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">
                          ${(item.salePrice || item.price).toFixed(2)}
                        </p>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h2>Checkout</h2>
              <button className="close-button" onClick={() => setShowPaymentModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            {formSuccess && <div className="form-success">{formSuccess}</div>}
            
            <div className="payment-content">
              <div className="cart-summary-section">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cart.map((item) => (
                    <div className="summary-item" key={item.id}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="payment-methods">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'credit-card' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('credit-card')}
                  >
                    <CreditCard size={24} />
                    <span>Credit Card</span>
                  </div>
                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="payment-icon">P</div>
                    <span>PayPal</span>
                  </div>
                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'bank' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('bank')}
                  >
                    <div className="payment-icon">B</div>
                    <span>Bank Transfer</span>
                  </div>
                </div>
              </div>
              
              {selectedPaymentMethod === 'credit-card' && (
                <div className="credit-card-form">
                  <div className="form-group">
                    <label htmlFor="card-name">Cardholder Name</label>
                    <input type="text" id="card-name" placeholder="Name on card" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry Date</label>
                      <input type="text" id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input type="text" id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="shipping-address">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" placeholder="Street address" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" placeholder="City" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postal-code">Postal Code</label>
                    <input type="text" id="postal-code" placeholder="Postal code" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select id="country">
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
              </div>
              
              <button className="place-order-button" onClick={processPayment}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Cart Styles */
        .cart-overlay {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        
        .cart-sidebar {
          width: 100%;
          height: 100%;
          background-color: var(--background-card);
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 15px var(--shadow-color);
          animation: slideIn 0.3s ease-out;
          transition: background-color var(--transition-speed);
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        
        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          height: 100%;
          gap: 1rem;
          color: var(--text-secondary);
        }
        
        .cart-item {
          display: flex;
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          gap: 1rem;
          position: relative;
        }
        
        .cart-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--border-radius);
        }
        
        .cart-item-details {
          flex: 1;
        }
        
        .cart-item-details h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .cart-item-price {
          font-weight: bold;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quantity-controls button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: 1px solid var(--border-color);
          background-color: var(--background-light);
          border-radius: 4px;
          cursor: pointer;
        }
        
        .remove-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .cart-summary {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        
        .checkout-button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-speed);
        }
        
        .checkout-button:hover {
          background-color: var(--primary-hover);
        }
        
        /* Payment Modal Styles */
        .payment-modal {
          background-color: var(--background-card);
          border-radius: var(--border-radius);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px var(--shadow-color);
          animation: modalFadeIn 0.3s ease-out;
          transition: background-color var(--transition-speed);
        }
        
        .payment-content {
          padding: 1.5rem;
        }
        
        .cart-summary-section {
          margin-bottom: 2rem;
        }
        
        .cart-summary-section h3,
        .payment-methods h3,
        .shipping-address h3 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .summary-items {
          margin-bottom: 1rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          font-weight: bold;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid var(--border-color);
        }
        
        .payment-methods {
          margin-bottom: 2rem;
        }
        
        .payment-options {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .payment-option {
          flex: 1;
          min-width: 120px;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: border-color var(--transition-speed), background-color var(--transition-speed);
        }
        
        .payment-option.selected {
          border-color: var(--primary-color);
          background-color: rgba(79, 70, 229, 0.1);
        }
        
        .payment-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          font-weight: bold;
        }
        
        .credit-card-form {
          margin-bottom: 2rem;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .place-order-button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-speed);
          margin-top: 1rem;
        }
        
        .place-order-button:hover {
          background-color: var(--primary-hover);
        }
        
        /* Search Results Styles */
        .search-results-section {
          padding: 2rem 1rem;
        }
        
        .search-results-section h2 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
          background-color: var(--background-light);
          border-radius: var(--border-radius);
          color: var(--text-secondary);
        }
        
        /* Responsive Fixes */
        @media (max-width: 768px) {
          .cart-overlay {
            max-width: 100%;
          }
          
          .payment-modal {
            max-width: 100%;
            border-radius: 0;
            max-height: 100vh;
            height: 100vh;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}