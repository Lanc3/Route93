import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Metadata } from '@redwoodjs/web'
import CollectionForm from 'src/components/CollectionForm/CollectionForm'

const CREATE_COLLECTION = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      slug
    }
  }
`

const AdminCollectionAddPage = () => {
  const [createCollection, { loading, error }] = useMutation(CREATE_COLLECTION, {
    onCompleted: (data) => {
      toast.success(`Collection "${data.createCollection.name}" created successfully!`)
      navigate(routes.adminCollections())
    },
    onError: (error) => {
      toast.error('Error creating collection: ' + error.message)
    }
  })

  const onSave = (input) => {
    createCollection({ variables: { input } })
  }

  return (
    <>
      <Metadata title="Add Collection - Admin" description="Create a new product collection" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add Collection</h1>
                <p className="text-gray-600 mt-1">Create a new product collection</p>
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
          <CollectionForm
            onSave={onSave}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default AdminCollectionAddPage