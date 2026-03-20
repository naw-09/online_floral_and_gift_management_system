import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="relative py-24 px-4 bg-gradient-to-br from-sage-50 via-floral-50 to-sage-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Fresh Flowers & Thoughtful Gifts
          </h1>
          <p className="text-lg text-sage-700 mb-8 max-w-2xl mx-auto">
            Browse our collections, add a personal message, and schedule delivery for any occasion.
          </p>
          <Link
            to="/products"
            className="inline-block bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
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
              <h2 className="font-display text-xl font-semibold text-sage-900">Floral Arrangements</h2>
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
              <h2 className="font-display text-xl font-semibold text-sage-900">Gift Items</h2>
              <p className="text-sage-600 mt-1">Curated gifts and baskets.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
