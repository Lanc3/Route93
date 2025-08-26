import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import CollectionForm from 'src/components/CollectionForm/CollectionForm'

const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: Int!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`

export const QUERY = gql`
  query FindCollectionById($id: Int!) {
    collection(id: $id) {
      id
      name
      description
      slug
      image
      isActive
      createdAt
      updatedAt
      _count {
        products
      }
    }
  }
`

export const Loading = () => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Collection Not Found</h3>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
          📚
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Collection not found</h3>
        <p className="text-gray-500 mb-4">
          The collection you're looking for doesn't exist or may have been deleted.
        </p>
        <button
          onClick={() => navigate(routes.adminCollections())}
          className="btn-primary"
        >
          ← Back to Collections
        </button>
      </div>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Error Loading Collection</h3>
    </div>
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-semibold">Failed to load collection</h3>
          <p className="text-sm mt-1">{error?.message}</p>
        </div>
        <button
          onClick={() => navigate(routes.adminCollections())}
          className="mt-4 btn-outline"
        >
          ← Back to Collections
        </button>
      </div>
    </div>
  </div>
)

export const Success = ({ collection }) => {
  const [updateCollection, { loading, error }] = useMutation(UPDATE_COLLECTION, {
    onCompleted: (data) => {
      toast.success(`Collection "${data.updateCollection.name}" updated successfully!`)
      navigate(routes.adminCollections())
    },
    onError: (error) => {
      toast.error('Error updating collection: ' + error.message)
    }
  })

  const onSave = (input) => {
    updateCollection({ variables: { id: collection.id, input } })
  }

  return (
    <CollectionForm
      collection={collection}
      onSave={onSave}
      error={error}
      loading={loading}
    />
  )
}