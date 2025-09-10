import { useAuth } from 'src/auth'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const ADD = gql`
  mutation AddToWishlist($input: CreateWishlistInput!) {
    createWishlist(input: $input) { id }
  }
`

const REMOVE = gql`
  mutation RemoveFromWishlist($id: Int!) {
    deleteWishlist(id: $id) { id }
  }
`

const QUERY = gql`
  query WishlistByProduct($productId: Int!) {
    wishlistByProduct(productId: $productId) { id }
  }
`

const WishlistButton = ({ productId, variantId = null, wishedId = null, onChange }) => {
  const { isAuthenticated, currentUser } = useAuth()
  const { data, refetch } = useQuery(QUERY, { variables: { productId }, skip: !!wishedId === true })
  const localId = data?.wishlistByProduct?.id || wishedId
  const [add] = useMutation(ADD, { onCompleted: () => { onChange && onChange(); refetch && refetch(); toast.success('Added to wishlist') } })
  const [remove] = useMutation(REMOVE, { onCompleted: () => { onChange && onChange(); refetch && refetch(); toast.success('Removed from wishlist') } })

  const handleClick = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    if (localId) {
      await remove({ variables: { id: localId } })
    } else {
      await add({ variables: { input: { userId: currentUser.id, productId, variantId } } })
    }
  }

  return (
    <button onClick={handleClick} aria-label={localId ? 'Remove from wishlist' : 'Add to wishlist'} className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors`}>
      <svg className={`w-4 h-4 ${localId ? 'text-red-500' : 'text-gray-600'}`} fill={localId ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}

export default WishlistButton


