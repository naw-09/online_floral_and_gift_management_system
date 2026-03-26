import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState({ data: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders').then(({ data }) => setOrders(data)).catch(() => setOrders({ data: [] })).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Order history</h1>
      {orders.data?.length === 0 ? (
        <p className="text-sage-600">No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.data?.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`} className="block p-4 border border-sage-200 rounded-xl bg-white hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sage-900">Order #{o.id}</p>
                    <p className="text-sage-600 text-sm">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      o.status === 'delivered' ? 'bg-sage-100 text-sage-700' :
                      o.status === 'prepared' ? 'bg-floral-100 text-floral-700' : 'bg-sage-200 text-sage-800'
                    }`}>{o.status}</span>
                    <p className="font-semibold text-sage-800 mt-1">${Number(o.total).toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
