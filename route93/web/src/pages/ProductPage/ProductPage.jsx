import { Metadata } from '@redwoodjs/web'
import ProductCell from 'src/components/ProductCell'

const ProductPage = ({ slug }) => {
  return (
    <>
      <Metadata 
        title="Product Details - Route93" 
        description="View detailed product information, specifications, and customer reviews. Add to cart and enjoy free shipping on orders over $50."
      />
      <ProductCell slug={slug} />
    </>
  )
}

export default ProductPage
