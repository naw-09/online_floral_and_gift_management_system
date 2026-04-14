

import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../contexts/CartContext' 
import ProductCard from '../components/ProductCard'

export default function Products() {
  const { addToCart } = useCart() 
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState({ data: [], meta: {} })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category_id') || ''
    setFilters((prev) => {
      if (prev.category_id === categoryFromUrl) return prev
      return {
        ...prev,
        category_id: categoryFromUrl,
      }
    })
  }, [searchParams])

  useEffect(() => {
    API.get('/categories')
      .then(({ data }) => setCategories(data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        params.set(k, v)
      }
    })

    API.get(`/products?${params}`)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts({ data: [], meta: {} }))
      .finally(() => setLoading(false))
  }, [filters])

  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const handleQuickAdd = (product) => {
    if (product.stock <= 0) return;
    addToCart(product, 1); 
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-sage-900 mb-8 text-center md:text-left">
        Explore Our Collection
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* FILTER SIDEBAR (Kept exactly the same) */}
        <aside className="md:w-64 shrink-0 space-y-6">
          <div className="bg-sage-50 p-6 rounded-2xl border border-sage-100 sticky top-24">
            <h2 className="text-sm font-bold text-sage-800 uppercase tracking-widest mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-sage-500 uppercase">Search</label>
                <input
                  type="text"
                  placeholder="Roses, Lilies..."
                  value={filters.search}
                  onChange={(e) => handleFilter('search', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm focus:ring-2 focus:ring-sage-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-sage-500 uppercase">Category</label>
                <select
                  value={filters.category_id}
                  onChange={(e) => handleFilter('category_id', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-sage-500 uppercase">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilter('type', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
                >
                  <option value="">All types</option>
                  <option value="floral">Floral</option>
                  <option value="gift">Gift</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-sage-500 uppercase">Price Range</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => handleFilter('min_price', e.target.value)}
                    className="w-full px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => handleFilter('max_price', e.target.value)}
                    className="w-full px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-sage-500 uppercase">Sort By</label>
                <select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split('-')
                    setFilters((f) => ({ ...f, sort_by, sort_order }))
                  }}
                  className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="flex-1">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-sage-50 rounded-2xl animate-pulse"></div>
               ))}
            </div>
          ) : products.data?.length === 0 ? (
            <div className="text-center py-20 bg-sage-50 rounded-3xl">
               <p className="text-sage-500 font-medium">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.data?.map((p) => (
                <ProductCard 
                  key={p.id} 
                  p={p} 
                  onAdd={handleQuickAdd} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}