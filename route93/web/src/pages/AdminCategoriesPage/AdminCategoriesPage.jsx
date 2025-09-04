import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminCategoriesCell from 'src/components/AdminCategoriesCell/AdminCategoriesCell'

const AdminCategoriesPage = () => {
  return (
    <>
      <Metadata title="Categories Management - Admin" description="Manage product categories" />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Organize your products with categories and subcategories</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={routes.adminCategoryAdd()} className="btn-primary">
            + Add Category
          </Link>
        </div>
      </div>

      {/* Content */}
      <AdminCategoriesCell />
    </>
  )
}

export default AdminCategoriesPage