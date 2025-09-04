import { render } from '@redwoodjs/testing/web'

import AdminTaxManagementPage from './AdminTaxManagementPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminTaxManagementPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminTaxManagementPage />)
    }).not.toThrow()
  })
})
