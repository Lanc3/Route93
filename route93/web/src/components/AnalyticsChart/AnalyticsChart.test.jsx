import { render } from '@redwoodjs/testing/web'

import AnalyticsChart from './AnalyticsChart'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnalyticsChart', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnalyticsChart />)
    }).not.toThrow()
  })
})
