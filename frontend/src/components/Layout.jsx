import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur border-b border-floral-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold text-sage-800">
            Floral & Gift
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/products" className="text-sage-700 hover:text-sage-900 font-medium">
              Shop
            </Link>
            <Link to="/cart" className="text-sage-700 hover:text-sage-900 font-medium">
              Cart
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="text-sage-700 hover:text-sage-900 font-medium">
                  Orders
                </Link>
                <Link to="/profile" className="text-sage-700 hover:text-sage-900 font-medium">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-floral-600 hover:text-floral-700 font-medium">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-sage-600 hover:text-sage-900 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sage-700 hover:text-sage-900 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-sage-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-sage-800 text-sage-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="font-display text-lg text-floral-200 mb-2">Floral & Gift</p>
          <p>© {new Date().getFullYear()} Online Floral and Gift Management System</p>
        </div>
      </footer>
    </div>
  )
}
