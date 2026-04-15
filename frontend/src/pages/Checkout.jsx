


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import API from '../api/axios'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart = [], clearCart, getCartTotal = () => 0 } = useCart()

  const [form, setForm] = useState({
    delivery_address: '',
    delivery_phone: '',
    delivery_date: '',
    gift_message: '',
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        delivery_address: user.address || '',
        delivery_phone: user.phone || '',
      }))
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!loading && Array.isArray(cart) && cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, loading, navigate])

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.delivery_date) {
      alert('Please select a delivery date.')
      return
    }

    setSubmitting(true)

    try {
      await API.post('/orders', { ...form })
      clearCart()
      navigate('/orders')
    } catch (err) {
      const message = err.response?.data?.message || 'Order failed'
      console.error(err.response?.data?.errors || message)
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-12">Loading…</div>
  }

  if (!loading && cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">
        Checkout
      </h1>

      {/* Summary */}
      <div className="mb-6 p-4 bg-sage-50 rounded-xl border border-sage-100">
        <h2 className="font-semibold text-sage-800 mb-2">
          Order Summary
        </h2>
        <p className="text-sage-600">
          Total:{' '}
          <span className="font-bold text-sage-900">
            ${getCartTotal().toFixed(2)}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address */}
        <div>
          <label
            htmlFor="delivery_address"
            className="block text-sm font-medium text-sage-700 mb-1"
          >
            Delivery address *
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={form.delivery_address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-sage-300 rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="delivery_phone"
            className="block text-sm font-medium text-sage-700 mb-1"
          >
            Delivery phone *
          </label>
          <input
            id="delivery_phone"
            name="delivery_phone"
            value={form.delivery_phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-sage-300 rounded-lg"
          />
        </div>

        {/* Date (IMPORTANT FIX FOR TESTS) */}
        <div>
          <label
            htmlFor="delivery_date"
            className="block text-sm font-medium text-sage-700 mb-1"
          >
            Delivery date *
          </label>

          <input
            id="delivery_date"
            name="delivery_date"
            type="date"
            value={form.delivery_date}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 10)}
            className="w-full px-4 py-2 border border-sage-300 rounded-lg"
          />

          {!form.delivery_date && (
            <p className="text-[10px] text-red-500 mt-1">
              Delivery date is required
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="gift_message"
            className="block text-sm font-medium text-sage-700 mb-1"
          >
            Gift message
          </label>
          <textarea
            id="gift_message"
            name="gift_message"
            value={form.gift_message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-sage-300 rounded-lg"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-sage-600 text-white py-3 rounded-lg font-semibold"
        >
          {submitting ? 'Placing order…' : 'Confirm & Place Order'}
        </button>
      </form>
    </div>
  )
}