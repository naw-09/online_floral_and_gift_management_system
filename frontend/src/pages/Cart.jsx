import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import API from '../api/axios';

export default function Cart() {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchCart = () => {
    if (!user) {
      setLoading(false)
      return
    }
    API.get('/cart').then(({ data }) => setCart({ items: data.items || [], total: data.total || 0 })).catch(() => setCart({ items: [], total: 0 })).finally(() => setLoading(false))
  }

  useEffect(() => fetchCart(), [user])

  const updateQty = async (cartItemId, quantity) => {
    try {
      await API.put(`/cart/${cartItemId}`, { quantity })
      fetchCart()
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed')
    }
  }

  const remove = async (cartItemId) => {
    try {
      await API.delete(`/cart/${cartItemId}`)
      fetchCart()
    } catch (e) {
      alert(e.response?.data?.message || 'Remove failed')
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sage-600 mb-4">Please log in to view your cart.</p>
        <Link to="/login" className="text-sage-700 font-medium underline">Log in</Link>
      </div>
    )
  }

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12">Loading cart…</div>

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sage-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-sage-700 font-medium underline">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Cart</h1>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4 border border-sage-200 rounded-xl bg-white">
            <div className="w-20 h-20 rounded-lg bg-floral-100 flex items-center justify-center shrink-0">
              {item.product?.image ? <img src={item.product.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <span className="text-2xl">🌸</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sage-900">{item.product?.name}</p>
              <p className="text-sage-600 text-sm">${Number(item.product?.price || 0).toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-sage-300 rounded text-sm"
                />
                <button type="button" onClick={() => remove(item.id)} className="text-red-600 text-sm hover:underline">Remove</button>
              </div>
            </div>
            <div className="text-right font-medium text-sage-800">
              ${(item.quantity * Number(item.product?.price || 0)).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between items-center border-t border-sage-200 pt-4">
        <span className="font-semibold text-sage-900">Total: ${Number(cart.total).toFixed(2)}</span>
        <Link to="/checkout" className="bg-sage-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sage-700">Proceed to checkout</Link>
      </div>
    </div>
  )
}
