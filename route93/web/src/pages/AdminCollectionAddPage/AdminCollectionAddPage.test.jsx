import { render } from '@redwoodjs/testing/web'

import AdminCollectionAddPage from './AdminCollectionAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCollectionAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCollectionAddPage />)
    }).not.toThrow()
  })
})
