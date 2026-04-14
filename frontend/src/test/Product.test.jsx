import { render, screen, fireEvent } from "@testing-library/react";
import Products from "../pages/Products"; 
import { vi } from 'vitest'
import { BrowserRouter } from "react-router-dom";
import API from "../api/axios";

vi.stubGlobal('alert', vi.fn())

vi.mock('../api/axios')

vi.mock('../contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}))

const mockSearchParams = new URLSearchParams()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams],
  }
})

const mockProducts = {
  data: [
    {
      id: 1,
      name: 'Rose Bouquet',
      price: 20,
      discount_price: 15,
      stock: 10,
      is_popular: true,
      type: 'floral',
      image: '',
      category: { name: 'Bouquets' },
    },
  ],
}

const mockCategories = [
  { id: 1, name: 'Bouquets' },
]

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  )

describe('Products Page', () => {

  beforeEach(() => {
    API.get.mockImplementation((url) => {
      if (url.includes('/categories')) {
        return Promise.resolve({ data: mockCategories })
      }
      if (url.includes('/products')) {
        return Promise.resolve({ data: mockProducts })
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('loading state', async () => {
    renderComponent()

    await screen.findByText('Rose Bouquet')

    expect(screen.getByText(/explore our collection/i)).toBeInTheDocument()
  })

  test('get products', async () => {
    renderComponent()

    expect(await screen.findByText('Rose Bouquet')).toBeInTheDocument()
  })

  test('category filter options', async () => {
    renderComponent()

    const option = await screen.findByRole('option', { name: 'Bouquets' })

    expect(option).toBeInTheDocument()
  })

  test('add button', async () => {
    renderComponent()

    await screen.findByText('Rose Bouquet')

    const button = screen.getByTitle('Quick Add to Cart')
    fireEvent.click(button)

    expect(button).toBeInTheDocument()
  })

  test('shows empty state when no products', async () => {
    API.get.mockImplementation((url) => {
      if (url.includes('/products')) {
        return Promise.resolve({ data: { data: [] } })
      }
      if (url.includes('/categories')) {
        return Promise.resolve({ data: mockCategories })
      }
    })

    renderComponent()

    expect(
      await screen.findByText('No products found matching your criteria.')
    ).toBeInTheDocument()
  })
})