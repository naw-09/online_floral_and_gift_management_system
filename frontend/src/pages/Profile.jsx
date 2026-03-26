import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import API from '../api/axios';

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' })
  }, [user])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await API.put('/user', form)
      setMessage('Profile updated.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Profile</h1>
      <p className="text-sage-600 text-sm mb-4">{user?.email}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className={`p-3 rounded-lg text-sm ${message === 'Profile updated.' ? 'bg-sage-100 text-sage-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
        </div>
        <button type="submit" disabled={saving} className="bg-sage-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}
