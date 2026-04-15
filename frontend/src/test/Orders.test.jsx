import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Orders from '../pages/Orders'
import { BrowserRouter } from 'react-router-dom'
import API from '../api/axios'

vi.mock('../api/axios')

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: ({ children }) => <div>{children}</div>, 
  }
})

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Orders />
    </BrowserRouter>
  )

describe('Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('shows loading initially', () => {
    API.get.mockReturnValue(new Promise(() => {})) 
    renderComponent()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders orders list', async () => {
    API.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            created_at: '2024-01-01',
            status: 'delivered',
            total: 50,
          },
        ],
      },
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/order #1/i)).toBeInTheDocument()
      expect(screen.getByText(/delivered/i)).toBeInTheDocument()
      expect(screen.getByText('$50.00')).toBeInTheDocument()
    })
  })

  test('shows empty message when no orders', async () => {
    API.get.mockResolvedValue({
      data: { data: [] },
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/no orders yet/i)).toBeInTheDocument()
    })
  })
})