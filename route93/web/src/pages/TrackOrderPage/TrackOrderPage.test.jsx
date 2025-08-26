import { render } from '@redwoodjs/testing/web'

import TrackOrderPage from './TrackOrderPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TrackOrderPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TrackOrderPage />)
    }).not.toThrow()
  })
})
