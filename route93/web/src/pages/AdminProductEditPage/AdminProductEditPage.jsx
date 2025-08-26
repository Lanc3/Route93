import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import EditProductCell from 'src/components/EditProductCell/EditProductCell'

const AdminProductEditPage = ({ id }) => {
  return (
    <>
      <Metadata title="Edit Product - Admin" description="Edit product information" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update product information</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.adminProducts()}
                  className="btn-outline"
                >
                  ← Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EditProductCell id={id} />
        </div>
      </div>
    </>
  )
}

export default AdminProductEditPage