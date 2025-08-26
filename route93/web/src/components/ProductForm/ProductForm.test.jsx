import { render } from '@redwoodjs/testing/web'

import ProductForm from './ProductForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductForm />)
    }).not.toThrow()
  })
})
