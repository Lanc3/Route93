import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const TAX_SUMMARY_QUERY = gql`
  query TaxSummaryQuery($input: TaxReportInput!) {
    taxSummary(input: $input) {
      period
      totalOrders
      totalSales
      totalVatCollected
      standardVatSales
      standardVatAmount
      reducedVatSales
      reducedVatAmount
      secondReducedVatSales
      secondReducedVatAmount
      zeroVatSales
      exemptSales
      euB2BSales
      euB2CSales
    }
    vatBreakdown(input: $input) {
      rate
      rateName
      salesAmount
      vatAmount
      orderCount
    }
  }
`

const RECALCULATE_TAX_RECORDS = gql`
  mutation RecalculateTaxRecords {
    recalculateAllTaxRecords
  }
`

const AdminTaxManagementPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  
  // Calculate date range based on selected period
  const getDateRange = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    switch (selectedPeriod) {
      case 'current-month':
        return {
          startDate: new Date(currentYear, currentMonth, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString(),
          period: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`
        }
      case 'previous-month':
        return {
          startDate: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString(),
          period: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
        }
      case 'current-quarter':
        const quarterStart = Math.floor(currentMonth / 3) * 3
        return {
          startDate: new Date(currentYear, quarterStart, 1).toISOString(),
          endDate: new Date(currentYear, quarterStart + 3, 0, 23, 59, 59).toISOString(),
          period: `${currentYear}-Q${Math.floor(currentMonth / 3) + 1}`
        }
      default:
        return {
          startDate: new Date(currentYear, currentMonth, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString(),
          period: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`
        }
    }
  }

  const dateRange = getDateRange()
  
  const { data: taxData, loading: taxLoading, refetch: refetchTaxData } = useQuery(TAX_SUMMARY_QUERY, {
    variables: { input: dateRange }
  })
  
  const [recalculateTaxRecords, { loading: recalculating }] = useMutation(RECALCULATE_TAX_RECORDS, {
    onCompleted: (data) => {
      toast.success(`Recalculated tax records for ${data.recalculateAllTaxRecords} orders`)
      refetchTaxData()
    },
    onError: (error) => {
      toast.error(`Failed to recalculate tax records: ${error.message}`)
    }
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }

  return (
    <>
      <Metadata title="Tax Management - Admin" description="Irish VAT and tax obligations management" />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Management</h1>
          <p className="text-gray-600 mt-1">Irish VAT obligations and tax reporting</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => recalculateTaxRecords()}
            disabled={recalculating}
            className="btn-outline"
          >
            {recalculating ? 'Recalculating...' : 'Recalculate Tax Records'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tax Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Period Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reporting Period</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                { value: 'current-month', label: 'Current Month' },
                { value: 'previous-month', label: 'Previous Month' },
                { value: 'current-quarter', label: 'Current Quarter' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    selectedPeriod === option.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tax Summary Cards */}
          {taxLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : taxData?.taxSummary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(taxData.taxSummary.totalSales)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">VAT Collected</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(taxData.taxSummary.totalVatCollected)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {taxData.taxSummary.totalOrders}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VAT Breakdown Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">VAT Breakdown by Rate</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          VAT Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          VAT Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxData.vatBreakdown?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.rateName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.salesAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.vatAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.orderCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center">No tax data available for the selected period</p>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-outline text-left">
                Export VAT Return (CSV)
              </button>
              <button className="w-full btn-outline text-left">
                Export Tax Records (PDF)
              </button>
              <Link to={routes.adminCategories()} className="w-full btn-outline text-left block text-center">
                Manage VAT Rates by Category
              </Link>
            </div>
          </div>

          {/* Irish Tax Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Irish VAT Rates</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Standard Rate:</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reduced Rate:</span>
                <span className="font-medium">13.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Second Reduced:</span>
                <span className="font-medium">9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zero Rate:</span>
                <span className="font-medium">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminTaxManagementPage