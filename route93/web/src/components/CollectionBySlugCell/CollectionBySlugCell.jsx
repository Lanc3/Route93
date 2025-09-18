import WishlistButton from 'src/components/WishlistButton/WishlistButton'
import { useCart } from 'src/contexts/CartContext'
export const QUERY = gql`
  query FindCollectionBySlugQuery($slug: String!) {
    collectionBySlug(slug: $slug) {
      id
      name
      slug
      description
      image
      _count { products }
      products {
        product {
          id
          name
          slug
          images
          price
          salePrice
          status
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ collectionBySlug }) => {
  const { addItem } = useCart()

  const addToCartQuick = (product) => {
    // Basic add with quantity 1, no design info
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.salePrice || product.price,
        salePrice: product.salePrice,
        images: product.images,
        inventory: 9999,
      },
      1,
      null
    )
  }
  const products = (collectionBySlug?.products || []).map((pc) => pc.product)
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-semibold text-gray-900">{collectionBySlug.name}</h1>
        {collectionBySlug.description && (
          <p className="text-gray-600 mt-2">{collectionBySlug.description}</p>
        )}
        <div className="text-sm text-gray-500 mt-1">{products.length} products</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-lg border shadow-sm hover:shadow p-3 flex flex-col">
            <a href={`/product/${p.slug}`} className="block">
              <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                {(() => { try { const imgs = p.images ? JSON.parse(p.images) : []; return imgs?.[0]; } catch { return null } })() ? (
                  <img className="w-full h-full object-cover" src={(() => { try { const imgs = p.images ? JSON.parse(p.images) : []; return imgs?.[0]; } catch { return '' } })()} alt={p.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
            </a>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-sm text-purple-700">
                {typeof p.salePrice === 'number' ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">€{p.price?.toFixed(2)}</span>
                    <span>€{p.salePrice?.toFixed(2)}</span>
                  </>
                ) : (
                  <span>€{p.price?.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <WishlistButton productId={p.id} />
                <button
                  onClick={(e) => { e.preventDefault(); addToCartQuick(p) }}
                  className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
