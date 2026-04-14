// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

// export default function Register() {
//   const [form, setForm] = useState({
//     name: '', email: '', password: '', password_confirmation: '', phone: '', address: '',
//   })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const { register } = useAuth()
//   const navigate = useNavigate()

//   const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       await register(form)
//       navigate('/')
//     } catch (err) {
//       const msg = err.response?.data?.message || err.response?.data?.errors
//       setError(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : msg || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto px-4 py-12">
//       <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Create account</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {error && (
//           <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
//         )}
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Name</label>
//           <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Email</label>
//           <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Password</label>
//           <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Confirm password</label>
//           <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Phone (optional)</label>
//           <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-sage-700 mb-1">Address (optional)</label>
//           <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500" />
//         </div>
//         <button type="submit" disabled={loading} className="w-full bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50">
//           {loading ? 'Creating account…' : 'Sign up'}
//         </button>
//       </form>
//       <p className="mt-4 text-center text-sage-600 text-sm">
//         Already have an account? <Link to="/login" className="text-sage-700 font-medium hover:underline">Log in</Link>
//       </p>
//     </div>
//   )
// }


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors

      setError(
        typeof msg === 'object'
          ? Object.values(msg).flat().join(' ')
          : msg || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ERROR BOX (FIX FOR TESTING) */}
        {error && (
          <div
            data-testid="error-message"
            className="p-3 rounded-lg bg-red-50 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* NAME */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border w-full p-2"
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border w-full p-2"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border w-full p-2"
            required
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label htmlFor="password_confirmation">Confirm Password</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            className="border w-full p-2"
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-sage-600 text-white w-full p-2"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      {/* LOGIN LINK */}
      <p className="mt-4 text-center">
        Already have account?{' '}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  )
}
