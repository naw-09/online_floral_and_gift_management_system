import { useState, useEffect } from 'react'
import API from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    const params = statusFilter ? `?status=${statusFilter}` : ''
    API.get(`/admin/orders${params}`).then(({ data }) => setOrders(data)).finally(() => setLoading(false))
  }
  useEffect(() => load(), [statusFilter])

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Orders</h1>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mb-4 px-3 py-2 border border-sage-300 rounded-lg">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="prepared">Prepared</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <div className="bg-white rounded-xl border border-sage-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-sage-50"><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Customer</th><th className="px-4 py-2 text-left">Total</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Update</th></tr></thead>
          <tbody>
            {orders.data?.map((o) => (
              <tr key={o.id} className="border-t border-sage-100">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.user?.name}</td>
                <td className="px-4 py-2">${Number(o.total).toFixed(2)}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="px-2 py-1 border border-sage-300 rounded text-xs">
                    <option value="pending">Pending</option>
                    <option value="prepared">Prepared</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
