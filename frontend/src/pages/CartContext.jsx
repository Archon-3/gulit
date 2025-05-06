"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loggedInUserId, setLoggedInUserId] = useState(null)

  // Set the logged-in user ID when the component mounts or when user logs in/out
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setLoggedInUserId(user.id)
    } else {
      setLoggedInUserId(null)
    }
  }, [])

  // Load cart from localStorage when component mounts or when logged-in user changes
  useEffect(() => {
    if (loggedInUserId) {
      const savedCart = localStorage.getItem(`cart_${loggedInUserId}`)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      } else {
        setCartItems([]) // Clear cart if no saved cart for this user
      }
    } else {
      setCartItems([]) // Clear cart if no user is logged in
    }
  }, [loggedInUserId])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (loggedInUserId) {
      localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cartItems))
    }
  }, [cartItems, loggedInUserId])

  // Add item to cart
  const addToCart = (product) => {
    if (!loggedInUserId) {
      alert("Please log in to add items to your cart")
      return
    }


  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number.parseFloat(item.salePrice || item.price || 0)
      return total + price * item.quantity
    }, 0)
  }

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Update user ID (call this when user logs in or out)
  const updateUserId = (userId) => {
    setLoggedInUserId(userId)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getCartCount,
    clearCart,
    updateUserId,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
