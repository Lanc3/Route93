import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import EditCategoryCell from 'src/components/EditCategoryCell/EditCategoryCell'

const AdminCategoryEditPage = ({ id }) => {
  return (
    <>
      <Metadata title="Edit Category - Admin" description="Edit category information" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
                <p className="text-gray-600 mt-1">Update category information</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.adminCategories()}
                  className="btn-outline"
                >
                  ← Back to Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EditCategoryCell id={id} />
        </div>
      </div>
    </>
  )
}

export default AdminCategoryEditPage