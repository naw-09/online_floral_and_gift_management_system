import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    API.get(`/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setProduct(null))
  }, [id])

  const addToCart = async () => {
    setAdding(true)
    try {
      await API.post('/cart', { product_id: Number(id), quantity })
      navigate('/cart')
    } catch (e) {
      alert(e.response?.data?.message || 'Please log in to add to cart.')
    } finally {
      setAdding(false)
    }
  }

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-8">Loading…</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl bg-floral-100 flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-8xl">{product.type === 'floral' ? '🌸' : '🎁'}</span>
          )}
        </div>
        <div>
          <p className="text-sage-500 text-sm">{product.category?.name}</p>
          <h1 className="font-display text-2xl font-semibold text-sage-900 mt-1">{product.name}</h1>
          <p className="text-2xl font-semibold text-sage-800 mt-2">${Number(product.price).toFixed(2)}</p>
          <p className="text-sage-600 mt-4">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <label className="text-sm font-medium text-sage-700">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-sage-300 rounded-lg"
            />
            <button
              onClick={addToCart}
              disabled={adding}
              className="bg-sage-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50"
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
