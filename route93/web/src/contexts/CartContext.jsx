import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from 'src/auth'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { formatPrice } from 'src/lib/currency'

const CartContext = createContext()

// Cart actions
const CART_ACTIONS = {
  LOAD_CART: 'LOAD_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING'
}

// GraphQL mutations for cart operations
const ADD_TO_CART_MUTATION = gql`
  mutation AddToCartMutation($input: CreateCartItemInput!) {
    createCartItem(input: $input) {
      id
      quantity
      designUrl
      designId
      printFee
      printableItemId
      product {
        id
        name
        slug
        price
        salePrice
        images
        inventory
      }
      printableItem {
        id
        name
        imageUrl
      }
    }
  }
`

const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItemMutation($id: Int!, $input: UpdateCartItemInput!) {
    updateCartItem(id: $id, input: $input) {
      id
      quantity
      designUrl
      designId
      printFee
      printableItemId
      product {
        id
        name
        slug
        price
        salePrice
        images
        inventory
      }
      printableItem {
        id
        name
        imageUrl
      }
    }
  }
`

const DELETE_CART_ITEM_MUTATION = gql`
  mutation DeleteCartItemMutation($id: Int!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`

const SYNC_CART_MUTATION = gql`
  mutation SyncCartMutation($items: [CartSyncInput!]!) {
    syncCart(items: $items) {
      id
      quantity
      designUrl
      designId
      printFee
      printableItemId
      product {
        id
        name
        slug
        price
        salePrice
        images
        inventory
      }
      printableItem {
        id
        name
        imageUrl
      }
    }
  }
`

const LOAD_USER_CART_QUERY = gql`
  query LoadUserCartQuery($userId: Int!) {
    userCartItems(userId: $userId) {
      id
      quantity
      designUrl
      designId
      printFee
      printableItemId
      product {
        id
        name
        slug
        price
        salePrice
        images
        inventory
      }
      printableItem {
        id
        name
        imageUrl
      }
    }
  }
`

const LOAD_PRINTABLE_ITEMS_QUERY = gql`
  query LoadPrintableItemsQuery {
    printableItems(status: "ACTIVE") {
      id
      name
      imageUrl
    }
  }
`

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload,
        loading: false
      }
    
    case CART_ACTIONS.ADD_ITEM: {
      // Use a composite key so custom prints (product + printableItem/design) don't merge incorrectly
      const makeKey = (ci) => `${ci.product?.id || ci.productId}|${ci.printableItemId || 0}|${ci.designId || ''}`
      const newKey = makeKey(action.payload)
      const existingIndex = state.items.findIndex((it) => makeKey(it) === newKey)

      if (existingIndex >= 0) {
        const updated = [...state.items]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + (action.payload.quantity || 0)
        }
        return { ...state, items: updated }
      }

      return { ...state, items: [...state.items, action.payload] }
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      }
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      }
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  items: [],
  loading: true
}

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { currentUser, isAuthenticated } = useAuth()

  // GraphQL mutations and queries
  const [addToCartDB] = useMutation(ADD_TO_CART_MUTATION)
  const [updateCartItemDB] = useMutation(UPDATE_CART_ITEM_MUTATION)
  const [deleteCartItemDB] = useMutation(DELETE_CART_ITEM_MUTATION)
  const [syncCartDB] = useMutation(SYNC_CART_MUTATION)

  // Query to load existing cart items
  const { data: userCartData, loading: cartLoading } = useQuery(LOAD_USER_CART_QUERY, {
    variables: { userId: currentUser?.id },
    skip: !isAuthenticated || !currentUser,
  })

  // Query to load printable items for populating cart items
  const { data: printableItemsData } = useQuery(LOAD_PRINTABLE_ITEMS_QUERY)

  // Local storage key
  const CART_STORAGE_KEY = 'route93_cart'

  // Load cart from localStorage or database
  useEffect(() => {
    loadCart()
  }, [isAuthenticated, currentUser])

  // Handle cart data from database query
  useEffect(() => {
    if (userCartData?.userCartItems && !cartLoading) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: userCartData.userCartItems })
    }
  }, [userCartData, cartLoading])

  // Re-populate printable item data when it becomes available
  useEffect(() => {
    if (printableItemsData?.printableItems && state.items.length > 0) {
      const needsUpdate = state.items.some(item =>
        item.printableItemId && !item.printableItem
      )

      if (needsUpdate) {
        const updatedItems = state.items.map(item => {
          if (item.printableItemId && !item.printableItem) {
            const printableItem = printableItemsData.printableItems.find(
              pi => pi.id === item.printableItemId
            )
            if (printableItem) {
              return { ...item, printableItem }
            }
          }
          return item
        })
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: updatedItems })
      }
    }
  }, [printableItemsData, state.items])

  const loadCart = async () => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })

    if (isAuthenticated && currentUser) {
      // Load from database for authenticated users
      try {
        // First sync any local cart items to database
        const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
        if (localCart.length > 0) {
          const syncInput = localCart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            designUrl: item.designUrl,
            designId: item.designId,
            printFee: item.printFee,
            printableItemId: item.printableItemId
          }))
          
          const { data } = await syncCartDB({ variables: { items: syncInput } })
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: data.syncCart })
          
          // Clear local storage after sync
          localStorage.removeItem(CART_STORAGE_KEY)
        } else {
          // Load existing cart from database
          if (userCartData?.userCartItems) {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: userCartData.userCartItems })
          } else {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] })
          }
        }
      } catch (error) {
        console.error('Error loading cart from database:', error)
        loadLocalCart()
      }
    } else {
      // Load from localStorage for guest users
      loadLocalCart()
    }
  }

  const loadLocalCart = () => {
    try {
      const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')

      // Populate printable item data for cart items that have printableItemId but no printableItem
      const populatedCart = localCart.map(item => {
        if (item.printableItemId && !item.printableItem && printableItemsData?.printableItems) {
          const printableItem = printableItemsData.printableItems.find(
            pi => pi.id === item.printableItemId
          )
          if (printableItem) {
            return { ...item, printableItem }
          }
        }
        return item
      })

      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: populatedCart })
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] })
    }
  }

  const saveToLocalStorage = (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Add item to cart
  const addItem = async (product, quantity = 1, designInfo = null) => {
    if (quantity <= 0) return
    if (product.inventory < quantity) {
      toast.error('Not enough inventory available')
      return
    }

    // Populate printable item data if available
    let printableItem = null
    console.log('=== CART ADD ITEM DEBUG ===')
    console.log('Product:', product)
    console.log('Design Info:', designInfo)
    console.log('Printable Items Data:', printableItemsData)
    console.log('Printable Items Array:', printableItemsData?.printableItems)

    if (designInfo?.printableItemId && printableItemsData?.printableItems) {
      printableItem = printableItemsData.printableItems.find(
        pi => pi.id === designInfo.printableItemId
      )
      console.log('Found printable item:', printableItem)
      console.log('Searching for ID:', designInfo.printableItemId)
      console.log('Available IDs:', printableItemsData.printableItems.map(pi => pi.id))
    } else {
      console.log('Cannot populate printable item - missing data or ID')
      console.log('Has printableItemId:', !!designInfo?.printableItemId)
      console.log('Has printableItemsData:', !!printableItemsData)
      console.log('Has printableItems array:', !!printableItemsData?.printableItems)
    }

    const cartItem = {
      id: `temp-${Date.now()}`, // Temporary ID for local state
      product,
      quantity,
      designUrl: designInfo?.designUrl,
      designId: designInfo?.designId,
      printFee: designInfo?.printFee,
      printableItemId: designInfo?.printableItemId,
      printableItem
    }

    // Update local state immediately
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem })

    if (isAuthenticated && currentUser) {
      // Save to database
      try {
        const { data } = await addToCartDB({
          variables: {
            input: {
              userId: currentUser.id,
              productId: product.id,
              quantity,
              designUrl: designInfo?.designUrl,
              designId: designInfo?.designId,
              printFee: designInfo?.printFee,
              printableItemId: designInfo?.printableItemId
            }
          }
        })
        
        // Update with real ID from database
        // Replace temp item with DB item
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id: cartItem.id } })
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: data.createCartItem })
        
        toast.success(`${product.name} added to cart`)
      } catch (error) {
        console.error('Error adding item to cart:', error)
        toast.error('Failed to add item to cart')
        // Revert local state change
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: cartItem })
      }
    } else {
      // Save to localStorage
      const updatedItems = [...state.items]
      const existingIndex = updatedItems.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += quantity
      } else {
        updatedItems.push(cartItem)
      }
      
      saveToLocalStorage(updatedItems)
      toast.success(`${product.name} added to cart`)
    }
  }

  // Remove item from cart
  const removeItem = async (itemId) => {
    const item = state.items.find(item => item.id === itemId)
    if (!item) return

    // Update local state immediately
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id: itemId } })

    if (isAuthenticated && currentUser && typeof itemId === 'number') {
      // Remove from database
      try {
        await deleteCartItemDB({ variables: { id: itemId } })
        toast.success('Item removed from cart')
      } catch (error) {
        console.error('Error removing item from cart:', error)
        toast.error('Failed to remove item from cart')
        // Revert local state change
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item })
      }
    } else {
      // Update localStorage
      const updatedItems = state.items.filter(item => item.id !== itemId)
      saveToLocalStorage(updatedItems)
      toast.success('Item removed from cart')
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    const item = state.items.find(item => item.id === itemId)
    if (!item) return

    if (item.product.inventory < quantity) {
      toast.error('Not enough inventory available')
      return
    }

    const oldQuantity = item.quantity

    // Update local state immediately
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity } })

    if (isAuthenticated && currentUser && typeof itemId === 'number' && itemId > 0) {
      // Only update database items with real numeric IDs (> 0)
      console.log('=== CART CONTEXT UPDATE DEBUG ===')
      console.log('Attempting to update cart item:', itemId)
      console.log('New quantity:', quantity)
      console.log('Item type check:', typeof itemId === 'number')
      console.log('Item ID > 0 check:', itemId > 0)

      try {
        await updateCartItemDB({
          variables: {
            id: itemId,
            input: { quantity }
          }
        })
        console.log('Successfully updated cart item in database:', itemId)
      } catch (error) {
        console.error('Error updating item quantity:', error)
        console.error('Error details:', error)
        console.error('This might be a temporary ID that doesn\'t exist in database')

        // If the item doesn't exist in database, it might be a sync issue
        console.log('Cart item not found in database - this could be a sync issue')
        console.log('Consider refreshing the page or clearing browser cache')

        toast.error('Failed to update item quantity')
        // Revert local state change
        dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity: oldQuantity } })
      }
    } else {
      // Update localStorage
      const updatedItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      saveToLocalStorage(updatedItems)
    }
  }

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
    localStorage.removeItem(CART_STORAGE_KEY)
    
    if (isAuthenticated && currentUser) {
      // Clear database cart items would require a separate mutation
      // For now, we'll handle this in the checkout process
    }
  }

  // Calculate cart totals
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const basePrice = (item.printableItem && typeof item.printableItem.price === 'number')
        ? item.printableItem.price
        : (item.product.salePrice || item.product.price)
      const printFee = item.printFee || 0
      return total + ((basePrice + printFee) * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartWeight = () => {
    return state.items.reduce((weight, item) => weight + (item.quantity * 1), 0) // Assuming 1 lb per item
  }

  const value = {
    items: state.items,
    loading: state.loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartWeight
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
