import { useState } from 'react'
import ImageLightbox from 'src/components/ImageLightbox/ImageLightbox'
import { Metadata } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'
import { useCart } from 'src/contexts/CartContext'
import { useAuth } from 'src/auth'
import { navigate, routes } from '@redwoodjs/router'
import { toast, Toaster } from '@redwoodjs/web/toast'
import gql from 'graphql-tag'

const GET_DESIGNS = gql`
  query GetDesigns {
    designs(status: "ACTIVE") {
      id
      name
      description
      imageUrl
      publicId
      status
      createdAt
    }
  }
`

const GET_PRINTABLE_ITEMS = gql`
  query GetPrintableItems {
    printableItems(status: "ACTIVE") {
      id
      name
      description
      price
      imageUrl
      publicId
      status
      createdAt
    }
  }
`

const CustomPrintsPage = () => {
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()

  const PRINT_FEE = 20 // €20 print fee

  const totalPrice = selectedProduct ? selectedProduct.price + PRINT_FEE : 0

  const handleAddToCart = async (design, product, totalPrice) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart')
      navigate(routes.login())
      return
    }

    if (!design || !product) {
      toast.error('Please select both a design and a product')
      return
    }

    try {
      // Create a modified product object with the custom print pricing
      const customPrintProduct = {
        ...product,
        price: totalPrice, // Override price to include print fee
        name: `${product.name} (Custom Print)`,
        description: `${product.description}\n\nCustom Design: ${design.name}`
      }

      // Add to cart with design and printable item information
      await addItem(customPrintProduct, 1, {
        designUrl: design.imageUrl,
        designId: design.publicId,
        printFee: PRINT_FEE,
        printableItemId: product.id
      })

      toast.success(`Custom print added to cart!`)

      // Optional: Reset selections after successful add
      setSelectedDesign(null)
      setSelectedProduct(null)

    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart. Please try again.')
    }
  }

  return (
    <>
      <Metadata
        title="Custom Prints - Route93"
        description="Create custom printed products with your own designs"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Custom Prints
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a design and product to create your unique custom print.
                We add a €20 printing fee to all custom orders.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Design Selection */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Choose Your Design
                </h2>
                <DesignSelector
                  selectedDesign={selectedDesign}
                  onSelectDesign={setSelectedDesign}
                  onPreview={(imageUrl) => { setLightboxImage(imageUrl); setLightboxOpen(true) }}
                />
              </div>
            </div>

            {/* Right Column: Product Selection */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Choose Your Product
                </h2>
                <ProductSelector
                  selectedProduct={selectedProduct}
                  onSelectProduct={setSelectedProduct}
                  onPreview={(imageUrl) => { setLightboxImage(imageUrl); setLightboxOpen(true) }}
                />
              </div>

              {/* Pricing and Add to Cart */}
              {selectedDesign && selectedProduct && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Product:</span>
                      <span>€{selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Print Fee:</span>
                      <span>€{PRINT_FEE.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-semibold text-gray-900">
                        <span>Total:</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    onClick={() => handleAddToCart(selectedDesign, selectedProduct, totalPrice)}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <ImageLightbox
        isOpen={lightboxOpen}
        imageUrl={lightboxImage}
        alt={selectedDesign?.name || selectedProduct?.name || 'Preview'}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

const DesignSelector = ({ selectedDesign, onSelectDesign, onPreview }) => {
  const { loading, error, data } = useQuery(GET_DESIGNS)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading designs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading designs: {error.message}</p>
      </div>
    )
  }

  const designs = data?.designs || []

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p>No designs available yet.</p>
        <p className="text-sm mt-2">Admin needs to upload some designs first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {designs.map((design) => (
          <div
            key={design.id}
            onClick={() => onSelectDesign(design)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedDesign?.id === design.id
                ? 'border-purple-600 shadow-lg'
                : 'border-gray-200 hover:border-purple-400'
            }`}
          >
            <div className="aspect-square">
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                }}
              />
            </div>
            {/* Preview button */}
            <button
              type="button"
              className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
              onClick={(e) => { e.stopPropagation(); onPreview?.(design.imageUrl) }}
            >
              Preview
            </button>
            {selectedDesign?.id === design.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              <p className="text-sm font-medium truncate">{design.name}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedDesign && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3">
            <img
              src={selectedDesign.imageUrl}
              alt={selectedDesign.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium text-gray-900">{selectedDesign.name}</h4>
              {selectedDesign.description && (
                <p className="text-sm text-gray-600">{selectedDesign.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ProductSelector = ({ selectedProduct, onSelectProduct, onPreview }) => {
  const { loading, error, data } = useQuery(GET_PRINTABLE_ITEMS)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading products: {error.message}</p>
      </div>
    )
  }

  const products = data?.printableItems || []

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p>No printable products available yet.</p>
        <p className="text-sm mt-2">Admin needs to add some printable items first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedProduct?.id === product.id
                ? 'border-purple-600 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-400 hover:bg-purple-25'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-medium text-gray-900 truncate">{product.name}</h4>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                )}
                <p className="text-lg font-semibold text-purple-600 mt-2">€{product.price.toFixed(2)}</p>
              </div>
            </div>

            {selectedProduct?.id === product.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Preview button */}
            {product.imageUrl && (
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                onClick={(e) => { e.stopPropagation(); onPreview?.(product.imageUrl) }}
              >
                Preview
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-4">
            {selectedProduct.imageUrl ? (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
              {selectedProduct.description && (
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              )}
              <p className="text-lg font-semibold text-purple-600">€{selectedProduct.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomPrintsPage
