import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import EditCollectionCell from 'src/components/EditCollectionCell/EditCollectionCell'

const AdminCollectionEditPage = ({ id }) => {
  return (
    <>
      <Metadata title="Edit Collection - Admin" description="Edit product collection details" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Collection</h1>
                <p className="text-gray-600 mt-1">Update collection details and settings</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(routes.adminCollections())}
                  className="btn-outline"
                >
                  ← Back to Collections
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EditCollectionCell id={parseInt(id)} />
        </div>
      </div>
    </>
  )
}

export default AdminCollectionEditPage