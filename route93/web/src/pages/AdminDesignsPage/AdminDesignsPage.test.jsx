import { render } from '@redwoodjs/testing/web'

import AdminDesignsPage from './AdminDesignsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDesignsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDesignsPage />)
    }).not.toThrow()
  })
})
