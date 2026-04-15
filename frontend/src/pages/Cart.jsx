import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h2>Your cart is empty</h2>

        <p className="text-sage-600 mb-8">
          Please login to view your cart.
        </p>

        <Link
          to="/login"
          className="bg-sage-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-sage-700 transition-all shadow-lg shadow-sage-200"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h2>Your cart is empty</h2>

        <p className="text-sage-600 mb-8">
          Looks like you haven't added any flowers yet.
        </p>

        <Link
          to="/products"
          className="bg-sage-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-sage-700 transition-all shadow-lg shadow-sage-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-sage-900 mb-8">
        Your Shopping Cart
      </h1>

      <div className="space-y-4">
        {cart.map((item) => {
          const itemPrice = Number(item.discount_price || item.price);

          return (
            <div
              key={item.id}
              className="flex gap-4 p-5 border border-sage-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow items-center"
            >
              {/* Product Image */}
              <div className="w-24 h-24 rounded-xl bg-sage-50 overflow-hidden shrink-0 border border-sage-50">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {item.type === 'floral' ? '🌸' : '🎁'}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sage-900 text-lg leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sage-500 text-sm font-medium">
                      ${itemPrice.toFixed(2)} each
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 p-1 transition-colors"
                    title="Remove Item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Quantity + Subtotal */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-sage-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1 hover:bg-sage-50 text-sage-600 transition-colors border-r border-sage-200"
                    >
                      −
                    </button>

                    <span className="px-4 font-bold text-sage-900 text-sm min-w-[40px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 hover:bg-sage-50 text-sage-600 transition-colors border-l border-sage-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-sage-400 block uppercase font-bold tracking-wider">
                      Subtotal
                    </span>
                    <span className="font-bold text-sage-900 text-lg">
                      ${(item.quantity * itemPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-10 p-8 bg-sage-50 rounded-3xl border border-sage-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sage-600 font-medium">Order Total</span>
          <span className="text-3xl font-bold text-sage-900">
            ${getCartTotal().toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            className="flex-1 text-center py-4 text-sage-600 font-semibold hover:text-sage-800 transition-colors"
          >
            ← Continue Shopping
          </Link>

          <Link
            to="/checkout"
            className="flex-1 bg-sage-800 text-white text-center py-4 rounded-2xl font-bold text-lg hover:bg-sage-900 transition-all shadow-lg shadow-sage-200 active:scale-[0.98]"
          >
            Proceed to Checkout
          </Link>
        </div>

        <p className="text-center text-sage-400 text-xs mt-6">
          Shipping and taxes calculated at checkout.
        </p>
      </div>
    </div>
  );
}