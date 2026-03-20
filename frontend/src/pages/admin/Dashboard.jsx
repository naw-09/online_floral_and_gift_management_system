import { useState, useEffect } from 'react'
import API from '../../api/axios'; 

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data: d }) => setData(d)).catch(() => setData(null))
  }, [])

  if (!data) return <div>Loading dashboard…</div>

  const cards = [
    { label: 'Total orders', value: data.orders_count },
    { label: 'Products', value: data.products_count },
    { label: 'Customers', value: data.users_count },
    { label: 'Total sales', value: `$${Number(data.total_sales).toFixed(2)}` },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-sage-200 p-4">
            <p className="text-sage-600 text-sm">{c.label}</p>
            <p className="text-xl font-semibold text-sage-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-sage-200 overflow-hidden">
        <h2 className="px-4 py-3 font-medium text-sage-900 border-b border-sage-200">Recent orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sage-50 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.recent_orders || []).map((o) => (
                <tr key={o.id} className="border-t border-sage-100">
                  <td className="px-4 py-2">{o.id}</td>
                  <td className="px-4 py-2">{o.user?.name}</td>
                  <td className="px-4 py-2">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-2">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
