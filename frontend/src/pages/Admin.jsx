 

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

     

      setSpecialDeals([...specialDeals, dealToAdd])
      setNewDeal({
        name: "",
        description: "",
        originalPrice: "",
        salePrice: "",
        image: "",
        active: true,
      })
      setShowAddDealModal(false)
      showNotification("Special deal added successfully", "success")
    } catch (error) {
      console.error("Error adding special deal:", error)
      showNotification("Error adding special deal", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle updating a special deal
  const handleUpdateDeal = async (e) => {
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
      // For now, we'll simulate updating a deal
      const updatedDeals = specialDeals.map((deal) =>
        deal.id === dealToEdit.id
          ? {
              ...newDeal,
              id: dealToEdit.id,
              originalPrice: Number.parseFloat(newDeal.originalPrice),
              salePrice: Number.parseFloat(newDeal.salePrice),
            }
          : deal,
      )

      setSpecialDeals(updatedDeals)
      setNewDeal({
        name: "",
        description: "",
        originalPrice: "",
        salePrice: "",
        image: "",
        active: true,
      })
      setDealToEdit(null)
      setShowEditDealModal(false)
      showNotification("Special deal updated successfully", "success")
    } catch (error) {
      console.error("Error updating special deal:", error)
      showNotification("Error updating special deal", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle deleting a special deal
  const handleDeleteDeal = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate deleting a deal
      const updatedDeals = specialDeals.filter((deal) => deal.id !== dealToDelete.id)
      setSpecialDeals(updatedDeals)
      setDealToDelete(null)
      setShowDeleteConfirmModal(false)
      showNotification("Special deal deleted successfully", "success")
    } catch (error) {
      console.error("Error deleting special deal:", error)
      showNotification("Error deleting special deal", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle editing a special deal
  const handleEditDeal = (deal) => {
    setDealToEdit(deal)
    setNewDeal({
      name: deal.name,
      description: deal.description,
      originalPrice: deal.originalPrice.toString(),
      salePrice: deal.salePrice.toString(),
      image: deal.image || "",
      active: deal.active,
    })
    setShowEditDealModal(true)
  }

  // Handle input change for deal form
  const handleDealInputChange = (e) => {
    const { id, value, type, checked } = e.target
    setNewDeal({
      ...newDeal,
      [id]: type === "checkbox" ? checked : value,
    })
  }

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted items
  const getSortedItems = (items) => {
    if (!sortConfig.key) return items

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Filter items based on search query
  const getFilteredItems = (items) => {
    if (!searchQuery) return items


    return items.filter((item) => {
      // Check if any property contains the search query
      return Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      )
    })
  }

  // Get sorted and filtered items
  const getSortedAndFilteredItems = (items) => {
    return getSortedItems(getFilteredItems(items))
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>GULIT Admin</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
              <BarChart2 size={20} />
              <span>Dashboard</span>
            </li>
            <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
              <Package size={20} />
              <span>Products</span>
            </li>
            <li className={activeTab === "special-deals" ? "active" : ""} onClick={() => setActiveTab("special-deals")}>
              <ShoppingBag size={20} />
              <span>Special Deals</span>
            </li>
            <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
              <ShoppingBag size={20} />
              <span>Orders</span>
            </li>
            <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
              <Users size={20} />
              <span>Users</span>
            </li>
            <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-header-actions">
            <div className="admin-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="admin-user">
              <span>{currentUser?.name || currentUser?.email}</span>
            </div>
          </div>
        </header>

        {/* Notification */}
        {notification && (
          <div className={`admin-notification ${notification.type}`}>
            {notification.type === "success" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">{stats.totalProducts}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>


            <div className="dashboard-sections">
              <div className="dashboard-section">
                <div className="section-header">
                  <h3>Recent Orders</h3>
                  <Link to="#" className="view-all" onClick={() => setActiveTab("orders")}>
                    View All
                  </Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user_name}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dashboard-section">
                <div className="section-header">
                  <h3>Recent Products</h3>
                  <Link to="#" className="view-all" onClick={() => setActiveTab("products")}>
                    View All
                  </Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id}>
                        <td>#{product.id}</td>
                        <td>{product.name}</td>
                        <td>${Number.parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="admin-products">
            <div className="table-actions">
              <button className="refresh-button" onClick={fetchProducts}>
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>


            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("name")}>
                      Name
                      {sortConfig.key === "name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("price")}>
                      Price
                      {sortConfig.key === "price" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("category")}>
                      Category
                      {sortConfig.key === "category" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("seller_name")}>
                      Seller
                      {sortConfig.key === "seller_name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="loading-cell">
                        Loading...
                      </td>
                    </tr>
                  ) : getSortedAndFilteredItems(products).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    getSortedAndFilteredItems(products).map((product) => (
                      <tr key={product.id}>
                        <td>#{product.id}</td>
                        <td>{product.name}</td>
                        <td>${Number.parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.category}</td>
                        <td>{product.seller_name || "Unknown"}</td>
                        <td>
                          <div className="table-actions">
                            <button className="edit-button">
                              <Edit size={16} />
                            </button>
                            <button className="delete-button">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
       

        {/* Special Deals */}
        {activeTab === "special-deals" && (
          <div className="admin-special-deals">
            <div className="table-actions">
              <button className="add-button" onClick={() => setShowAddDealModal(true)}>
                <Plus size={16} />
                <span>Add Special Deal</span>
              </button>
              <button className="refresh-button" onClick={fetchSpecialDeals}>
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("name")}>
                      Name
                      {sortConfig.key === "name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("originalPrice")}>
                      Original Price
                      {sortConfig.key === "originalPrice" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("salePrice")}>
                      Sale Price
                      {sortConfig.key === "salePrice" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("active")}>
                      Status
                      {sortConfig.key === "active" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="loading-cell">
                        Loading...
                      </td>
                    </tr>
                  ) : getSortedAndFilteredItems(specialDeals).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">
                        No special deals found
                      </td>
                    </tr>
                  ) : (
                    getSortedAndFilteredItems(specialDeals).map((deal) => (
                      <tr key={deal.id}>
                        <td>#{deal.id}</td>
                        <td>{deal.name}</td>
                        <td>${deal.originalPrice.toFixed(2)}</td>
                        <td>${deal.salePrice.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${deal.active ? "active" : "inactive"}`}>
                            {deal.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="edit-button" onClick={() => handleEditDeal(deal)}>
                              <Edit size={16} />
                            </button>
                           
                            <button
                              className="delete-button"
                              onClick={() => {
                                setDealToDelete(deal)
                                setShowDeleteConfirmModal(true)
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="admin-orders">
            <div className="table-actions">
              <button className="refresh-button" onClick={fetchOrders}>
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("user_name")}>
                      Customer
                      {sortConfig.key === "user_name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("total")}>
                      Total
                      {sortConfig.key === "total" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("status")}>
                      Status
                      {sortConfig.key === "status" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("date")}>
                      Date
                      {sortConfig.key === "date" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="loading-cell">
                        Loading...
                      </td>
                    </tr>
                  ) : getSortedAndFilteredItems(orders).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    getSortedAndFilteredItems(orders).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user_name}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                        </td>
                        <td>{order.date}</td>

                        <td>
                          <div className="table-actions">
                            <button className="edit-button">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="admin-users">
            <div className="table-actions">
              <button className="refresh-button" onClick={fetchUsers}>
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("name")}>
                      Name
                      {sortConfig.key === "name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("email")}>
                      Email
                      {sortConfig.key === "email" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("created_at")}>
                      Joined
                      {sortConfig.key === "created_at" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th onClick={() => requestSort("orders")}>
                      Orders
                      {sortConfig.key === "orders" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="loading-cell">
                        Loading...
                      </td>
                    </tr>
                  ) : getSortedAndFilteredItems(users).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    getSortedAndFilteredItems(users).map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.created_at}</td>
                        <td>{user.orders}</td>
                        <td>
                          <div className="table-actions">
                            <button className="edit-button">
                              <Edit size={16} />
                            </button>
                            {user.email !== "admin@example.com" && (

                              <button className="delete-button">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="admin-settings">
            <div className="settings-card">
              <h3>General Settings</h3>
              <form className="settings-form">
                <div className="form-group">
                  <label htmlFor="siteName">Site Name</label>
                  <input type="text" id="siteName" defaultValue="GULIT" />
                </div>
                <div className="form-group">
                  <label htmlFor="siteDescription">Site Description</label>
                  <textarea
                    id="siteDescription"
                    defaultValue="Your one-stop destination for the latest technology products and accessories."
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="contactEmail">Contact Email</label>
                  <input type="email" id="contactEmail" defaultValue="support@gulitshop.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input type="text" id="contactPhone" defaultValue="(555) 123-4567" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    <Save size={16} />
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Add Special Deal Modal */}
      {showAddDealModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Add Special Deal</h2>
              <button className="close-button" onClick={() => setShowAddDealModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleAddDeal}>
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input type="text" id="name" value={newDeal.name} onChange={handleDealInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={newDeal.description}
                    onChange={handleDealInputChange}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($)</label>
                    <input
                      type="number"
                      id="originalPrice"
                      value={newDeal.originalPrice}
                      onChange={handleDealInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="salePrice">Sale Price ($)</label>
                    <input
                      type="number"
                      id="salePrice"
                      value={newDeal.salePrice}
                      onChange={handleDealInputChange}
                      step="0.01"
                      min="0"
                      required
                    />

                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={newDeal.image}
                    onChange={handleDealInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" id="active" checked={newDeal.active} onChange={handleDealInputChange} />
                  <label htmlFor="active">Active</label>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowAddDealModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Special Deal Modal */}
      {showEditDealModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Edit Special Deal</h2>
              <button className="close-button" onClick={() => setShowEditDealModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleUpdateDeal}>
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input type="text" id="name" value={newDeal.name} onChange={handleDealInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={newDeal.description}
                    onChange={handleDealInputChange}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($)</label>
                    <input
                      type="number"
                      id="originalPrice"
                      value={newDeal.originalPrice}
                      onChange={handleDealInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="salePrice">Sale Price ($)</label>
                    <input
                      type="number"
                      id="salePrice"
                      value={newDeal.salePrice}
                      onChange={handleDealInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={newDeal.image}
                    onChange={handleDealInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" id="active" checked={newDeal.active} onChange={handleDealInputChange} />
                  <label htmlFor="active">Active</label>
                </div>
                <div className="form-actions">

                  <button type="button" className="cancel-button" onClick={() => setShowEditDealModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Confirm Delete</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowDeleteConfirmModal(false)
                  setDealToDelete(null)
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p>Are you sure you want to delete "{dealToDelete?.name}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowDeleteConfirmModal(false)
                    setDealToDelete(null)
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="delete-button" onClick={handleDeleteDeal} disabled={isLoading}>
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





