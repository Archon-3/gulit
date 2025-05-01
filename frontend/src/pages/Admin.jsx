 

"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Users,
  Package,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import "./admin.css"

export default function Admin({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [specialDeals, setSpecialDeals] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDealModal, setShowAddDealModal] = useState(false)
  const [showEditDealModal, setShowEditDealModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [dealToEdit, setDealToEdit] = useState(null)
  const [dealToDelete, setDealToDelete] = useState(null)
  const [newDeal, setNewDeal] = useState({
    name: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    image: "",
    active: true,
  })
  const [notification, setNotification] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  })

  const navigate = useNavigate()

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      // Redirect non-admin users
      navigate("/home")
    }
  }, [currentUser, navigate])

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers()
    fetchProducts()
    fetchSpecialDeals()
    fetchOrders()
    fetchStats()
  }, [])

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          created_at: "2023-05-15",
          orders: 5,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          created_at: "2023-06-20",
          orders: 3,
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          created_at: "2023-01-01",
          orders: 0,
        },
        {
          id: 4,
          name: "Bob Johnson",
          email: "bob@example.com",
          created_at: "2023-07-10",
          orders: 2,
        },
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      showNotification("Error fetching users", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products from backend
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/gulit/get_items.php")
      const data = await response.json()

      if (data.status === "success") {
        setProducts(data.items)
      } else {
        console.error("Failed to fetch products:", data.message)
        showNotification("Failed to fetch products", "error")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      showNotification("Error fetching products", "error")
    } finally {
      setIsLoading(false)
    }
  }

  

  // Fetch special deals
  const fetchSpecialDeals = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockDeals = [
        {
          id: 1,
          name: "Premium Smartphone",
          description: "Latest model with advanced camera system and all-day battery life",
          originalPrice: 999.99,
          salePrice: 849.99,
          image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&h=300&auto=format&fit=crop",
          active: true,
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          description: "True wireless earbuds with active noise cancellation",
          originalPrice: 179.99,
          salePrice: 129.99,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeuj8focJiIvgsHrWuHv4UeJ_QbWQoP0sDzg&s?q=50&w=200&h=200&auto=format&fit=crop",
          active: true,
        },
        {
          id: 3,
          name: "Gaming Console",
          description: "Next-gen gaming console with 4K graphics and 1TB storage",
          originalPrice: 499.99,
          salePrice: 449.99,
          image: "/placeholder.svg",
          active: true,
        },
      ]
      setSpecialDeals(mockDeals)
    } catch (error) {
      console.error("Error fetching special deals:", error)
      showNotification("Error fetching special deals", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockOrders = [
        {
          id: 1,
          user_id: 1,
          user_name: "John Doe",
          total: 249.99,
          status: "Delivered",
          date: "2023-08-15",
          items: 3,
        },
        {
          id: 2,
          user_id: 2,
          user_name: "Jane Smith",
          total: 129.99,
          status: "Processing",
          date: "2023-08-20",
          items: 1,
        },
        {
          id: 3,
          user_id: 4,
          user_name: "Bob Johnson",
          total: 599.98,
          status: "Shipped",
          date: "2023-08-18",
          items: 2,
        },
        {
          id: 4,
          user_id: 1,
          user_name: "John Doe",
          total: 79.99,
          status: "Delivered",
          date: "2023-08-10",
          items: 1,
        },
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      showNotification("Error fetching orders", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockStats = {
        totalUsers: 4,
        totalProducts: 15,
        totalOrders: 4,
        totalRevenue: 1059.95,
      }
      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching stats:", error)
      showNotification("Error fetching stats", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle adding a new special deal
  const handleAddDeal = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!newDeal.name || !newDeal.description || !newDeal.originalPrice || !newDeal.salePrice) {
        showNotification("Please fill all required fields", "error")
        setIsLoading(false)
        return
      }

      // In a real app, this would be an API call
      // For now, we'll simulate adding a deal
      const newId = specialDeals.length > 0 ? Math.max(...specialDeals.map((deal) => deal.id)) + 1 : 1
      const dealToAdd = {
        ...newDeal,
        id: newId,
        originalPrice: Number.parseFloat(newDeal.originalPrice),
        salePrice: Number.parseFloat(newDeal.salePrice),
      }


