import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../api/axios'
import { clearUser, setAuthLoading, setUser } from '../store/slices/authSlice'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.auth.loading)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)))
    }
    dispatch(setAuthLoading(false))
  }, [dispatch])

  return !loading ? children : null
}

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const register = async (form) => {
    const response = await API.post('/register', form)
    const { user: registeredUser, token } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(registeredUser))
    dispatch(setUser(registeredUser))

    return { user: registeredUser }
  }

  const login = async (email, password) => {
    const response = await API.post('/login', { email, password })
    const { user: loggedInUser, token } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(loggedInUser))
    dispatch(setUser(loggedInUser))

    return { user: loggedInUser }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(clearUser())
  }

  const updateUser = (updatedUser) => {
    dispatch(setUser(updatedUser))
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return {
    user,
    register,
    login,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
  }
}