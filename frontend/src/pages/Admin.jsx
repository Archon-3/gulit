"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Users,
  Package,
  BarChart2,
  Settings,
  LogOut,
  Trash2,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import "./admin.css"

export default function Admin({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalValue: 0,
    avgPrice: 0,
    categoryCounts: {},
  })
  const [searchQuery, setSearchQuery] = useState("")
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
    fetchStats()
  }, [])

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/gulit/admin/get_users.php")
      const data = await response.json()

      if (data.status === "success") {
        setUsers(data.users)
      } else {
        console.error("Failed to fetch users:", data.message)
        showNotification("Failed to fetch users", "error")
      }
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

  // Fetch stats from backend
  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/gulit/admin/get_stats.php")
      const data = await response.json()

      if (data.status === "success") {
        setStats(data.stats)
      } else {
        console.error("Failed to fetch stats:", data.message)
        showNotification("Failed to fetch stats", "error")
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      showNotification("Error fetching stats", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/gulit/admin/delete_item.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: productId,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Remove the product from the local state
        setProducts(products.filter((product) => product.id !== productId))
        showNotification("Product deleted successfully", "success")

        // Refresh stats
        fetchStats()
      } else {
        console.error("Failed to delete product:", data.message)
        showNotification(data.message || "Failed to delete product", "error")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      showNotification("Error deleting product", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete all their products.")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost/gulit/admin/delete_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Remove the user from the local state
        setUsers(users.filter((user) => user.id !== userId))
        showNotification("User deleted successfully", "success")

        // Refresh products and stats
        fetchProducts()
        fetchStats()
      } else {
        console.error("Failed to delete user:", data.message)
        showNotification(data.message || "Failed to delete user", "error")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      showNotification("Error deleting user", "error")
    } finally {
      setIsLoading(false)
    }
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

  // Calculate category distribution for pie chart
  const getCategoryDistribution = () => {
    const categories = {}
    products.forEach((product) => {
      const category = product.category || "uncategorized"
      categories[category] = (categories[category] || 0) + 1
    })
    return categories
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
                    <td onClick={() => requestSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </td>
                    <td onClick={() => requestSort("name")}>
                      Name
                      {sortConfig.key === "name" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </td>
                    <td onClick={() => requestSort("email")}>
                      Email
                      {sortConfig.key === "email" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </td>
                    <td onClick={() => requestSort("created_at")}>
                      Joined
                      {sortConfig.key === "created_at" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </td>
                    <td onClick={() => requestSort("product_count")}>
                      Products
                      {sortConfig.key === "product_count" && (
                        <span>
                          {sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </td>
                    <td>Actions</td>
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
                        <td>{user.name || "N/A"}</td>
                        <td>{user.email}</td>
                        <td>{user.created_at || "N/A"}</td>
                        <td>{user.product_count || 0}</td>
                        <td>
                          <div className="table-actions">
                            {/* Don't allow deleting the admin user */}
                            {user.email !== "abeni@gmail.com" && (
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isLoading}
                              >
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
              <h3>Admin Settings</h3>
              <p>
                This is a simple admin panel for GULIT e-commerce platform. You can manage users and products from here.
              </p>

              <div className="admin-info">
                <h4>Database Information</h4>
                <ul>
                  <li>
                    <strong>Total Users:</strong> {stats.totalUsers}
                  </li>
                  <li>
                    <strong>Total Products:</strong> {stats.totalProducts}
                  </li>
                  <li>
                    <strong>Total Value:</strong> ${stats.totalValue?.toFixed(2) || "0.00"}
                  </li>
                </ul>
              </div>

              <div className="admin-actions">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                  <button
                    className="refresh-button"
                    onClick={() => {
                      fetchUsers()
                      fetchProducts()
                      fetchStats()
                      showNotification("Data refreshed successfully", "success")
                    }}
                  >
                    <RefreshCw size={16} />
                    <span>Refresh All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function to get a color for a category
function getCategoryColor(category) {
  const colors = {
    electronics: "#3b82f6",
    clothing: "#ef4444",
    home: "#10b981",
    beauty: "#ec4899",
    sports: "#f59e0b",
    books: "#8b5cf6",
    toys: "#f97316",
    other: "#6b7280",
    uncategorized: "#6b7280",
  }

  return colors[category.toLowerCase()] || "#6b7280"
}
