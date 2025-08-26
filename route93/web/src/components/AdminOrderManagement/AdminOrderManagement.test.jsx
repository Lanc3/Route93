import { render } from '@redwoodjs/testing/web'

import AdminOrderManagement from './AdminOrderManagement'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AdminOrderManagement', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminOrderManagement />)
    }).not.toThrow()
  })
})
