import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLayout from './components/admin/AdminLayout'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public / normal routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        {/* Default / redirect to dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}