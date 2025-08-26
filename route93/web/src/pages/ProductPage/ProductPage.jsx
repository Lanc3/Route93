import { Metadata } from '@redwoodjs/web'
import ProductCell from 'src/components/ProductCell'

const ProductPage = ({ id }) => {
  return (
    <>
      <Metadata 
        title="Product Details - Route93" 
        description="View detailed product information, specifications, and customer reviews. Add to cart and enjoy free shipping on orders over $50."
      />
      <ProductCell id={id} />
    </>
  )
}

export default ProductPage
