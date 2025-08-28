import { render } from '@redwoodjs/testing/web'

import AddressForm from './AddressForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AddressForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddressForm />)
    }).not.toThrow()
  })
})
