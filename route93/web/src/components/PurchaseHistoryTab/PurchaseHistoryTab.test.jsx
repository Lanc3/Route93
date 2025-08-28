import { render } from '@redwoodjs/testing/web'

import PurchaseHistoryTab from './PurchaseHistoryTab'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PurchaseHistoryTab', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PurchaseHistoryTab />)
    }).not.toThrow()
  })
})
