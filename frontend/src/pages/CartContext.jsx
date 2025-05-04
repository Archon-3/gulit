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

    // Ensure we have a valid product with an ID
    if (!product || !product.id) {
      console.error("Invalid product:", product)
      return
    }

    // Convert ID to string for consistent comparison
    const productId = String(product.id)

    setCartItems((prevItems) => {
      // Make a copy of the previous items
      const updatedItems = [...prevItems]

      // Find the index of the existing item (if any)
      const existingItemIndex = updatedItems.findIndex((item) => String(item.id) === productId)

      if (existingItemIndex >= 0) {
        // Item exists, update its quantity
        const updatedItem = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        updatedItems[existingItemIndex] = updatedItem
      } else {
        // Item doesn't exist, add it with quantity 1
        updatedItems.push({
          ...product,
          id: productId, // Ensure consistent ID format
          quantity: 1,
        })
      }

      // Log for debugging
      console.log("Updated cart:", updatedItems)

      return updatedItems
    })
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
