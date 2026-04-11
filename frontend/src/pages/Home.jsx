// import { Link } from 'react-router-dom'

// export default function Home() {
//   return (
//     <div>
//       <section className="relative py-24 px-4 bg-gradient-to-br from-sage-50 via-floral-50 to-sage-100">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
//             Fresh Flowers & Thoughtful Gifts
//           </h1>
//           <p className="text-lg text-sage-700 mb-8 max-w-2xl mx-auto">
//             Browse our collections, add a personal message, and schedule delivery for any occasion.
//           </p>
//           <Link
//             to="/products"
//             className="inline-block bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-700 transition"
//           >
//             Shop Now
//           </Link>
//         </div>
//       </section>
//       <section className="py-16 px-4">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
//           <Link
//             to="/products?type=floral"
//             className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
//           >
//             <div className="h-48 bg-gradient-to-br from-floral-200 to-floral-300 flex items-center justify-center">
//               <span className="text-5xl">🌸</span>
//             </div>
//             <div className="p-6">
//               <h2 className="font-display text-xl font-semibold text-sage-900">Floral Arrangements</h2>
//               <p className="text-sage-600 mt-1">Bouquets and arrangements for every occasion.</p>
//             </div>
//           </Link>
//           <Link
//             to="/products?type=gift"
//             className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
//           >
//             <div className="h-48 bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
//               <span className="text-5xl">🎁</span>
//             </div>
//             <div className="p-6">
//               <h2 className="font-display text-xl font-semibold text-sage-900">Gift Items</h2>
//               <p className="text-sage-600 mt-1">Curated gifts and baskets.</p>
//             </div>
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }


// import { Link } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import API from '../api/axios'

// export default function Home() {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     API.get('/products?limit=6') // fetch 6 products
//       .then(({ data }) => {
//         setProducts(data.data || [])
//       })
//       .catch(() => setProducts([]))
//       .finally(() => setLoading(false))
//   }, [])

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative py-24 px-4 bg-gradient-to-br from-sage-50 via-floral-50 to-sage-100">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
//             Fresh Flowers & Thoughtful Gifts
//           </h1>
//           <p className="text-lg text-sage-700 mb-8 max-w-2xl mx-auto">
//             Browse our collections, add a personal message, and schedule delivery for any occasion.
//           </p>
//           <Link
//             to="/products"
//             className="inline-block bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-700 transition"
//           >
//             Shop Now
//           </Link>
//         </div>
//       </section>

//             {/* Featured Products Section */}
//       <section className="py-16 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="font-display text-2xl font-semibold text-sage-900">
//               Featured Products
//             </h2>
//             <Link
//               to="/products"
//               className="text-sage-600 hover:underline text-sm"
//             >
//               View All
//             </Link>
//           </div>

//           {loading ? (
//             <p className="text-sage-600">Loading...</p>
//           ) : products.length === 0 ? (
//             <p className="text-sage-600">No products found.</p>
//           ) : (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((p) => (
//                 <Link
//                   key={p.id}
//                   to={`/products/${p.id}`}
//                   className="block rounded-xl border border-floral-200 bg-white overflow-hidden hover:shadow-md transition"
//                 >
//                   <div className="h-48 bg-floral-100 flex items-center justify-center">
//                     {p.image ? (
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-5xl">
//                         {p.type === 'floral' ? '🌸' : '🎁'}
//                       </span>
//                     )}
//                   </div>

//                   <div className="p-4">
//                     <p className="text-xs text-sage-500 uppercase">
//                       {p.category?.name}
//                     </p>
//                     <h3 className="font-display font-semibold text-sage-900 mt-1">
//                       {p.name}
//                     </h3>
//                     <p className="text-sage-600 text-sm mt-1 line-clamp-2">
//                       {p.description}
//                     </p>
//                     <p className="mt-2 font-semibold text-sage-800">
//                       ${Number(p.price).toFixed(2)}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Category Section */}
//       <section className="py-16 px-4">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
//           <Link
//             to="/products?type=floral"
//             className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
//           >
//             <div className="h-48 bg-gradient-to-br from-floral-200 to-floral-300 flex items-center justify-center">
//               <span className="text-5xl">🌸</span>
//             </div>
//             <div className="p-6">
//               <h2 className="font-display text-xl font-semibold text-sage-900">
//                 Floral Arrangements
//               </h2>
//               <p className="text-sage-600 mt-1">
//                 Bouquets and arrangements for every occasion.
//               </p>
//             </div>
//           </Link>

//           <Link
//             to="/products?type=gift"
//             className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
//           >
//             <div className="h-48 bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
//               <span className="text-5xl">🎁</span>
//             </div>
//             <div className="p-6">
//               <h2 className="font-display text-xl font-semibold text-sage-900">
//                 Gift Items
//               </h2>
//               <p className="text-sage-600 mt-1">
//                 Curated gifts and baskets.
//               </p>
//             </div>
//           </Link>
//         </div>
//       </section>


//     </div>
//   )
// }


import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useCart } from '../contexts/CartContext'; 

export default function Home() {
  const { addToCart } = useCart(); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- States for Quantity Modal ---
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Derive filtered lists
  const featuredProducts = products.slice(0, 6);
  const popularProducts = products.filter(p => p.is_popular).slice(0, 3);
  const discountProducts = products.filter(p => p.discount_price && Number(p.discount_price) > 0).slice(0, 3);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/products?limit=50'),
      API.get('/categories'),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data || []);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Open Modal when "+" is clicked on a card
  const handleOpenQtyModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowQtyModal(true);
  };

  // 3. Final Add to Cart Logic using Context
  const handleConfirmAdd = () => {
    if (selectedProduct) {
      // Send data to the Global Cart List
      addToCart(selectedProduct, quantity);
      
      // Close UI
      setShowQtyModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-sage-50 via-floral-50 to-sage-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Fresh Flowers & Thoughtful Gifts
          </h1>
          <p className="text-lg text-sage-700 mb-8 max-w-2xl mx-auto">
            Hand-picked arrangements delivered straight to your door.
          </p>
          <Link to="/products" className="inline-block bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-700 transition shadow-lg shadow-sage-200">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories List */}
      <div className="py-12 border-b border-sage-100 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex justify-center gap-8 md:gap-12 min-w-max">
          {categories.map((c) => (
            <Link key={c.id} to={`/products?category_id=${c.id}`} className="group block text-center w-24">
              <div className="w-20 h-20 mx-auto bg-sage-50 rounded-full flex items-center justify-center overflow-hidden border border-sage-100 group-hover:border-sage-300 transition-all">
                <img src={`http://localhost:8000/storage/${c.image}`} alt={c.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="mt-3 text-xs font-bold text-sage-800 uppercase tracking-widest">{c.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {loading ? (
            <div className="text-center text-sage-500">Loading products...</div>
        ) : (
            <>
                {/* Featured Section */}
                <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-display text-2xl font-semibold text-sage-900">Featured Products</h2>
                    <Link to="/products" className="text-sage-600 hover:text-sage-800 text-sm font-medium">View All →</Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map(p => (
                    <ProductCard key={p.id} p={p} onAdd={handleOpenQtyModal} />
                    ))}
                </div>
                </section>

                {/* Popular Section */}
                {popularProducts.length > 0 && (
                <section className="bg-sage-50/50 -mx-4 px-4 py-12 rounded-3xl">
                    <h2 className="font-display text-2xl font-semibold text-sage-900 mb-8 flex items-center gap-2">
                    <span className="text-orange-500">🔥</span> Popular Right Now
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularProducts.map(p => (
                        <ProductCard key={p.id} p={p} onAdd={handleOpenQtyModal} />
                    ))}
                    </div>
                </section>
                )}

                {/* Special Offers Section */}
                {discountProducts.length > 0 && (
                <section>
                    <h2 className="font-display text-2xl font-semibold text-sage-900 mb-8 flex items-center gap-2">
                    <span className="text-red-500">🏷️</span> Special Offers
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {discountProducts.map(p => (
                        <ProductCard key={p.id} p={p} onAdd={handleOpenQtyModal} />
                    ))}
                    </div>
                </section>
                )}
            </>
        )}
      </div>

      {/* Category Quick Links */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <Link
            to="/products?type=floral"
            className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-48 bg-gradient-to-br from-floral-200 to-floral-300 flex items-center justify-center">
              <span className="text-5xl">🌸</span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold text-sage-900">
                Floral Arrangements
              </h2>
              <p className="text-sage-600 mt-1">Bouquets and arrangements for every occasion.</p>
            </div>
          </Link>

          <Link
            to="/products?type=gift"
            className="block rounded-2xl overflow-hidden border border-floral-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-48 bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
              <span className="text-5xl">🎁</span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold text-sage-900">
                Gift Items
              </h2>
              <p className="text-sage-600 mt-1">Curated gifts and baskets.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* --- QUANTITY MODAL --- */}
      {showQtyModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQtyModal(false)}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-sage-50 border border-sage-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-1">{selectedProduct.name}</h3>
              <p className="text-sage-500 text-sm mb-6">How many would you like to add?</p>

              {/* Counter Controls */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 rounded-full border border-sage-200 flex items-center justify-center hover:bg-sage-50 text-2xl font-light transition-colors"
                >
                  −
                </button>
                <span className="text-3xl font-display font-bold text-sage-900 w-10">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 rounded-full border border-sage-200 flex items-center justify-center hover:bg-sage-50 text-2xl font-light transition-colors"
                >
                  +
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmAdd}
                  className="w-full py-4 bg-sage-600 text-white font-bold rounded-2xl hover:bg-sage-700 transition-all shadow-lg shadow-sage-200 active:scale-[0.98]"
                >
                  Add to Cart • ${( (selectedProduct.discount_price || selectedProduct.price) * quantity ).toFixed(2)}
                </button>
                <button 
                  onClick={() => setShowQtyModal(false)}
                  className="w-full py-2 text-sage-400 text-sm font-medium hover:text-sage-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * REUSABLE PRODUCT CARD
 */
function ProductCard({ p, onAdd }) {
  const handlePlusClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    onAdd(p); 
  };

  return (
    <Link to={`/products/${p.id}`} className="group block bg-white rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {p.discount_price > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">SALE</span>}
        {p.is_popular && <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">POPULAR</span>}
      </div>
      
      <div className="h-60 bg-sage-50 overflow-hidden">
        {p.image ? (
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            {p.type === 'floral' ? '🌸' : '🎁'}
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">{p.category?.name || 'Collection'}</span>
        <h3 className="font-display font-bold text-sage-900 text-lg mt-1 truncate">{p.name}</h3>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {p.discount_price > 0 ? (
              <>
                <span className="text-lg font-bold text-sage-900">${Number(p.discount_price).toFixed(2)}</span>
                <span className="text-xs text-sage-400 line-through">${Number(p.price).toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-sage-900">${Number(p.price).toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handlePlusClick}
            className="bg-sage-800 hover:bg-sage-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}