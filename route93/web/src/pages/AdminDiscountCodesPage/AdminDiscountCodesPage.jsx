import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminDiscountCodesCell from 'src/components/AdminDiscountCodesCell'

const AdminDiscountCodesPage = () => {
  return (
    <>
      <Metadata
        title="Discount Codes Management"
        description="Manage discount codes and promotions"
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
                <p className="mt-2 text-gray-600">
                  Create and manage discount codes for your store
                </p>
              </div>
              <Link
                to={routes.adminDiscountCodeAdd()}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Discount Code
              </Link>
            </div>
          </div>

          {/* Discount Codes List */}
          <div className="bg-white shadow-sm rounded-lg">
            <AdminDiscountCodesCell />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDiscountCodesPage
