import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  hydrated: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload
    },
    upsertCartItem(state, action) {
      const { product, quantity } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product_id === product.id || item.id === product.id,
      )

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity = quantity
      } else {
        state.items.push({ ...product, product_id: product.id, quantity })
      }
    },
    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload
      state.items = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      )
    },
    removeCartItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCartItems(state) {
      state.items = []
    },
    setCartHydrated(state, action) {
      state.hydrated = action.payload
    },
  },
})

export const {
  setCart,
  upsertCartItem,
  updateCartQuantity,
  removeCartItem,
  clearCartItems,
  setCartHydrated,
} = cartSlice.actions

export default cartSlice.reducer
