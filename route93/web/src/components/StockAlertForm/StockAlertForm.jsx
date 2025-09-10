import { useState } from 'react'
import { useMutation } from '@redwoodjs/web'

const SUBSCRIBE = gql`
  mutation SubscribeStock($input: CreateStockAlertInput!) {
    createStockAlert(input: $input) { id }
  }
`

const StockAlertForm = ({ productId, variantId = null }) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [create, { loading }] = useMutation(SUBSCRIBE)

  const onSubmit = async (e) => {
    e.preventDefault()
    const channel = phone ? 'SMS' : 'EMAIL'
    await create({ variables: { input: { productId, variantId, channel, email: channel === 'EMAIL' ? email : null, phone: channel === 'SMS' ? phone : null } } })
    setEmail('')
    setPhone('')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <span className="text-gray-500">or</span>
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
      </div>
      <button disabled={loading} className="btn-outline w-full">Notify me when available</button>
    </form>
  )
}

export default StockAlertForm


