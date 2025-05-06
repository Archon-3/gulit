"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./onboardingpage.css"
import { Search, ShoppingCart, User, Globe, ChevronDown, X, Sun, Moon } from "lucide-react"

export default function OnboardingPage({ onLogin }) {
  const [darkTheme, setDarkTheme] = useState(false)
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  const navigate = useNavigate()

  const toggleTheme = () => {
    setDarkTheme(!darkTheme)
  }

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [language, setLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const languages = ["English", "Spanish", "French", "German", "Japanese"]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")
    setFormSuccess("")

    try {
      // Check for admin credentials
      if (formData.email === "abeni@gmail.com" && formData.password === "@@@@@@@") {
        setFormSuccess("Admin login successful!")

        // Create admin user object
        const adminUser = {
          id: 999, // Special admin ID
          name: "Admin User",
          email: "abeni@gmail.com",
          isAdmin: true, // Add admin flag
        }

        // Call the onLogin prop to update auth state in parent component
        onLogin(adminUser)

        // Navigate to admin dashboard after successful login
        setTimeout(() => {
          navigate("/admin")
        }, 1500)

        setIsLoading(false)
        return
      }

      // Regular user authentication (existing code)
      const response = await fetch("http://localhost/gulit/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setFormSuccess(data.message)
        setLoggedInUser(data.user)

        // Call the onLogin prop to update auth state in parent component
        onLogin(data.user)

        // Navigate to home page after successful login
        setTimeout(() => {
          navigate("/home")
        }, 1500)
      } else {
        setFormError(data.message)
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")
    setFormSuccess("")

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("All fields are required")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost/gulit/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setFormSuccess(data.message)
        // Auto switch to login form after successful registration
        setTimeout(() => {
          setIsLoginForm(true)
          setFormData({
            ...formData,
            password: "",
          })
          setFormSuccess("")
        }, 1500)
      } else {
        setFormError(data.message)
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.")
      console.error("Signup error:", error)
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
    setFormError("")
    setFormSuccess("")
    setFormData({
      email: "",
      password: "",
      name: "",
    })
  }

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
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeuj8focJiIvgsHrWuHv4UeJ_QbWQoP0sDzg&s?q=50&w=200&h=200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=150&h=150&auto=format&fit=crop",
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
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Can't search directly from onboarding page since user needs to log in first
              setShowLoginModal(true)
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
          <button className="cart-button">
            <ShoppingCart size={20} />
            <span>Cart</span>
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
            <button className="cta-button" onClick={() => setShowLoginModal(true)}>
              Shop Now
            </button>
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
                  <button className="buy-button" onClick={() => setShowLoginModal(true)}>
                    Buy Now
                  </button>
                  <button className="cart-add-button" onClick={() => setShowLoginModal(true)}>
                    Add to Cart
                  </button>
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
           
          </div>
        </section>

        
      </main>

 
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="modal-header">
              <h2>{isLoginForm ? "Login to Your Account" : "Create an Account"}</h2>
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

            
              <div className="form-actions">
                <button type="submit" className="login-submit" disabled={isLoading}>
                  {isLoading ? "Please wait..." : isLoginForm ? "Login" : "Sign Up"}
                </button>
              </div>

              <div className="form-footer">
                <p>
                  {isLoginForm ? "Don't have an account? " : "Already have an account? "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleForm()
                    }}
                  >
                    {isLoginForm ? "Sign up" : "Login"}
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
    </div>
  )
}
