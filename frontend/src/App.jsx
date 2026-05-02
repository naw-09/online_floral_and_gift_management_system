import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import ScrollToTop from './pages/ScrollToTop'  
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLayout from './components/admin/AdminLayout'
import AdminCategories from './pages/admin/Categories'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'

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
    <CartProvider>
    <ScrollToTop />
    <Routes>
      {/* Public / normal routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
          <Route path="checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="orders/:id" element={
          <ProtectedRoute><OrderDetail /></ProtectedRoute>
        } />
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
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </CartProvider>
  )
}