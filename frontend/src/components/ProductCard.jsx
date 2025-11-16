import { useState } from 'react'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
// ProductCard.jsx — Individual product card with interactive features
// ---------------------------------------------------------------------------
// Features:
// - Product name and image
// - Star rating display
// - Add to basket button
// - Buy now button
// - Responsive design with hover effects
// ---------------------------------------------------------------------------

export default function ProductCard({ product, onAddToBasket, onBuyNow }) {
  const [isAddingToBasket, setIsAddingToBasket] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const handleAddToBasket = async () => {
    setIsAddingToBasket(true)
    try {
      await onAddToBasket(product)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAddingToBasket(false)
    }
  }

  const handleBuyNow = async () => {
    setIsBuying(true)
    try {
      await onBuyNow(product)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsBuying(false)
    }
  }

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    return stars
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Optional: Add a badge for special products */}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="text-xl font-bold text-emerald-600 mb-4">
          ${product.price.toFixed(2)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToBasket}
            disabled={isAddingToBasket || isBuying}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              isAddingToBasket 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
          >
            {isAddingToBasket ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </div>
            ) : (
              'Add to Basket'
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isAddingToBasket || isBuying}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              isBuying 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50'
            }`}
          >
            {isBuying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buying...
              </div>
            ) : (
              'Buy Now'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    reviewCount: PropTypes.number.isRequired,
    isNew: PropTypes.bool,
  }).isRequired,
  onAddToBasket: PropTypes.func.isRequired,
  onBuyNow: PropTypes.func.isRequired,
}
