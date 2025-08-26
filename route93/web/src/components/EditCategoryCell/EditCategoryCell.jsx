export const QUERY = gql`
  query EditCategoryQuery($id: Int!) {
    category(id: $id) {
      id
      name
      description
      slug
      parentId
      image
      createdAt
      updatedAt
      parent {
        id
        name
      }
      _count {
        products
      }
    }
  }
`

export const Loading = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
        📂
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Category not found</h3>
      <p className="text-gray-500 mb-4">
        The category you're looking for doesn't exist or may have been deleted.
      </p>
      <Link to={routes.adminCategories()} className="btn-primary">
        ← Back to Categories
      </Link>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="text-red-800">
        <h3 className="font-semibold">Error loading category</h3>
        <p className="text-sm mt-1">{error?.message}</p>
      </div>
    </div>
  </div>
)

export const Success = ({ category }) => {
  return <CategoryForm category={category} />
}

import { Link, routes } from '@redwoodjs/router'
import CategoryForm from 'src/components/CategoryForm/CategoryForm'