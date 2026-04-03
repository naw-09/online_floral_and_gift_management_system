// import { useState, useEffect } from 'react'
// import API from '../../api/axios';

// export default function AdminOrders() {
//   const [orders, setOrders] = useState({ data: [] })
//   const [loading, setLoading] = useState(true)
//   const [statusFilter, setStatusFilter] = useState('')

//   const load = () => {
//     const params = statusFilter ? `?status=${statusFilter}` : ''
//     API.get(`/admin/orders${params}`).then(({ data }) => setOrders(data)).finally(() => setLoading(false))
//   }
//   useEffect(() => load(), [statusFilter])

//   const updateStatus = async (orderId, status) => {
//     try {
//       await API.put(`/admin/orders/${orderId}/status`, { status })
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed')
//     }
//   }

//   if (loading) return <div>Loading…</div>

//   return (
//     <div>
//       <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Orders</h1>
//       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mb-4 px-3 py-2 border border-sage-300 rounded-lg">
//         <option value="">All statuses</option>
//         <option value="pending">Pending</option>
//         <option value="prepared">Prepared</option>
//         <option value="delivered">Delivered</option>
//         <option value="cancelled">Cancelled</option>
//       </select>
//       <div className="bg-white rounded-xl border border-sage-200 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead><tr className="bg-sage-50"><th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Customer</th><th className="px-4 py-2 text-left">Total</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Update</th></tr></thead>
//           <tbody>
//             {orders.data?.map((o) => (
//               <tr key={o.id} className="border-t border-sage-100">
//                 <td className="px-4 py-2">{o.id}</td>
//                 <td className="px-4 py-2">{o.user?.name}</td>
//                 <td className="px-4 py-2">${Number(o.total).toFixed(2)}</td>
//                 <td className="px-4 py-2">{o.status}</td>
//                 <td className="px-4 py-2">
//                   <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="px-2 py-1 border border-sage-300 rounded text-xs">
//                     <option value="pending">Pending</option>
//                     <option value="prepared">Prepared</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import API from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  // ✅ Modal state
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const load = () => {
    setLoading(true)
    const params = statusFilter ? `?status=${statusFilter}` : ''
    API.get(`/admin/orders${params}`)
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders({ data: [] }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  // ✅ Update status
  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  // ✅ View order details
  const viewOrder = async (id) => {
    try {
      const { data } = await API.get(`/admin/orders/${id}`)
      setSelectedOrder(data)
      setShowModal(true)
    } catch (err) {
      alert('Failed to load order')
    }
  }

  if (loading) {
    return <div className="p-6 text-sage-600">Loading…</div>
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">
        Orders
      </h1>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-4 px-3 py-2 border border-sage-300 rounded-lg"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="prepared">Prepared</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Table */}
      <div className="bg-white rounded-xl border border-sage-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sage-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Gift Message</th>
              <th className="px-4 py-2 text-left">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.data?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-sage-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.data.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => viewOrder(o.id)}
                  className="border-t border-sage-100 cursor-pointer hover:bg-sage-50"
                >
                  <td className="px-4 py-2">{o.id}</td>

                  <td className="px-4 py-2">
                    {o.user?.name || '—'}
                  </td>

                  <td className="px-4 py-2">
                    ${Number(o.total).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${o.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
                        ${o.status === 'prepared' && 'bg-blue-100 text-blue-700'}
                        ${o.status === 'delivered' && 'bg-green-100 text-green-700'}
                        ${o.status === 'cancelled' && 'bg-red-100 text-red-700'}
                      `}
                    >
                      {o.status}
                    </span>
                  </td>

                  {/* Gift Message */}
                  <td className="px-4 py-2 max-w-xs">
                    {o.gift_message ? (
                      <span
                        className="text-sage-700 text-xs block truncate"
                        title={o.gift_message}
                      >
                        {o.gift_message}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Update Status */}
                  <td
                    className="px-4 py-2"
                    onClick={(e) => e.stopPropagation()} // ✅ prevent modal
                  >
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o.id, e.target.value)
                      }
                      className="px-2 py-1 border border-sage-300 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="prepared">Prepared</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ ORDER DETAIL MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Order #{selectedOrder.id}
            </h2>

            {/* Customer */}
            <div className="mb-4">
              <h3 className="font-medium text-sage-800">Customer</h3>
              <p className="text-sm text-sage-600">
                {selectedOrder.user?.name}
              </p>
            </div>

            {/* Delivery */}
            <div className="mb-4">
              <h3 className="font-medium text-sage-800">Delivery</h3>
              <p className="text-sm text-sage-600">
                {selectedOrder.delivery_address}
              </p>
              <p className="text-sm text-sage-600">
                {selectedOrder.delivery_phone}
              </p>
              <p className="text-sm text-sage-600">
                {selectedOrder.delivery_date}
              </p>
            </div>

            {/* Gift Message */}
            <div className="mb-4">
              <h3 className="font-medium text-sage-800">Gift Message</h3>
              <p className="text-sm text-sage-600">
                {selectedOrder.gift_message || '—'}
              </p>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-medium text-sage-800 mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      ${Number(item.unit_price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 text-right font-semibold">
              Total: ${Number(selectedOrder.total).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
