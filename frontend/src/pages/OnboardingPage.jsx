import './OnboardingPage.css';

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Moon,
  Sun,
  Globe,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";


const OnboardingPage = () => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false)

  // State for language
  const [language, setLanguage] = useState("English")

  // State for cart items
  const [cartItems, setCartItems] = useState([])

  // State for products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 15,
      rating: 4.5,
      description: "Premium noise cancelling wireless headphones with 30-hour battery life.",
    },
    {
      id: 2,
      name: "Smartphone Pro",
      price: 899.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 10,
      rating: 4.8,
      description: "Latest smartphone with advanced camera system and all-day battery life.",
    },
    {
      id: 3,
      name: "Laptop Ultra",
      price: 1299.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 20,
      rating: 4.7,
      description: "Ultra-thin laptop with powerful performance and stunning display.",
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 249.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 5,
      rating: 4.3,
      description: "Track your fitness and stay connected with this premium smart watch.",
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      price: 89.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 0,
      rating: 4.6,
      description: "True wireless earbuds with immersive sound and compact charging case.",
    },
    {
      id: 6,
      name: "4K Smart TV",
      price: 699.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 12,
      rating: 4.4,
      description: "Crystal clear 4K resolution with smart features and slim design.",
    },
  ])

  // State for featured deals (carousel)
  const [currentDealIndex, setCurrentDealIndex] = useState(0)
  const featuredDeals = [
    {
      id: 1,
      title: "Summer Collection 2023",
      description: "Discover the hottest tech deals with up to 50% off on selected premium items",
      image: "/placeholder.svg?height=400&width=800",
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
    {
      id: 2,
      title: "New Arrivals This Week",
      description: "Be the first to experience our latest cutting-edge products",
      image: "/placeholder.svg?height=400&width=800",
      color: "bg-gradient-to-r from-blue-600 to-teal-600",
    },
    {
      id: 3,
      title: "Flash Sale - 24 Hours Only!",
      description: "Lightning deals on premium electronics. Don't miss out!",
      image: "/placeholder.svg?height=400&width=800",
      color: "bg-gradient-to-r from-orange-600 to-red-600",
    },
  ]

  // State for search
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)

  // State for login modal
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  // Buy now function
  const buyNow = (product) => {
    addToCart(product)
    // In a real app, this would navigate to checkout
    alert(`Proceeding to checkout for ${product.name}`)
  }

  // Next deal in carousel
  const nextDeal = () => {
    setCurrentDealIndex((prevIndex) => (prevIndex === featuredDeals.length - 1 ? 0 : prevIndex + 1))
  }

  // Previous deal in carousel
  const prevDeal = () => {
    setCurrentDealIndex((prevIndex) => (prevIndex === 0 ? featuredDeals.length - 1 : prevIndex - 1))
  }

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextDeal()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">GULIT</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 ${
                      darkMode
                        ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                        : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Search products..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
                    onClick={() => document.getElementById("language-menu").classList.toggle("hidden")}
                  >
                    <Globe className="h-5 w-5 mr-1" />
                    <span>{language}</span>
                  </button>
                  <div
                    id="language-menu"
                    className={`hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} ring-1 ring-black ring-opacity-5`}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {["English", "Español", "Français", "中文", "العربية"].map((lang) => (
                        <button
                          key={lang}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                          }`}
                          role="menuitem"
                          onClick={() => {
                            setLanguage(lang)
                            document.getElementById("language-menu").classList.add("hidden")
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
                  className={`p-1 rounded-full ${darkMode ? "text-yellow-300 hover:text-yellow-200" : "text-gray-700 hover:text-gray-900"}`}
                >
                  {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>

                {/* Login/Signup */}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`p-1 rounded-full ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
                >
                  <User className="h-6 w-6" />
                </button>

                {/* Cart */}
                <button
                  className={`p-1 rounded-full ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"} relative`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
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
        <div className="relative overflow-hidden">
          <div className="relative">
            {featuredDeals.map((deal, index) => (
              <div key={deal.id} className={`${index === currentDealIndex ? "block" : "hidden"} relative`}>
                <div className={`${deal.color} absolute inset-0 opacity-90`}></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                      <span className="inline-block px-4 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm font-semibold mb-4 backdrop-blur-sm">
                        Limited Time Offer
                      </span>
                      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white leading-tight">
                        {deal.title}
                      </h2>
                      <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90 max-w-lg">{deal.description}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                          Shop Now
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                          Learn More
                        </button>
                      </div>
                    </div>
                    <div className="md:w-1/2 transform transition-all duration-500 hover:scale-105">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-white rounded-lg opacity-20 blur"></div>
                        <img
                          src={deal.image || "/placeholder.svg"}
                          alt={deal.title}
                          className="relative rounded-lg shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                          Save 50%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Controls - Enhanced */}
            <button
              onClick={prevDeal}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 text-white p-3 rounded-full hover:bg-opacity-40 backdrop-blur-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextDeal}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 text-white p-3 rounded-full hover:bg-opacity-40 backdrop-blur-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Carousel Indicators - Enhanced */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featuredDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentDealIndex ? "bg-white w-8" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Listing - Enhanced */}
        <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} py-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Featured Products</h2>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-sm`}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} shadow-sm`}
                >
                  New Arrivals
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} shadow-sm`}
                >
                  Best Sellers
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <p className="text-xl">No products found matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-blue-500 hover:text-blue-600">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group rounded-xl overflow-hidden ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-750 border border-gray-700"
                        : "bg-white hover:shadow-xl border border-gray-100"
                    } transition-all duration-300 transform hover:-translate-y-2`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button className="absolute top-4 left-4 p-2 rounded-full bg-white text-red-500 hover:bg-gray-100 shadow-md opacity-90 hover:opacity-100 transition-all duration-300 transform hover:scale-110">
                        <Heart className="h-5 w-5" />
                      </button>

                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-lg"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => buyNow(product)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-lg"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} group-hover:text-blue-600 transition-colors`}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center bg-yellow-400 bg-opacity-20 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className={`ml-1 text-sm font-medium text-yellow-700 ${darkMode && "text-yellow-400"}`}>
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount > 0 ? (
                            <div className="flex items-center">
                              <span className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              <span
                                className={`ml-2 text-sm line-through ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"} font-medium`}>
                          In Stock
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-16 text-center">
              <button
                className={`px-8 py-3 rounded-md border-2 ${
                  darkMode
                    ? "border-gray-600 text-white hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } font-medium transition-colors`}
              >
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopEase</h3>
              <p className="mb-4">
                Your one-stop shop for all your needs. Quality products, competitive prices, and exceptional service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-500">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-blue-400">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-pink-500">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-blue-700">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Featured Items
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Special Offers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Coming Soon
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Order Tracking
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-3 py-2 text-sm rounded-l-md ${
                    darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} GULIT. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-sm hover:underline">
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowLoginModal(false)}></div>
            </div>

            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Sign In
                    </h3>
                    <div className="mt-6 space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                            }`}
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="password"
                            id="password"
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="remember-me"
                            className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}
                          >
                            Remember me
                          </label>
                        </div>

                        <div className="text-sm">
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                          </a>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Sign in
                        </button>
                      </div>

                      <div className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Don't have an account?{" "}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Sign up
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
  )
}

export default OnboardingPage;
