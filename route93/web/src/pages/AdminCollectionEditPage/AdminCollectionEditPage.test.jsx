import { render } from '@redwoodjs/testing/web'

import AdminCollectionEditPage from './AdminCollectionEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCollectionEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCollectionEditPage id={42} />)
    }).not.toThrow()
  })
})
