"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useCart } from "./CartContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ShoppingCart,
  User,
  Globe,
  ChevronDown,
  X,
  Sun,
  Moon,
  Settings,
  Package,
  PlusCircle,
  ShoppingBag,
  LogOut,
  Trash2,
  Edit,
  Users,
  Compass,
} from "lucide-react"
import "./onboardingpage.css"

export default function Home({ onLogout, currentUser }) {
  const [darkTheme, setDarkTheme] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [language, setLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [specialDealIndex, setSpecialDealIndex] = useState(0)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showMyItemsModal, setShowMyItemsModal] = useState(false)
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "electronics",
  })
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [userItems, setUserItems] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [marketplaceItems, setMarketplaceItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState([])
  const [displayedMarketplaceItems, setDisplayedMarketplaceItems] = useState([])
  const [lastRotationTime, setLastRotationTime] = useState(Date.now())
  // New state for active category
  const [activeCategory, setActiveCategory] = useState("explore")
  // New state for category-filtered items
  const [categoryItems, setCategoryItems] = useState([])

  const location = useLocation()
  const profileRef = useRef(null)
  const navigate = useNavigate()
  const { addToCart, getCartCount, updateUserId } = useCart()

  const languages = ["English", "Spanish", "French", "German", "Japanese"]
  const categories = ["electronics", "clothing", "home", "beauty", "sports", "books", "toys", "other"]

  // Load user data on component mount
  useEffect(() => {
    // Check for search query in URL parameters
    const params = new URLSearchParams(location.search)
    const searchParam = params.get("search")
    if (searchParam) {
      setSearchQuery(searchParam)
    }

    // Check for category in URL parameters
    const categoryParam = params.get("category")
    if (categoryParam && [...categories, "explore"].includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }

    if (currentUser) {
      setLoggedInUser(currentUser)
      setProfileData({
        ...profileData,
        name: currentUser.name || "",
        email: currentUser.email || "",
      })

      // Update cart context with current user ID
      updateUserId(currentUser.id)

      // Check if user is admin based on the isAdmin flag or email
      setIsAdmin(currentUser.isAdmin || currentUser.email === "abeni@gmail.com")

      // Fetch user items from backend
      fetchUserItems(currentUser.id)
    } else {
      // Redirect to onboarding if not logged in
      navigate("/")
    }

    // Fetch all marketplace items (from all sellers)
    fetchMarketplaceItems()
  }, [navigate, currentUser, updateUserId, location.search, categories])

  // Filter items by category when activeCategory changes
  useEffect(() => {
    if (activeCategory === "explore") {
      // Don't filter for "explore" - show all items
      setCategoryItems([])
    } else if (marketplaceItems.length > 0) {
      // Filter items by the selected category
      const filtered = marketplaceItems.filter((item) => item.category === activeCategory)
      setCategoryItems(filtered)
    }
  }, [activeCategory, marketplaceItems])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileRef])

  // Auto-rotate special deals
  useEffect(() => {
    const interval = setInterval(() => {
      setSpecialDealIndex((prevIndex) => (prevIndex === specialDeals.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch user items from backend
  const fetchUserItems = async (userId) => {
    try {
      const response = await fetch(`http://localhost/gulit/get_items.php?user_id=${userId}`)
      const data = await response.json()

      if (data.status === "success") {
        setUserItems(data.items)
      } else {
        console.error("Failed to fetch items:", data.message)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  // Add a new function to fetch all marketplace items
  const fetchMarketplaceItems = async () => {
    try {
      const response = await fetch("http://localhost/gulit/get_items.php")
      const data = await response.json()

      if (data.status === "success") {
        setMarketplaceItems(data.items)
      } else {
        console.error("Failed to fetch marketplace items:", data.message)
      }
    } catch (error) {
      console.error("Error fetching marketplace items:", error)
    }
  }

  const toggleTheme = () => {
    setDarkTheme(!darkTheme)
  }

  const handleLogout = () => {
    // Update cart context to clear the cart
    updateUserId(null)
    onLogout()
    navigate("/")
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    // Update URL with the category parameter
    const params = new URLSearchParams(location.search)
    params.set("category", category)
    navigate(`${location.pathname}?${params.toString()}`)
  }

  // Update the handleAddItem function to also refresh marketplace items
  const handleAddItem = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")
    setFormSuccess("")

    // Validate form
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      setFormError("Please fill all required fields")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", newItem.name)
      formData.append("description", newItem.description)
      formData.append("price", newItem.price)
      formData.append("category", newItem.category)
      formData.append("user_id", loggedInUser.id)

      // If editing an item, include the item ID
      if (itemToEdit) {
        formData.append("item_id", itemToEdit.id)
      }

      // If image is a URL, send it as is
      if (newItem.image && newItem.image.startsWith("http")) {
        formData.append("image_url", newItem.image)
      } else if (newItem.image) {
        // If image is a file, it would be handled here
        // This would require a file input in the form
        // formData.append("image_file", newItem.image)
      }

      const endpoint = itemToEdit ? "http://localhost/gulit/update_item.php" : "http://localhost/gulit/add_item.php"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.status === "success") {
        setFormSuccess(itemToEdit ? "Item updated successfully!" : "Item added successfully!")

        // Refresh user items
        fetchUserItems(loggedInUser.id)

        // Refresh marketplace items
        fetchMarketplaceItems()

        // Reset form and close modal after a delay
        setTimeout(() => {
          setNewItem({
            name: "",
            description: "",
            price: "",
            image: "",
            category: "electronics",
          })
          setItemToEdit(null)
          setShowAddItemModal(false)
          setFormSuccess("")
        }, 1500)
      } else {
        setFormError(data.message || "An error occurred")
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.")
      console.error("Add/Update item error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleDeleteItem function to also refresh marketplace items
  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost/gulit/delete_item.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: itemToDelete.id,
          user_id: loggedInUser.id,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Remove item from local state
        setUserItems(userItems.filter((item) => item.id !== itemToDelete.id))

        // Refresh marketplace items
        fetchMarketplaceItems()

        setShowDeleteConfirmModal(false)
        setItemToDelete(null)
      } else {
        alert(data.message || "Failed to delete item")
      }
    } catch (error) {
      console.error("Delete item error:", error)
      alert("An error occurred while deleting the item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = (item) => {
    setItemToEdit(item)
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category || "electronics",
    })
    setShowAddItemModal(true)
    setShowMyItemsModal(false)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")
    setFormSuccess("")

    // Validate form
    if (!profileData.name || !profileData.email) {
      setFormError("Name and email are required")
      setIsLoading(false)
      return
    }

    // If changing password, validate password fields
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setFormError("Current password is required to set a new password")
        setIsLoading(false)
        return
      }

      if (profileData.newPassword.length < 6) {
        setFormError("New password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        setFormError("New passwords do not match")
        setIsLoading(false)
        return
      }
    }

    try {
      const response = await fetch("http://localhost/gulit/update_profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: loggedInUser.id,
          name: profileData.name,
          email: profileData.email,
          current_password: profileData.currentPassword,
          new_password: profileData.newPassword || null,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setFormSuccess("Profile updated successfully!")

        // Update local user data
        const updatedUser = {
          ...loggedInUser,
          name: profileData.name,
          email: profileData.email,
        }

        setLoggedInUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Reset password fields
        setProfileData({
          ...profileData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        // Close modal after a delay
        setTimeout(() => {
          setShowProfileSettingsModal(false)
          setFormSuccess("")
        }, 1500)
      } else {
        setFormError(data.message || "Failed to update profile")
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.")
      console.error("Update profile error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewItem({
      ...newItem,
      [id]: value,
    })
  }

  const handleProfileInputChange = (e) => {
    const { id, value } = e.target
    setProfileData({
      ...profileData,
      [id]: value,
    })
  }

  // Product data
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
    {
      id: 7,
      name: "Gaming Console",
      description: "Next-gen gaming console with 4K graphics and 1TB storage",
      originalPrice: 499.99,
      salePrice: 449.99,
      image: "/placeholder.svg",
    },
  ]

  const popularProducts = [
    {
      id: 8,
      name: "Coffee Maker",
      description: "Programmable coffee maker with thermal carafe",
      price: 89.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf_4-Ij8GSWN21qTjfeXKpuR3W_wEer8IgUQ&s",
    },
    {
      id: 9,
      name: "Fitness Tracker",
      description: "Track steps, heart rate, and sleep quality",
      price: 69.99,
      image: "/placeholder.svg",
    },
    {
      id: 10,
      name: "Wireless Charger",
      description: "Fast wireless charging pad for smartphones",
      price: 39.99,
      image: "/placeholder.svg",
    },
    {
      id: 11,
      name: "Bluetooth Speaker",
      description: "Compact speaker with powerful bass",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=150&h=150&auto=format&fit=crop",
    },
    {
      id: 12,
      name: "Smart Bulb Set",
      description: "Color-changing smart bulbs with voice control",
      price: 49.99,
      image: "/placeholder.svg",
    },
    {
      id: 13,
      name: "Portable Power Bank",
      description: "20,000mAh high-capacity power bank",
      price: 45.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlhVZhPG-TFKycQHIShCb6RzbM7AxngXupCA&s",
    },
  ]

  // Animation variants for framer-motion
  const dealCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.3,
      },
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Add this function to get a random subset of items
  const getRandomItems = (items, count) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Add this effect to handle marketplace items rotation
  useEffect(() => {
    if (marketplaceItems.length > 0) {
      // If we have more than 15 items, show only 15 random ones
      if (marketplaceItems.length > 15) {
        setDisplayedMarketplaceItems(getRandomItems(marketplaceItems, 15))
      } else {
        // If we have 15 or fewer items, show all of them
        setDisplayedMarketplaceItems(marketplaceItems)
      }
    }
  }, [marketplaceItems])

  // Add this effect to rotate displayed items every 5 minutes
  useEffect(() => {
    const rotationInterval = 5 * 60 * 1000 // 5 minutes in milliseconds

    const intervalId = setInterval(() => {
      if (marketplaceItems.length > 15) {
        setDisplayedMarketplaceItems(getRandomItems(marketplaceItems, 15))
        setLastRotationTime(Date.now())
      }
    }, rotationInterval)

    return () => clearInterval(intervalId)
  }, [marketplaceItems])

  // Add a new useEffect to handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // If search is empty, don't filter
      setFilteredItems([])
      return
    }

    // Filter ALL marketplace items based on search query, not just displayed ones
    const query = searchQuery.toLowerCase().trim()
    const filtered = marketplaceItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query)),
    )
    setFilteredItems(filtered)
  }, [searchQuery, marketplaceItems])

  // Add a function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Add a function to handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // The filtering is already handled by the useEffect
  }

  return (
    <div className={`onboarding-container ${darkTheme ? "dark-theme" : "light-theme"}`}>
      <header className="header">
        <div className="logo">
          <h1>GULIT</h1>
        </div>
        <div className="search-bar">
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%" }}>
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search for products..." value={searchQuery} onChange={handleSearchChange} />
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
          {loggedInUser ? (
            <div className="user-menu" ref={profileRef}>
              <button className="user-button" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <User size={20} />
                <span>{loggedInUser.name || loggedInUser.email}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    className="profile-dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      backgroundColor: "var(--background-card)",
                      borderRadius: "var(--border-radius)",
                      boxShadow: "0 5px 15px var(--shadow-color)",
                      width: "200px",
                      zIndex: 10,
                      marginTop: "0.5rem",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="profile-dropdown-item"
                      onClick={() => {
                        setShowProfileSettingsModal(true)
                        setShowProfileDropdown(false)
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        transition: "background-color var(--transition-speed)",
                      }}
                    >
                      <Settings size={18} />
                      <span>Profile Settings</span>
                    </div>

                    {/* Only show Admin Dashboard link for admin users */}
                    {(loggedInUser?.isAdmin || loggedInUser?.email === "abeni@gmail.com") && (
                      <Link
                        to="/admin"
                        className="profile-dropdown-item"
                        onClick={() => setShowProfileDropdown(false)}
                        style={{
                          padding: "0.75rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                          transition: "background-color var(--transition-speed)",
                          textDecoration: "none",
                          color: "var(--text-color)",
                        }}
                      >
                        <Users size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div
                      className="profile-dropdown-item"
                      onClick={() => {
                        setShowAddItemModal(true)
                        setShowProfileDropdown(false)
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        transition: "background-color var(--transition-speed)",
                      }}
                    >
                      <PlusCircle size={18} />
                      <span>Add Item</span>
                    </div>

                    <div
                      className="profile-dropdown-item"
                      onClick={() => {
                        setShowMyItemsModal(true)
                        setShowProfileDropdown(false)
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        transition: "background-color var(--transition-speed)",
                      }}
                    >
                      <Package size={18} />
                      <span>My Items</span>
                    </div>

                    <div
                      className="profile-dropdown-item"
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        transition: "background-color var(--transition-speed)",
                      }}
                    >
                      <ShoppingBag size={18} />
                      <span>Order History</span>
                    </div>

                    <div
                      className="profile-dropdown-item"
                      onClick={handleLogout}
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        transition: "background-color var(--transition-speed)",
                        borderTop: "1px solid var(--border-color)",
                      }}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowLoginModal(true)}>
              <User size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* New Category Navigation */}
      <nav className="category-nav">
        <div className="category-container">
          <button
            className={`category-link ${activeCategory === "explore" ? "active" : ""}`}
            onClick={() => handleCategoryChange("explore")}
          >
            <Compass size={18} />
            <span>Explore</span>
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={`category-link ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryChange(category)}
            >
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </button>
          ))}
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Gulit</h1>
            <p>Discover the latest tech products at unbeatable prices</p>
            <button className="cta-button">Shop Now</button>
          </div>
        </section>

        {searchQuery.trim() !== "" && (
          <section className="featured-section">
            <h2>Search Results</h2>
            <div className="section-header">
              <p>
                {filteredItems.length > 0
                  ? `Found ${filteredItems.length} item${filteredItems.length === 1 ? "" : "s"} for "${searchQuery}"`
                  : `No items found for "${searchQuery}"`}
              </p>
            </div>
            {filteredItems.length > 0 ? (
              <div className="featured-products">
                {filteredItems.map((product) => (
                  <div className="product-card" key={product.id}>
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
                    <div className="product-actions">
                      <button className="buy-button">Buy Now</button>
                      <button className="cart-add-button" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        marginTop: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        Category:{" "}
                        {product.category
                          ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                          : "Electronics"}
                      </span>
                      {product.user_id === loggedInUser?.id && (
                        <span
                          style={{
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                          }}
                        >
                          Your Item
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "var(--background-card)",
                  borderRadius: "var(--border-radius)",
                  marginBottom: "2rem",
                }}
              >
                <p>No items match your search. Try different keywords or browse our categories.</p>
              </div>
            )}
          </section>
        )}

        {/* Category Items Section - Only show when a category is selected */}
        {activeCategory !== "explore" && categoryItems.length > 0 && (
          <section className="featured-section">
            <h2>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h2>
            <div className="section-header">
              <p>Browse our selection of {activeCategory} products</p>
            </div>
            <div className="featured-products">
              {categoryItems.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image || "/placeholder.svg"} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
                  <div className="product-actions">
                    <button className="buy-button">Buy Now</button>
                    <button className="cart-add-button" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      Category:{" "}
                      {product.category
                        ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                        : "Electronics"}
                    </span>
                    {product.user_id === loggedInUser?.id && (
                      <span
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                        }}
                      >
                        Your Item
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {categoryItems.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "var(--background-card)",
                  borderRadius: "var(--border-radius)",
                  marginBottom: "2rem",
                }}
              >
                <p>No items found in this category. Check back later or explore other categories.</p>
              </div>
            )}
          </section>
        )}

        {/* Only show these sections when in Explore mode or no category is selected */}
        {activeCategory === "explore" && (
          <>
            {/* Special Deals Section with Animation */}
            <section className="special-deals-section">
              <h2>Special Deal</h2>
              <div className="special-deals-header">
                <p>Limited time offers on our best products</p>
              </div>
              <div className="special-deals">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={specialDealIndex}
                    className="deal-card"
                    variants={dealCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="deal-badge">SPECIAL OFFER</div>
                    <div className="deal-discount-badge">
                      {Math.round(
                        ((specialDeals[specialDealIndex].originalPrice - specialDeals[specialDealIndex].salePrice) /
                          specialDeals[specialDealIndex].originalPrice) *
                          100,
                      )}
                      % OFF
                    </div>
                    <img
                      src={specialDeals[specialDealIndex].image || "/placeholder.svg"}
                      alt={specialDeals[specialDealIndex].name}
                    />
                    <div className="deal-content">
                      <h3>{specialDeals[specialDealIndex].name}</h3>
                      <p className="product-description">{specialDeals[specialDealIndex].description}</p>
                      <div className="deal-price">
                        <p className="original-price">${specialDeals[specialDealIndex].originalPrice.toFixed(2)}</p>
                        <p className="sale-price">${specialDeals[specialDealIndex].salePrice.toFixed(2)}</p>
                      </div>
                      <div className="product-actions">
                        <button className="buy-button">Buy Now</button>
                        <button className="cart-add-button" onClick={() => addToCart(specialDeals[specialDealIndex])}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
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
                      <button className="cart-add-button" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Marketplace Items Section - showing limited items from all sellers */}
            {marketplaceItems.length > 0 && (
              <section className="featured-section">
                <h2>Marketplace Items</h2>
                <div className="section-header">
                  <p>
                    Browse items from our community of sellers
                    {marketplaceItems.length > 15 && (
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                        (Showing 15 of {marketplaceItems.length} items - search to see more)
                      </span>
                    )}
                  </p>
                  {marketplaceItems.length > 15 && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      Items rotate every 5 minutes. Last updated: {new Date(lastRotationTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="featured-products">
                  {displayedMarketplaceItems.map((product) => (
                    <div className="product-card" key={product.id}>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
                      <div className="product-actions">
                        <button className="buy-button">Buy Now</button>
                        <button className="cart-add-button" onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Category:{" "}
                          {product.category
                            ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                            : "Electronics"}
                        </span>
                        {product.user_id === loggedInUser?.id && (
                          <span
                            style={{
                              backgroundColor: "var(--primary-color)",
                              color: "white",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                            }}
                          >
                            Your Item
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Only show "Your Items" section if the user has items */}
            {userItems.length > 0 && (
              <section className="featured-section">
                <h2>Your Items</h2>
                <div className="featured-products">
                  {userItems.map((product) => (
                    <div className="product-card" key={product.id}>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">${Number.parseFloat(product.price).toFixed(2)}</p>
                      <div className="product-actions">
                        <button
                          className="buy-button"
                          onClick={() => handleEditItem(product)}
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          Edit
                        </button>
                        <button
                          className="cart-add-button"
                          onClick={() => {
                            setItemToDelete(product)
                            setShowDeleteConfirmModal(true)
                          }}
                          style={{ backgroundColor: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
                          <button className="cart-add-button" onClick={() => addToCart(product)}>
                            Add to Cart
                          </button>
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

      {/* Add/Edit Item Modal */}
      {showAddItemModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="login-modal"
            style={{
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "var(--background-card)",
              borderRadius: "var(--border-radius)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <div
              className="modal-header"
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                backgroundColor: "var(--background-card)",
                zIndex: 1,
              }}
            >
              <h2 style={{ margin: 0 }}>{itemToEdit ? "Edit Item" : "Add New Item"}</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowAddItemModal(false)
                  setItemToEdit(null)
                  setNewItem({
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    category: "electronics",
                  })
                  setFormError("")
                  setFormSuccess("")
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1rem" }}>
              {formError && (
                <div
                  className="form-error"
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                    padding: "0.75rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                  }}
                >
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  className="form-success"
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    padding: "0.75rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                  }}
                >
                  {formSuccess}
                </div>
              )}

              <form className="login-form" onSubmit={handleAddItem}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter product name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="description" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter product description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="category" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Category
                  </label>
                  <select
                    id="category"
                    value={newItem.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="price" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="image" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    placeholder="Enter image URL"
                    value={newItem.image}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="login-submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--border-radius)",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {isLoading ? "Please wait..." : itemToEdit ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileSettingsModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="login-modal"
            style={{
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "var(--background-card)",
              borderRadius: "var(--border-radius)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <div
              className="modal-header"
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                backgroundColor: "var(--background-card)",
                zIndex: 1,
              }}
            >
              <h2 style={{ margin: 0 }}>Profile Settings</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowProfileSettingsModal(false)
                  setFormError("")
                  setFormSuccess("")
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1rem" }}>
              {formError && (
                <div
                  className="form-error"
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                    padding: "0.75rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                  }}
                >
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  className="form-success"
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    padding: "0.75rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                  }}
                >
                  {formSuccess}
                </div>
              )}

              <form className="login-form" onSubmit={handleUpdateProfile}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={handleProfileInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={profileData.email}
                    onChange={handleProfileInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    backgroundColor: "var(--background-light)",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Change Password</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
                    Leave blank if you don't want to change your password
                  </p>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="currentPassword"
                    style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="Enter current password"
                    value={profileData.currentPassword}
                    onChange={handleProfileInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="newPassword" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={profileData.newPassword}
                    onChange={handleProfileInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={profileData.confirmPassword}
                    onChange={handleProfileInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "var(--border-radius)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--background-light)",
                    }}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="login-submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--border-radius)",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {isLoading ? "Please wait..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* My Items Modal */}
      {showMyItemsModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="login-modal"
            style={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "var(--background-card)",
              borderRadius: "var(--border-radius)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <div
              className="modal-header"
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                backgroundColor: "var(--background-card)",
                zIndex: 1,
              }}
            >
              <h2 style={{ margin: 0 }}>My Items</h2>
              <button
                className="close-button"
                onClick={() => setShowMyItemsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {userItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Package size={48} style={{ color: "var(--text-secondary)", margin: "0 auto 1rem" }} />
                <h3>You haven't added any items yet</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  Start selling by adding your first item
                </p>
                <button
                  className="cta-button"
                  onClick={() => {
                    setShowMyItemsModal(false)
                    setShowAddItemModal(true)
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                  }}
                >
                  Add Item
                </button>
              </div>
            ) : (
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="cta-button"
                    onClick={() => {
                      setShowMyItemsModal(false)
                      setShowAddItemModal(true)
                    }}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--border-radius)",
                      cursor: "pointer",
                    }}
                  >
                    Add New Item
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Image</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Category</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Price</th>
                        <th style={{ padding: "0.75rem", textAlign: "left" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "0.75rem" }}>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                            />
                          </td>
                          <td style={{ padding: "0.75rem" }}>{item.name}</td>
                          <td style={{ padding: "0.75rem" }}>
                            {item.category
                              ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
                              : "Electronics"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>${Number.parseFloat(item.price).toFixed(2)}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                onClick={() => handleEditItem(item)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0.5rem",
                                  backgroundColor: "var(--primary-color)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                aria-label="Edit item"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setItemToDelete(item)
                                  setShowDeleteConfirmModal(true)
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0.5rem",
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                aria-label="Delete item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="login-modal"
            style={{
              maxWidth: "400px",
              width: "100%",
              backgroundColor: "var(--background-card)",
              borderRadius: "var(--border-radius)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="modal-header"
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Confirm Delete</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowDeleteConfirmModal(false)
                  setItemToDelete(null)
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <p>Are you sure you want to delete "{itemToDelete?.name}"?</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                This action cannot be undone.
              </p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false)
                    setItemToDelete(null)
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "var(--background-light)",
                    color: "var(--text-color)",
                    border: "none",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--border-radius)",
                    cursor: "pointer",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
