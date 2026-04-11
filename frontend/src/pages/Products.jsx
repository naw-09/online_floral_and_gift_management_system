// import { useState, useEffect } from 'react'
// import { Link, useSearchParams } from 'react-router-dom'
// import API from '../api/axios';


// export default function Products() {
//   const [searchParams] = useSearchParams()
//   const [products, setProducts] = useState({ data: [], meta: {} })
//   const [categories, setCategories] = useState([])
//   const [filters, setFilters] = useState({
//     search: searchParams.get('search') || '',
//     category_id: searchParams.get('category_id') || '',
//     type: searchParams.get('type') || '',
//     min_price: searchParams.get('min_price') || '',
//     max_price: searchParams.get('max_price') || '',
//     sort_by: 'created_at',
//     sort_order: 'desc',
//   })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     API.get('/categories').then(({ data }) => setCategories(data)).catch(() => {})
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     const params = new URLSearchParams()
//     Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
//     API.get(`/products?${params}`)
//       .then(({ data }) => setProducts(data))
//       .catch(() => setProducts({ data: [], meta: {} }))
//       .finally(() => setLoading(false))
//   }, [filters])

//   const handleFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Shop</h1>
//       <div className="flex flex-col md:flex-row gap-6">
//         <aside className="md:w-56 shrink-0 space-y-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={filters.search}
//             onChange={(e) => handleFilter('search', e.target.value)}
//             className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//           />
//           <select
//             value={filters.category_id}
//             onChange={(e) => handleFilter('category_id', e.target.value)}
//             className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//           >
//             <option value="">All categories</option>
//             {categories.map((c) => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>
//           <select
//             value={filters.type}
//             onChange={(e) => handleFilter('type', e.target.value)}
//             className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//           >
//             <option value="">All types</option>
//             <option value="floral">Floral</option>
//             <option value="gift">Gift</option>
//           </select>
//           <div className="flex gap-2">
//             <input
//               type="number"
//               placeholder="Min price"
//               value={filters.min_price}
//               onChange={(e) => handleFilter('min_price', e.target.value)}
//               className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//             />
//             <input
//               type="number"
//               placeholder="Max price"
//               value={filters.max_price}
//               onChange={(e) => handleFilter('max_price', e.target.value)}
//               className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//             />
//           </div>
//           <select
//             value={`${filters.sort_by}-${filters.sort_order}`}
//             onChange={(e) => {
//               const [sort_by, sort_order] = e.target.value.split('-')
//               setFilters((f) => ({ ...f, sort_by, sort_order }))
//             }}
//             className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm"
//           >
//             <option value="created_at-desc">Newest</option>
//             <option value="price-asc">Price: low to high</option>
//             <option value="price-desc">Price: high to low</option>
//           </select>
//         </aside>
//         <div className="flex-1">
//           {loading ? (
//             <p className="text-sage-600">Loading…</p>
//           ) : products.data?.length === 0 ? (
//             <p className="text-sage-600">No products found.</p>
//           ) : (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.data?.map((p) => (
//                 <Link
//                   key={p.id}
//                   to={`/products/${p.id}`}
//                   className="block rounded-xl border border-floral-200 bg-white overflow-hidden hover:shadow-md transition"
//                 >
//                   <div className="h-48 bg-floral-100 flex items-center justify-center">
//                     {p.image ? (
//                       <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-5xl">{p.type === 'floral' ? '🌸' : '🎁'}</span>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <p className="text-xs text-sage-500 uppercase">{p.category?.name}</p>
//                     <h2 className="font-display font-semibold text-sage-900 mt-1">{p.name}</h2>
//                     <p className="text-sage-600 text-sm mt-1 line-clamp-2">{p.description}</p>
//                     <p className="mt-2 font-semibold text-sage-800">${Number(p.price).toFixed(2)}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect } from 'react'
// import { Link, useSearchParams } from 'react-router-dom'
// import API from '../api/axios'
// import { useCart } from '../contexts/CartContext' 

// export default function Products() {
//   const { addToCart } = useCart() 
//   const [searchParams] = useSearchParams()

//   const [products, setProducts] = useState({ data: [], meta: {} })
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [filters, setFilters] = useState({
//     search: searchParams.get('search') || '',
//     category_id: searchParams.get('category_id') || '',
//     type: searchParams.get('type') || '',
//     min_price: searchParams.get('min_price') || '',
//     max_price: searchParams.get('max_price') || '',
//     sort_by: 'created_at',
//     sort_order: 'desc',
//   })

//   useEffect(() => {
//     setFilters((prev) => ({
//       ...prev,
//       category_id: searchParams.get('category_id') || ''
//     }))
//   }, [searchParams])

//   useEffect(() => {
//     API.get('/categories')
//       .then(({ data }) => setCategories(data || []))
//       .catch(() => setCategories([]))
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     const params = new URLSearchParams()
//     Object.entries(filters).forEach(([k, v]) => {
//       if (v !== '' && v !== null && v !== undefined) {
//         params.set(k, v)
//       }
//     })

//     API.get(`/products?${params}`)
//       .then(({ data }) => setProducts(data))
//       .catch(() => setProducts({ data: [], meta: {} }))
//       .finally(() => setLoading(false))
//   }, [filters])

//   const handleFilter = (key, value) => {
//     setFilters((f) => ({ ...f, [key]: value }))
//   }

 
//   const handleQuickAdd = (e, product) => {
//     e.preventDefault(); 
//     e.stopPropagation(); 
//     addToCart(product, 1); 
//     alert(`${product.name} added to cart!`);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <h1 className="font-display text-3xl font-bold text-sage-900 mb-8 text-center md:text-left">
//         Explore Our Collection
//       </h1>

//       <div className="flex flex-col md:flex-row gap-10">
//         {/* FILTER SIDEBAR */}
//         <aside className="md:w-64 shrink-0 space-y-6">
//           <div className="bg-sage-50 p-6 rounded-2xl border border-sage-100 sticky top-24">
//             <h2 className="text-sm font-bold text-sage-800 uppercase tracking-widest mb-4">Filters</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="text-xs font-semibold text-sage-500 uppercase">Search</label>
//                 <input
//                   type="text"
//                   placeholder="Roses, Lilies..."
//                   value={filters.search}
//                   onChange={(e) => handleFilter('search', e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm focus:ring-2 focus:ring-sage-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-sage-500 uppercase">Category</label>
//                 <select
//                   value={filters.category_id}
//                   onChange={(e) => handleFilter('category_id', e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
//                 >
//                   <option value="">All categories</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-sage-500 uppercase">Type</label>
//                 <select
//                   value={filters.type}
//                   onChange={(e) => handleFilter('type', e.target.value)}
//                   className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
//                 >
//                   <option value="">All types</option>
//                   <option value="floral">Floral</option>
//                   <option value="gift">Gift</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-sage-500 uppercase">Price Range</label>
//                 <div className="flex gap-2 mt-1">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={filters.min_price}
//                     onChange={(e) => handleFilter('min_price', e.target.value)}
//                     className="w-full px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={filters.max_price}
//                     onChange={(e) => handleFilter('max_price', e.target.value)}
//                     className="w-full px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-sage-500 uppercase">Sort By</label>
//                 <select
//                   value={`${filters.sort_by}-${filters.sort_order}`}
//                   onChange={(e) => {
//                     const [sort_by, sort_order] = e.target.value.split('-')
//                     setFilters((f) => ({ ...f, sort_by, sort_order }))
//                   }}
//                   className="w-full mt-1 px-3 py-2 border border-sage-200 rounded-xl text-sm outline-none"
//                 >
//                   <option value="created_at-desc">Newest First</option>
//                   <option value="price-asc">Price: Low to High</option>
//                   <option value="price-desc">Price: High to Low</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* PRODUCTS GRID */}
//         <div className="flex-1">
//           {loading ? (
//             <p className="text-sage-600">Loading…</p>
//           ) : products.data?.length === 0 ? (
//             <div className="text-center py-20 bg-sage-50 rounded-3xl">
//                <p className="text-sage-500 font-medium">No products found matching your criteria.</p>
//             </div>
//           ) : (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {products.data?.map((p) => (
//                 <Link
//                   key={p.id}
//                   to={`/products/${p.id}`}
//                   className="group block bg-white rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl transition-all relative"
//                 >
//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
//                     {p.discount_price > 0 && (
//                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">SALE</span>
//                     )}
//                     {p.is_popular && (
//                       <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">POPULAR</span>
//                     )}
//                   </div>

//                   {/* Image Container */}
//                   <div className="h-56 bg-sage-50 flex items-center justify-center overflow-hidden">
//                     {p.image ? (
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                     ) : (
//                       <span className="text-5xl opacity-30">
//                         {p.type === 'floral' ? '🌸' : '🎁'}
//                       </span>
//                     )}
//                   </div>

//                   {/* Details Container */}
//                   <div className="p-5">
//                     <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
//                       {p.category?.name || 'Collection'}
//                     </p>

//                     <h2 className="font-display font-bold text-sage-900 text-lg mt-1 group-hover:text-sage-600 transition-colors truncate">
//                       {p.name}
//                     </h2>

//                     <div className="mt-4 flex items-center justify-between">
//                       <div className="flex flex-col">
//                         {p.discount_price > 0 ? (
//                           <>
//                             <span className="text-lg font-bold text-sage-900">${Number(p.discount_price).toFixed(2)}</span>
//                             <span className="text-xs text-sage-300 line-through">${Number(p.price).toFixed(2)}</span>
//                           </>
//                         ) : (
//                           <span className="text-lg font-bold text-sage-900">${Number(p.price).toFixed(2)}</span>
//                         )}
//                       </div>

//                       {/* 🔥 QUICK ADD BUTTON */}
//                       <button
//                         onClick={(e) => handleQuickAdd(e, p)}
//                         className="bg-sage-800 hover:bg-sage-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md"
//                         title="Quick Add to Cart"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../contexts/CartContext' 

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

  // Sync category from URL (e.g. from Home page category links)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category_id: searchParams.get('category_id') || ''
    }))
  }, [searchParams])

  // Load categories for the sidebar
  useEffect(() => {
    API.get('/categories')
      .then(({ data }) => setCategories(data || []))
      .catch(() => setCategories([]))
  }, [])

  // Load products whenever filters change
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

  const handleQuickAdd = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (product.stock <= 0) return;

    addToCart(product, 1); 
    // You could replace this alert with a toast notification
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-sage-900 mb-8 text-center md:text-left">
        Explore Our Collection
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* FILTER SIDEBAR */}
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
              {products.data?.map((p) => {
                const isOutOfStock = p.stock <= 0;
                
                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className={`group block bg-white rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl transition-all relative ${isOutOfStock ? 'opacity-75' : ''}`}
                  >
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {isOutOfStock ? (
                        <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">SOLD OUT</span>
                      ) : (
                        <>
                          {p.discount_price > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">SALE</span>
                          )}
                          {p.is_popular && (
                            <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">POPULAR</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Image Container */}
                    <div className="h-56 bg-sage-50 flex items-center justify-center overflow-hidden relative">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <span className="text-5xl opacity-30">
                          {p.type === 'floral' ? '🌸' : '🎁'}
                        </span>
                      )}
                      
                      {/* Low Stock Badge */}
                      {!isOutOfStock && p.stock < 5 && (
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[9px] font-black text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
                          ONLY {p.stock} LEFT
                        </div>
                      )}
                    </div>

                    {/* Details Container */}
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
                        {p.category?.name || 'Collection'}
                      </p>

                      <h2 className="font-display font-bold text-sage-900 text-lg mt-1 group-hover:text-sage-600 transition-colors truncate">
                        {p.name}
                      </h2>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          {p.discount_price > 0 ? (
                            <>
                              <span className="text-lg font-bold text-sage-900">${Number(p.discount_price).toFixed(2)}</span>
                              <span className="text-xs text-sage-300 line-through">${Number(p.price).toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-sage-900">${Number(p.price).toFixed(2)}</span>
                          )}
                        </div>

                        {/* 🔥 QUICK ADD BUTTON (Stock Aware) */}
                        <button
                          onClick={(e) => handleQuickAdd(e, p)}
                          disabled={isOutOfStock}
                          className={`${isOutOfStock ? 'bg-sage-200 cursor-not-allowed' : 'bg-sage-800 hover:bg-sage-600 shadow-md'} text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90`}
                          title={isOutOfStock ? "Out of Stock" : "Quick Add to Cart"}
                        >
                          {isOutOfStock ? (
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                             </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}