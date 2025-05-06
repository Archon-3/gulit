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
  const [activeCategory, setActiveCategory] = useState("explore")
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
      setSpecialDealIndex((prevIndex) => (prevIndex === specialDeals.length -1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])