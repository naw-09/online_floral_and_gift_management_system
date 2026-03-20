import { Outlet, Link, NavLink } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-sage-800 text-sage-100 shrink-0">
        <div className="p-4 border-b border-sage-700">
          <Link to="/admin" className="font-display font-semibold text-lg">Admin</Link>
        </div>
        <nav className="p-2 space-y-1">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-sage-700' : 'hover:bg-sage-700/50'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-sage-700' : 'hover:bg-sage-700/50'}`}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-sage-700' : 'hover:bg-sage-700/50'}`}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-sage-700' : 'hover:bg-sage-700/50'}`}>
            Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-sage-700' : 'hover:bg-sage-700/50'}`}>
            Users
          </NavLink>
          <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-sage-700/50 text-sm">← Back to shop</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-sage-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
