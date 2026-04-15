import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import Cart from '../pages/Cart';
import { vi, beforeEach } from 'vitest';

vi.mock('../contexts/CartContext', async () => {
  const actual = await vi.importActual('../contexts/CartContext');

  return {
    ...actual,
    useCart: vi.fn(),
  };
});

import { useCart } from '../contexts/CartContext';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: { id: 1, name: 'Test User', role: 'user' },
      loading: false,
    },
  },
});

const renderCart = () =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>
  );

beforeEach(() => {
  useCart.mockReturnValue({
    cart: [
      {
        id: 1,
        name: 'Rose Bouquet',
        price: 10,
        quantity: 2,
        image: '',
        type: 'floral',
      },
    ],
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    getCartTotal: () => 20,
  });
});

describe('Cart Page', () => {
  test('renders cart item', () => {
    renderCart();
    expect(screen.getByText('Rose Bouquet')).toBeInTheDocument();
  });

  test('shows quantity', () => {
    renderCart();
    expect(screen.getByText('2')).toBeInTheDocument();
  });


  test('remove button exists', () => {
    renderCart();
    expect(screen.getByTitle('Remove Item')).toBeInTheDocument();
  });

  test('increase button exists', () => {
    renderCart();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  test('decrease button exists', () => {
    renderCart();
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  test('empty cart shows message', () => {
    useCart.mockReturnValueOnce({
      cart: [],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getCartTotal: () => 0,
    });

    renderCart();

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test('shows login message when user is not logged in', () => {
    const emptyStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          loading: false,
        },
      },
    });

    render(
      <Provider store={emptyStore}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Please login to view your cart/i)).toBeInTheDocument();
  });
});