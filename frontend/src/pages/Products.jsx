import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../api/axios';


export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState({ data: [], meta: {} })
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    API.get(`/products?${params}`)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts({ data: [], meta: {} }))
      .finally(() => setLoading(false))
  }, [filters])

  const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Shop</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0 space-y-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
          />
          <select
            value={filters.category_id}
            onChange={(e) => handleFilter('category_id', e.target.value)}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilter('type', e.target.value)}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
          >
            <option value="">All types</option>
            <option value="floral">Floral</option>
            <option value="gift">Gift</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min price"
              value={filters.min_price}
              onChange={(e) => handleFilter('min_price', e.target.value)}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.max_price}
              onChange={(e) => handleFilter('max_price', e.target.value)}
              className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
            />
          </div>
          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-')
              setFilters((f) => ({ ...f, sort_by, sort_order }))
            }}
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
          >
            <option value="created_at-desc">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </aside>
        <div className="flex-1">
          {loading ? (
            <p className="text-sage-600">Loading…</p>
          ) : products.data?.length === 0 ? (
            <p className="text-sage-600">No products found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.data?.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="block rounded-xl border border-floral-200 bg-white overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-48 bg-floral-100 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{p.type === 'floral' ? '🌸' : '🎁'}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-sage-500 uppercase">{p.category?.name}</p>
                    <h2 className="font-display font-semibold text-sage-900 mt-1">{p.name}</h2>
                    <p className="text-sage-600 text-sm mt-1 line-clamp-2">{p.description}</p>
                    <p className="mt-2 font-semibold text-sage-800">${Number(p.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
