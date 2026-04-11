import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios';
import { useCart } from '../contexts/CartContext'; 

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
    
    navigate('/cart');
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sage-500 font-medium">Loading product details...</div>
  if (!product) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500">Product not found.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        
        {/* Product Image Section */}
        <div className="aspect-square rounded-3xl bg-sage-50 border border-sage-100 overflow-hidden shadow-sm flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-9xl">{product.type === 'floral' ? '🌸' : '🎁'}</span>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-2">
            {product.category?.name || 'Collection'}
          </p>
          
          <h1 className="font-display text-4xl font-bold text-sage-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            {product.discount_price > 0 ? (
              <>
                <span className="text-3xl font-bold text-sage-900">${Number(product.discount_price).toFixed(2)}</span>
                <span className="text-xl text-sage-300 line-through">${Number(product.price).toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold">SALE</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-sage-900">${Number(product.price).toFixed(2)}</span>
            )}
          </div>

          <p className="text-lg text-sage-600 leading-relaxed mb-8">
            {product.description || "Freshly curated with care for any special occasion."}
          </p>

          <div className="p-6 bg-sage-50 rounded-2xl border border-sage-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-sage-700 uppercase">Select Quantity</label>
                
                {/* Plus/Minus Style Selector */}
                <div className="flex items-center border border-sage-200 bg-white rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-sage-50 text-sage-600 transition-colors border-r border-sage-200"
                  >−</button>
                  <span className="px-6 font-bold text-sage-900 w-14 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 hover:bg-sage-50 text-sage-600 transition-colors border-l border-sage-200"
                  >+</button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-sage-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-sage-900 transition-all shadow-lg shadow-sage-200 active:scale-[0.98]"
              >
                Add to Cart • ${( (product.discount_price || product.price) * quantity ).toFixed(2)}
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-bold text-sage-400 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚚</span> Fast Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span> Fresh Quality
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}