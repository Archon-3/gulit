"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "./CartContext"
import { Search, ShoppingCart, User, Globe, ChevronDown, Sun, Moon, ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import "./onboardingpage.css"

export default function Cart({ currentUser }) {
  const [darkTheme, setDarkTheme] = useState(false)
  const [language, setLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const navigate = useNavigate()

  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getCartCount, clearCart, updateUserId } = useCart()

  const languages = ["English", "Spanish", "French", "German", "Japanese"]

  // Load user data on component mount
  useEffect(() => {
    if (currentUser) {
      setLoggedInUser(currentUser)
      // Update cart context with current user ID
      updateUserId(currentUser.id)
    } else {
      // Redirect to onboarding if not logged in
      navigate("/")
    }
  }, [currentUser, navigate, updateUserId])

  const toggleTheme = () => {
    setDarkTheme(!darkTheme)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className={`onboarding-container ${darkTheme ? "dark-theme" : "light-theme"}`}>
      <header className="header">
        <div className="logo">
          <h1>GULIT</h1>
        </div>
        <div className="search-bar">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate(`/home?search=${e.target.elements[0].value}`)
            }}
            style={{ display: "flex", width: "100%" }}
          >
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search for products..." />
          </form>
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
          <Link to="/cart" className="cart-button">
            <ShoppingCart size={20} />
            <span>Cart ({getCartCount()})</span>
          </Link>
          {loggedInUser && (
            <div className="user-menu">
              <button className="user-button">
                <User size={20} />
                <span>{loggedInUser.name || loggedInUser.email}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        <div className="featured-section">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <Link
              to="/home"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: "var(--text-color)",
              }}
            >
              <ArrowLeft size={20} />
              <span>Back to Shopping</span>
            </Link>
            <h2 style={{ margin: 0, marginLeft: "auto" }}>Your Shopping Cart</h2>
          </div>

          {cartItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                backgroundColor: "var(--background-card)",
                borderRadius: "var(--border-radius)",
                marginBottom: "2rem",
              }}
            >
              <ShoppingCart size={64} style={{ color: "var(--text-secondary)", margin: "0 auto 1rem" }} />
              <h3>Your cart is empty</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to="/home">
                <button className="cta-button">Start Shopping</button>
              </Link>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 300px",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      style={{
                        display: "flex",
                        backgroundColor: "var(--background-card)",
                        borderRadius: "var(--border-radius)",
                        padding: "1rem",
                        marginBottom: "1rem",
                        gap: "1rem",
                        position: "relative",
                      }}
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "var(--border-radius)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{item.name}</h3>
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.9rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "var(--secondary-color)",
                              margin: 0,
                            }}
                          >
                            ${Number.parseFloat(item.salePrice || item.price || 0).toFixed(2)}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                border: "none",
                                backgroundColor: "var(--background-light)",
                                cursor: "pointer",
                              }}
                            >
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                border: "none",
                                backgroundColor: "var(--background-light)",
                                cursor: "pointer",
                              }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: "var(--background-card)",
                    borderRadius: "var(--border-radius)",
                    padding: "1.5rem",
                    height: "fit-content",
                    position: "sticky",
                    top: "2rem",
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Order Summary</h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span>${Number.parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>Tax</span>
                    <span>${(Number.parseFloat(getTotalPrice() || 0) * 0.1).toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "var(--border-color)",
                      margin: "1rem 0",
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <span>Total</span>
                    <span>${(Number.parseFloat(getTotalPrice() || 0) * 1.1).toFixed(2)}</span>
                  </div>

                  <button className="cta-button" style={{ width: "100%", marginBottom: "1rem" }}>
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={clearCart}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "transparent",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius)",
                      cursor: "pointer",
                      transition: "background-color var(--transition-speed)",
                    }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
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
          <p>Phone: +251944134122
          </p>
          <p>Address: 04 Street, Adama</p>
        </div>
      </footer>
    </div>
  )
}
