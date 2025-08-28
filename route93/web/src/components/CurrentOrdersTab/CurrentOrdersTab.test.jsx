import { render } from '@redwoodjs/testing/web'

import CurrentOrdersTab from './CurrentOrdersTab'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CurrentOrdersTab', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CurrentOrdersTab />)
    }).not.toThrow()
  })
})
