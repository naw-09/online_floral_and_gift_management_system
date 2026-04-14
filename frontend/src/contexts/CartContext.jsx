import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../api/axios'
import {
  clearCartItems,
  removeCartItem,
  setCart,
  setCartHydrated,
  updateCartQuantity,
  upsertCartItem,
} from '../store/slices/cartSlice'

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)
  const hydrated = useSelector((state) => state.cart.hydrated)

  useEffect(() => {
    const initCart = async () => {
      try {
        const { data } = await API.get('/cart')
        dispatch(setCart(data.items || []))
      } catch {
        const savedCart = localStorage.getItem('flower_shop_cart')
        if (savedCart) {
          dispatch(setCart(JSON.parse(savedCart)))
        }
      } finally {
        dispatch(setCartHydrated(true))
      }
    }

    initCart()
  }, [dispatch])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('flower_shop_cart', JSON.stringify(cart))
    }
  }, [cart, hydrated])

  return children
}

export const useCart = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)

  const addToCart = async (product, quantity) => {
    const existing = cart.find(
      (item) => item.product_id === product.id || item.id === product.id,
    )
    const currentQtyInCart = existing ? existing.quantity : 0

    if (currentQtyInCart >= product.stock) {
      alert(`You already have the maximum available (${product.stock}) in your cart.`)
      return false
    }

    let newTotalQuantity = currentQtyInCart + quantity
    if (newTotalQuantity > product.stock) {
      alert(`Only ${product.stock} available. Your cart has been updated to the maximum limit.`)
      newTotalQuantity = product.stock
    }

    dispatch(upsertCartItem({ product, quantity: newTotalQuantity }))

    try {
      await API.post('/cart', {
        product_id: product.id,
        quantity: newTotalQuantity,
      })
      return true
    } catch (err) {
      console.error('Sync failed', err)
      return false
    }
  }

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return
    const item = cart.find((i) => i.id === id)
    if (item && newQty > (item.product?.stock || item.stock)) {
      alert('Maximum stock reached')
      return
    }

    dispatch(updateCartQuantity({ id, quantity: newQty }))
    try {
      await API.put(`/cart/${id}`, { quantity: newQty })
    } catch (err) {
      console.error(err)
    }
  }

  const removeFromCart = async (id) => {
    dispatch(removeCartItem(id))
    try {
      await API.delete(`/cart/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const clearCart = () => {
    dispatch(clearCartItems())
    localStorage.removeItem('flower_shop_cart')
  }

  const getCartTotal = () =>
    cart.reduce((total, item) => {
      const price =
        item.product?.discount_price ||
        item.product?.price ||
        item.discount_price ||
        item.price
      return total + price * item.quantity
    }, 0)

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0)

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  }
}
