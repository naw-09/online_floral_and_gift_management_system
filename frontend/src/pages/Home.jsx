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




import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useCart } from '../contexts/CartContext'; 

export default function Home() {
  const { addToCart } = useCart(); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleOpenQtyModal = (product) => {
    // Safety check: Don't open if out of stock
    if (product.stock <= 0) return;
    
    setSelectedProduct(product);
    setQuantity(1);
    setShowQtyModal(true);
  };

  const handleConfirmAdd = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
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

      {/* Product Grids */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        {loading ? (
            <div className="text-center text-sage-500">Loading products...</div>
        ) : (
            <>
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

                 {discountProducts.length > 0 && (
                <section className="bg-sage-50/50 -mx-4 px-4 py-12 rounded-3xl">
                    <h2 className="font-display text-2xl font-semibold text-sage-900 mb-8 flex items-center gap-2">
                        Discount Product
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {discountProducts.map(p => (
                        <ProductCard key={p.id} p={p} onAdd={handleOpenQtyModal} />
                    ))}
                    </div>
                </section>
                )}

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
            </>
        )}
      </div>

        {/* Category Section */}
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
              <p className="text-sage-600 mt-1">
                Bouquets and arrangements for every occasion.
              </p>
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
              <p className="text-sage-600 mt-1">
                Curated gifts and baskets.
              </p>
            </div>
          </Link>
        </div>
      </section>


      {/* --- QUANTITY MODAL --- */}
      {showQtyModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQtyModal(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-sage-50 border border-sage-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-1">{selectedProduct.name}</h3>
              
              {/* Stock Warning */}
              <p className="text-xs font-semibold text-amber-600 mb-6 uppercase tracking-wider">
                Only {selectedProduct.stock} Available
              </p>

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
                  onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                  disabled={quantity >= selectedProduct.stock}
                  className="w-12 h-12 rounded-full border border-sage-200 flex items-center justify-center hover:bg-sage-50 text-2xl font-light transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirmAdd}
                  className="w-full py-4 bg-sage-600 text-white font-bold rounded-2xl hover:bg-sage-700 transition-all shadow-lg active:scale-[0.98]"
                >
                  Add to Cart • ${((selectedProduct.discount_price || selectedProduct.price) * quantity).toFixed(2)}
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
 * UPDATED PRODUCT CARD WITH STOCK LOGIC
 */
function ProductCard({ p, onAdd }) {
  const isOutOfStock = p.stock <= 0;

  const handlePlusClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!isOutOfStock) onAdd(p); 
  };

  return (
    <Link to={`/products/${p.id}`} className={`group block bg-white rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative ${isOutOfStock ? 'grayscale-[0.5]' : ''}`}>
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {isOutOfStock ? (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full">SOLD OUT</span>
        ) : (
            <>
                {p.discount_price > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">SALE</span>}
                {p.is_popular && <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">POPULAR</span>}
            </>
        )}
      </div>
      
      <div className="h-60 bg-sage-50 overflow-hidden relative">
        {p.image ? (
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            {p.type === 'floral' ? '🌸' : '🎁'}
          </div>
        )}
        {/* Low Stock Badge */}
        {!isOutOfStock && p.stock < 5 && (
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[9px] font-black text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
                ONLY {p.stock} LEFT
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
            disabled={isOutOfStock}
            className={`${isOutOfStock ? 'bg-slate-200 cursor-not-allowed' : 'bg-sage-800 hover:bg-sage-600 shadow-md'} text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90`}
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
  );
}