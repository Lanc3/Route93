import { render } from '@redwoodjs/testing/web'

import UserSettingsTab from './UserSettingsTab'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserSettingsTab', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserSettingsTab />)
    }).not.toThrow()
  })
})
