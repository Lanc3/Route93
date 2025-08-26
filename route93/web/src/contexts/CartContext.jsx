import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from 'src/auth'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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
      product {
        id
        name
        price
        salePrice
        images
        inventory
      }
    }
  }
`

const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItemMutation($id: Int!, $input: UpdateCartItemInput!) {
    updateCartItem(id: $id, input: $input) {
      id
      quantity
      product {
        id
        name
        price
        salePrice
        images
        inventory
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
      product {
        id
        name
        price
        salePrice
        images
        inventory
      }
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
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
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

  // GraphQL mutations
  const [addToCartDB] = useMutation(ADD_TO_CART_MUTATION)
  const [updateCartItemDB] = useMutation(UPDATE_CART_ITEM_MUTATION)
  const [deleteCartItemDB] = useMutation(DELETE_CART_ITEM_MUTATION)
  const [syncCartDB] = useMutation(SYNC_CART_MUTATION)

  // Local storage key
  const CART_STORAGE_KEY = 'route93_cart'

  // Load cart from localStorage or database
  useEffect(() => {
    loadCart()
  }, [isAuthenticated, currentUser])

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
            quantity: item.quantity
          }))
          
          const { data } = await syncCartDB({ variables: { items: syncInput } })
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: data.syncCart })
          
          // Clear local storage after sync
          localStorage.removeItem(CART_STORAGE_KEY)
        } else {
          // Load existing cart from database
          // This would require a separate query to fetch user's cart items
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] })
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
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: localCart })
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
  const addItem = async (product, quantity = 1) => {
    if (quantity <= 0) return
    if (product.inventory < quantity) {
      toast.error('Not enough inventory available')
      return
    }

    const cartItem = {
      id: `temp-${Date.now()}`, // Temporary ID for local state
      product,
      quantity
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
              quantity
            }
          }
        })
        
        // Update with real ID from database
        dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: cartItem.id, quantity: 0 } })
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

    if (isAuthenticated && currentUser && typeof itemId === 'number') {
      // Update in database
      try {
        await updateCartItemDB({
          variables: {
            id: itemId,
            input: { quantity }
          }
        })
      } catch (error) {
        console.error('Error updating item quantity:', error)
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
      const price = item.product.salePrice || item.product.price
      return total + (price * item.quantity)
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
