import { render } from '@redwoodjs/testing/web'

import AdminDesignEditPage from './AdminDesignEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDesignEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDesignEditPage />)
    }).not.toThrow()
  })
})
