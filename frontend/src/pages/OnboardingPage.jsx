"use client"

import { useState } from "react"
import "./onboardingpage.css"
import { Search, ShoppingCart, User, Globe, ChevronDown, X, Sun, Moon } from "lucide-react"

export default function OnboardingPage() {
  const [darkTheme, setDarkTheme] = useState(false)

  const toggleTheme = () => {
    setDarkTheme(!darkTheme)
  }
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [language, setLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const languages = ["English", "Spanish", "French", "German", "Japanese"]

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your fitness, sleep, and notifications with this sleek smartwatch",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Portable Speaker",
      description: "Waterproof Bluetooth speaker with immersive 360° sound",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Laptop Backpack",
      description: "Anti-theft backpack with USB charging port and laptop compartment",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=200&h=200&auto=format&fit=crop",
    },
  ]

  const specialDeals = [
    {
      id: 5,
      name: "Premium Smartphone",
      description: "Latest model with advanced camera system and all-day battery life",
      originalPrice: 999.99,
      salePrice: 849.99,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&h=300&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      description: "True wireless earbuds with active noise cancellation",
      originalPrice: 179.99,
      salePrice: 129.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeuj8focJiIvgsHrWuHv4UeJ_QbWQoP0sDzg&s?q=50&w=200&h=200&auto=format&fit=crop",
    },
  ]

  const popularProducts = [
    {
      id: 7,
      name: "Coffee Maker",
      description: "Programmable coffee maker with thermal carafe",
      price: 89.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf_4-Ij8GSWN21qTjfeXKpuR3W_wEer8IgUQ&s",
    },
    {
      id: 8,
      name: "Fitness Tracker",
      description: "Track steps, heart rate, and sleep quality",
      price: 69.99,
      image: "data:image/jpeg;base64,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",
    },
    {
      id: 9,
      name: "Wireless Charger",
      description: "Fast wireless charging pad for smartphones",
      price: 39.99,
      image: "data:image/jpeg;base64,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",
    },
    {
      id: 10,
      name: "Bluetooth Speaker",
      description: "Compact speaker with powerful bass",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=150&h=150&auto=format&fit=crop",
    },
    {
      id: 11,
      name: "Smart Bulb Set",
      description: "Color-changing smart bulbs with voice control",
      price: 49.99,
      image: "data:image/jpeg;base64,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",
    },
    {
      id: 12,
      name: "Portable Power Bank",
      description: "20,000mAh high-capacity power bank",
      price: 45.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlhVZhPG-TFKycQHIShCb6RzbM7AxngXupCA&s",
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
          <input type="text" placeholder="Search for products..." />
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
          <button className="cart-button">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </button>
          <button className="login-button" onClick={() => setShowLoginModal(true)}>
            <User size={20} />
            <span>Login</span>
          </button>
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
                  <button className="buy-button">Buy Now</button>
                  <button className="cart-add-button">Add to Cart</button>
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
                    <button className="buy-button">Buy Now</button>
                    <button className="cart-add-button">Add to Cart</button>
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
                      <button className="cart-add-button">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
              <h2>Login to Your Account</h2>
              <button className="close-button" onClick={() => setShowLoginModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" />
              </div>
              <div className="form-actions">
                <button type="submit" className="login-submit">
                  Login
                </button>
              </div>
              <div className="form-footer">
                <p>
                  Don't have an account? <a href="#">Sign up</a>
                </p>
                <p>
                  <a href="#">Forgot password?</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}