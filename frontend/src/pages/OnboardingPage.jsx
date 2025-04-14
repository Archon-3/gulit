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
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your fitness, sleep, and notifications with this sleek smartwatch",
      price: 249.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Portable Speaker",
      description: "Waterproof Bluetooth speaker with immersive 360° sound",
      price: 129.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Laptop Backpack",
      description: "Anti-theft backpack with USB charging port and laptop compartment",
      price: 79.99,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const specialDeals = [
    {
      id: 5,
      name: "Premium Smartphone",
      description: "Latest model with advanced camera system and all-day battery life",
      originalPrice: 999.99,
      salePrice: 849.99,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      description: "True wireless earbuds with active noise cancellation",
      originalPrice: 179.99,
      salePrice: 129.99,
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const popularProducts = [
    {
      id: 7,
      name: "Coffee Maker",
      description: "Programmable coffee maker with thermal carafe",
      price: 89.99,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 8,
      name: "Fitness Tracker",
      description: "Track steps, heart rate, and sleep quality",
      price: 69.99,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 9,
      name: "Wireless Charger",
      description: "Fast wireless charging pad for smartphones",
      price: 39.99,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 10,
      name: "Bluetooth Speaker",
      description: "Compact speaker with powerful bass",
      price: 59.99,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 11,
      name: "Smart Bulb Set",
      description: "Color-changing smart bulbs with voice control",
      price: 49.99,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 12,
      name: "Portable Power Bank",
      description: "20,000mAh high-capacity power bank",
      price: 45.99,
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  return (
    <div className={`onboarding-container ${darkTheme ? "dark-theme" : "light-theme"}`}>
      <header className="header">
        <div className="logo">
          <h1>TechShop</h1>
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
            <h1>Welcome to TechShop</h1>
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
          <p>TechShop is your one-stop destination for the latest technology products and accessories.</p>
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
          <p>Email: support@techshop.com</p>
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
