import { useState } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'
import gql from 'graphql-tag'

const GET_DESIGN = gql`
  query GetDesign($id: Int!) {
    design(id: $id) {
      id
      name
      description
      imageUrl
      publicId
      status
    }
  }
`

const UPDATE_DESIGN_MUTATION = gql`
  mutation UpdateDesignMutation($id: Int!, $input: UpdateDesignInput!) {
    updateDesign(id: $id, input: $input) {
      id
      name
      description
      status
    }
  }
`

const AdminDesignEditPage = ({ id }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loading, error, data } = useQuery(GET_DESIGN, {
    variables: { id: parseInt(id) },
    onCompleted: (data) => {
      if (data?.design) {
        setFormData({
          name: data.design.name,
          description: data.design.description || '',
          status: data.design.status
        })
      }
    }
  })

  const [updateDesign] = useMutation(UPDATE_DESIGN_MUTATION, {
    onCompleted: () => {
      toast.success('Design updated successfully!')
      navigate(routes.adminDesigns())
    },
    onError: (error) => {
      toast.error(`Error updating design: ${error.message}`)
      setIsSubmitting(false)
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateDesign({
        variables: {
          id: parseInt(id),
          input: formData
        }
      })
    } catch (error) {
      console.error('Form submission error:', error)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading design: {error.message}</div>
      </div>
    )
  }

  return (
    <>
      <Metadata
        title="Edit Design - Admin"
        description="Edit an existing design for custom prints"
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Design</h1>
                <p className="text-gray-600 mt-1">Update the details of this design</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.adminDesigns()}
                  className="btn-outline"
                >
                  ← Back to Designs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Design Details</h2>

                {/* Current Image Preview */}
                {data?.design?.imageUrl && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <img
                      src={data.design.imageUrl}
                      alt={data.design.name}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Design Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  to={routes.adminDesigns()}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
    </>
  )
}

export default AdminDesignEditPage
