"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { CartProvider } from "./pages/CartContext"
import OnboardingPage from "./pages/OnboardingPage"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setIsLoggedIn(true)
      setCurrentUser(userData)
    }
  }, [])

  // Function to handle login state
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoggedIn(true)
    setCurrentUser(userData)
  }

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <OnboardingPage onLogin={handleLogin} />} />
          <Route path="/home" element={<Home onLogout={handleLogout} currentUser={currentUser} />} />
          <Route path="/cart" element={<Cart currentUser={currentUser} />} />
          <Route path="/admin" element={<Admin onLogout={handleLogout} currentUser={currentUser} />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}
