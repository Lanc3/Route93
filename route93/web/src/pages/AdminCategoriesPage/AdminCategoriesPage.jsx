import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminCategoriesCell from 'src/components/AdminCategoriesCell/AdminCategoriesCell'

const AdminCategoriesPage = () => {
  return (
    <>
      <Metadata title="Categories Management - Admin" description="Manage product categories" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                <p className="text-gray-600 mt-1">Organize your products with categories and subcategories</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.admin()}
                  className="btn-outline"
                >
                  ← Back to Dashboard
                </Link>
                <Link to={routes.adminCategoryAdd()} className="btn-primary">
                  + Add Category
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminCategoriesCell />
        </div>
      </div>
    </>
  )
}

export default AdminCategoriesPage