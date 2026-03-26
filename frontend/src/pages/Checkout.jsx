import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import API from '../api/axios';

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [form, setForm] = useState({
    delivery_address: '', delivery_phone: '', delivery_date: '', gift_message: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    API.get('/cart').then(({ data }) => {
      setCart({ items: data.items || [], total: data.total || 0 })
      setForm((f) => ({ ...f, delivery_address: user?.address || '', delivery_phone: user?.phone || '' }))
    }).catch(() => setCart({ items: [], total: 0 })).finally(() => setLoading(false))
  }, [user])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.post('/orders', form)
      navigate('/orders')
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="max-w-lg mx-auto px-4 py-12">Loading…</div>
  if (cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Checkout</h1>
      <p className="text-sage-600 mb-4">Total: ${Number(cart.total).toFixed(2)}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Delivery address *</label>
          <textarea name="delivery_address" value={form.delivery_address} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Delivery phone</label>
          <input name="delivery_phone" value={form.delivery_phone} onChange={handleChange} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Delivery date</label>
          <input name="delivery_date" type="date" value={form.delivery_date} onChange={handleChange} min={new Date().toISOString().slice(0, 10)} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Gift message</label>
          <textarea name="gift_message" value={form.gift_message} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" placeholder="Optional personal message" />
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50">
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  )
}
