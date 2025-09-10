import { Metadata, useQuery, useMutation } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import { getPrimaryProductImage } from 'src/lib/imageUtils'

const QUERY = gql`
  query MyWishlist {
    myWishlist { id product { id name images price salePrice slug } }
  }
`

const REMOVE = gql`
  mutation RemoveFromWishlist($id: Int!) { deleteWishlist(id: $id) { id } }
`

const WishlistPage = () => {
  const { data, loading, error, refetch } = useQuery(QUERY)
  const [remove] = useMutation(REMOVE, { onCompleted: () => refetch() })
  const { addItem } = useCart()

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error.message}</div>

  const items = data?.myWishlist || []

  return (
    <>
      <Metadata title="Wishlist - Route93" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="text-gray-600">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((w) => {
              const img = getPrimaryProductImage(w.product, 'https://via.placeholder.com/400x400?text=No+Image')
              const onSale = w.product.salePrice && w.product.salePrice < w.product.price
              const discountPercent = onSale ? Math.round(((w.product.price - w.product.salePrice) / w.product.price) * 100) : 0
              return (
                <div key={w.id} className="bg-white rounded-lg shadow p-4">
                  {/* Sale badges */}
                  {onSale && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Sale
                      </span>
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                        -{discountPercent}%
                      </span>
                    </div>
                  )}
                  <Link to={routes.product({ slug: w.product.slug })}>
                    <img src={img} alt={w.product.name} className="w-full h-48 object-cover rounded" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image' }} />
                    <div className="mt-3 font-medium">{w.product.name}</div>
                  </Link>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {w.product.salePrice && w.product.salePrice < w.product.price ? (
                        <>
                          <div className="text-purple-600 font-semibold">€{w.product.salePrice.toFixed(2)}</div>
                          <div className="text-gray-500 line-through text-sm">€{w.product.price.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-purple-600 font-semibold">€{w.product.price.toFixed(2)}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => { await addItem({ id: w.product.id, name: w.product.name, price: w.product.price, images: w.product.images, slug: w.product.slug }, 1) }}
                        className="btn-primary btn-sm"
                      >
                        Add to cart
                      </button>
                      <button onClick={() => remove({ variables: { id: w.id } })} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default WishlistPage


