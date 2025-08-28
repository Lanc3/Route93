import { render } from '@redwoodjs/testing/web'

import AddressesTab from './AddressesTab'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AddressesTab', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddressesTab />)
    }).not.toThrow()
  })
})
