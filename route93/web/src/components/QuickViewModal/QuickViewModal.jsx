import { useEffect, useMemo, useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const { displayPrice, originalPrice, mainImage, images } = useMemo(() => {
    const price = typeof product?.price === 'number' ? product.price : Number(product?.price) || 0
    const salePrice = typeof product?.salePrice === 'number' ? product.salePrice : Number(product?.salePrice) || null
    const computedDisplay = product?.displayPrice ?? (salePrice && salePrice < price ? salePrice : price)
    const computedOriginal = product?.originalPrice ?? (salePrice && salePrice < price ? price : null)

    let parsedImages = []
    try {
      if (product?.images && String(product.images).trim()) {
        const arr = JSON.parse(product.images)
        if (Array.isArray(arr)) parsedImages = arr
      }
    } catch (e) {
      parsedImages = []
    }
    const main = product?.image || parsedImages[0] || '/images/placeholder-product.jpg'

    return {
      displayPrice: computedDisplay,
      originalPrice: computedOriginal,
      mainImage: main,
      images: parsedImages.length > 0 ? parsedImages : (product?.image ? [product.image] : [])
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleAdd = async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      await addItem(product, 1)
      onClose?.()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('QuickView add to cart failed:', err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 md:mx-6 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b border-gray-100">
          <h3 id="quickview-title" className="text-lg md:text-2xl font-bold text-gray-900">
            {product.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close quick view"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image/Gallery */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="hidden md:grid grid-cols-5 gap-3 mt-4">
                  {images.slice(0, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {images.length > 1 && (
                <div className="md:hidden flex gap-2 mt-3 overflow-x-auto">
                  {images.slice(0, 6).map((img, idx) => (
                    <div key={idx} className="min-w-[72px] h-18 rounded-lg overflow-hidden border border-gray-100">
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category & Stock */}
              <div className="flex items-center gap-3 mb-4">
                {product.category?.name && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {product.category.name}
                  </span>
                )}
                {typeof product.stockQuantity === 'number' && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.stockQuantity === 0
                      ? 'bg-red-100 text-red-700'
                      : product.stockQuantity < 10
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {product.stockQuantity === 0
                      ? 'Out of stock'
                      : product.stockQuantity < 10
                        ? `Only ${product.stockQuantity} left`
                        : 'In stock'}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                {originalPrice ? (
                  <div className="flex items-center gap-4 flex-col">
                    <span className="text-3xl md:text-4xl font-bold text-purple-600">€{Number(displayPrice).toFixed(2)}</span>
                    <span className="text-lg md:text-xl text-gray-400 line-through">€{Number(originalPrice).toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">€{Number(displayPrice).toFixed(2)}</span>
                )}
              </div>

              {/* Rating */}
              {typeof product.averageRating === 'number' && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  {product.reviewCount > 0 && (
                    <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
                  )}
                </div>
              )}

              

              {/* Meta */}
              <div className="grid grid-row-2 gap-4 text-sm text-gray-600">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500">SKU</div>
                  <div className="font-medium text-gray-900">{product.sku || 'N/A'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500">Category</div>
                  <div className="font-medium text-gray-900">{product.category?.name || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 md:px-8 py-4 md:py-5 border-t border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              disabled={isAdding || product.stockQuantity === 0}
              className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all ${
                product.stockQuantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:scale-105 hover:shadow-lg'
              }`}
            >
              {isAdding ? 'Adding…' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link
              to={routes.product({ slug: product.slug })}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
              onClick={onClose}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickViewModal


