import { Metadata } from '@redwoodjs/web'
import OrderConfirmationCell from 'src/components/OrderConfirmationCell'

const OrderConfirmationPage = ({ id }) => {
  return (
    <>
      <Metadata
        title="Order Confirmation - Route93"
        description="Your order has been confirmed! View your order details and track your purchase."
      />

      <OrderConfirmationCell id={parseInt(id)} />
    </>
  )
}

export default OrderConfirmationPage
