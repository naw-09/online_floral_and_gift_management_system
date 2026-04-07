import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => setOrder(null))
  }, [id])

  if (!order) return <div className="max-w-2xl mx-auto px-4 py-12">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="font-display text-2xl font-semibold text-sage-900">#{order.id} Order</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.status === 'delivered' ? 'bg-sage-100 text-sage-700' :
          order.status === 'prepared' ? 'bg-floral-100 text-floral-700' : 'bg-sage-200 text-sage-800'
        }`}>{order.status}</span>
      </div>
      <p className="text-sage-600">Placed on: {new Date(order.created_at).toLocaleString()}</p>
      {order.delivery_date && <p className="text-sage-600">Delivery: {new Date(order.delivery_date).toLocaleDateString()}</p>}
      {order.gift_message && <p className="mt-2 p-3 bg-floral-50 rounded-lg text-sage-700">Gift message: {order.gift_message}</p>}
      <p className="mt-2 font-medium">Delivery: {order.delivery_address}</p>
      <ul className="mt-6 space-y-3 border-t border-sage-200 pt-4">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.product?.name} × {item.quantity}</span>
            <span>${(item.quantity * Number(item.unit_price)).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-semibold text-sage-900">Total: ${Number(order.total).toFixed(2)}</p>
    </div>
  )
}
