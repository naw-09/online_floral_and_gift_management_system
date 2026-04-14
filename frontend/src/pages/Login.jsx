// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // 1. Call the login function from our AuthContext
//       const { user } = await login(email, password);
//             if (user?.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       // 3. Handle errors from Laravel (e.g., 401 Invalid Credentials)
//       const message = err.response?.data?.message || 'Login failed. Please try again.';
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-sage-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-display font-bold text-sage-900">Welcome Back</h1>
//           <p className="text-sage-600 mt-2">Log in to manage your floral orders</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {error && (
//             <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-sage-700 mb-1.5">Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full px-4 py-2.5 border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-sage-700 mb-1.5">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full px-4 py-2.5 border border-sage-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none transition-all"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Authenticating...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="mt-8 pt-6 border-t border-sage-100 text-center">
//           <p className="text-sage-600 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-sage-700 font-bold hover:underline">
//               Create an account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user } = await login(email, password)

      if (user?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-sage-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-sage-900">
            Welcome Back
          </h1>
          <p className="text-sage-600 mt-2">
            Log in to manage your floral orders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 border border-sage-200 rounded-xl"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-sage-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-sage-100 text-center">
          <p className="text-sage-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-sage-700 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}