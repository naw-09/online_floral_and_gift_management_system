import { Link } from 'react-router-dom';

function ProductCard({ p, onAdd }) {
  const isOutOfStock = p.stock <= 0;
  const isLoggedIn = !!localStorage.getItem("token");

  const handlePlusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOutOfStock) onAdd(p);
  };

  return (
    <Link
      to={`/products/${p.id}`}
      className={`group block bg-white rounded-2xl border border-sage-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative ${isOutOfStock ? 'grayscale-[0.5]' : ''}`}
    >
      {/* badges (unchanged) */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {isOutOfStock ? (
          <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            SOLD OUT
          </span>
        ) : (
          <>
            {p.discount_price > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                SALE
              </span>
            )}
            {p.is_popular && (
              <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                POPULAR
              </span>
            )}
          </>
        )}
      </div>

      {/* image */}
      <div className="h-60 bg-sage-50 overflow-hidden relative">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            {p.type === 'floral' ? '🌸' : '🎁'}
          </div>
        )}

        {!isOutOfStock && p.stock < 5 && (
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[9px] font-black text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
            ONLY {p.stock} LEFT
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-5">
        <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">
          {p.category?.name || 'Collection'}
        </span>

        <h3 className="font-display font-bold text-sage-900 text-lg mt-1 truncate">
          {p.name}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {p.discount_price > 0 ? (
              <>
                <span className="text-lg font-bold text-sage-900">
                  ${Number(p.discount_price).toFixed(2)}
                </span>
                <span className="text-xs text-sage-400 line-through">
                  ${Number(p.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-sage-900">
                ${Number(p.price).toFixed(2)}
              </span>
            )}
          </div>

          {isLoggedIn && (
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
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;