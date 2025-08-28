import { render } from '@redwoodjs/testing/web'

import AnalyticsKpi from './AnalyticsKpi'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnalyticsKpi', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnalyticsKpi />)
    }).not.toThrow()
  })
})
