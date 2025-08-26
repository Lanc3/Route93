import { render } from '@redwoodjs/testing/web'

import AdminAnalyticsPage from './AdminAnalyticsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminAnalyticsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminAnalyticsPage />)
    }).not.toThrow()
  })
})
