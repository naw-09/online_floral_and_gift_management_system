import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null));
  }, []);

  if (!data) return <div className="text-center py-12">Loading dashboard…</div>;

  const cards = [
    { label: 'Total Orders', value: data.orders_count },
    { label: 'Products', value: data.products_count },
    { label: 'Customers', value: data.users_count },
    { label: 'Total Sales', value: `$${Number(data.total_sales).toFixed(2)}` },
  ];

  const statusData = Object.entries(data.orders_by_status).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-sage-900">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-5 border border-sage-200 hover:shadow-lg transition">
            <p className="text-sage-600 text-sm">{c.label}</p>
            <p className="text-2xl font-semibold text-sage-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Orders by Status Chart */}
      <div className="bg-white rounded-xl shadow p-5 border border-sage-200">
        <h2 className="text-sage-900 font-medium mb-4">Orders by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-sage-200">
        <h3 className="px-4 py-3 font-medium text-sage-900 border-b border-sage-200">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sage-50 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_orders.map((o) => (
                <tr key={o.id} className="border-t border-sage-100 hover:bg-sage-50 transition">
                  <td className="px-4 py-2">{o.id}</td>
                  <td className="px-4 py-2">{o.user?.name}</td>
                  <td className="px-4 py-2">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${
                      o.status === 'delivered' ? 'bg-green-500' :
                      o.status === 'prepared' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}