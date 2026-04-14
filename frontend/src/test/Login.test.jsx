import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Login from '../pages/Login'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
  useNavigate: () => mockNavigate,
}))

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('test login', () => {
    render(<Login />)

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/admin@example.com/i)).toBeInTheDocument()
  })

  test('admin login redirects', async () => {
    mockLogin.mockResolvedValue({
      user: { role: 'admin' },
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@test.com' },
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password')
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
    })
  })

  test('user login redirects', async () => {
    mockLogin.mockResolvedValue({
      user: { role: 'user' },
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@test.com' },
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('shows error on failure', async () => {
    mockLogin.mockRejectedValue({
      response: {
        data: { message: 'Invalid credentials' },
      },
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@test.com' },
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})