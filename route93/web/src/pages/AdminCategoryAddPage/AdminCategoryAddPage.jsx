import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import CategoryForm from 'src/components/CategoryForm/CategoryForm'

const AdminCategoryAddPage = () => {
  return (
    <>
      <Metadata title="Add Category - Admin" description="Add a new product category" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
                <p className="text-gray-600 mt-1">Create a new category to organize your products</p>
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
          <CategoryForm />
        </div>
      </div>
    </>
  )
}

export default AdminCategoryAddPage