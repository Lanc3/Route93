import { render } from '@redwoodjs/testing/web'

import AdminCollectionsPage from './AdminCollectionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCollectionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCollectionsPage />)
    }).not.toThrow()
  })
})
