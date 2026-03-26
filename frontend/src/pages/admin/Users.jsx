import { useState, useEffect } from 'react'
import API from '../../api/axios'; 

export default function AdminUsers() {
  const [users, setUsers] = useState({ data: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false))
  }, [])

  const toggleActive = async (user) => {
    try {
      await API.put(`/admin/users/${user.id}`, { is_active: !user.is_active })
      setUsers((prev) => ({
        ...prev,
        data: prev.data.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u),
      }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Users</h1>
      <div className="bg-white rounded-xl border border-sage-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-sage-50"><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Action</th></tr></thead>
          <tbody>
            {users.data?.map((u) => (
              <tr key={u.id} className="border-t border-sage-100">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2">
                  <button type="button" onClick={() => toggleActive(u)} className="text-sage-600 hover:underline">
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
