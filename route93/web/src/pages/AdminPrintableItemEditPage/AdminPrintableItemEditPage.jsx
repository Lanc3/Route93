import { useState, useRef } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'
import gql from 'graphql-tag'

const GET_PRINTABLE_ITEM = gql`
  query GetPrintableItem($id: Int!) {
    printableItem(id: $id) {
      id
      name
      description
      price
      status
    }
  }
`

const UPDATE_PRINTABLE_ITEM_MUTATION = gql`
  mutation UpdatePrintableItemMutation($id: Int!, $input: UpdatePrintableItemInput!) {
    updatePrintableItem(id: $id, input: $input) {
      id
      name
      description
      price
      status
    }
  }
`

const AdminPrintableItemEditPage = ({ id }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'ACTIVE',
    file: null
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const { loading, error, data } = useQuery(GET_PRINTABLE_ITEM, {
    variables: { id: parseInt(id) },
    onCompleted: (data) => {
      if (data?.printableItem) {
        setFormData({
          name: data.printableItem.name,
          description: data.printableItem.description || '',
          price: data.printableItem.price.toString(),
          status: data.printableItem.status
        })
      }
    }
  })

  const [updatePrintableItem] = useMutation(UPDATE_PRINTABLE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success('Printable item updated successfully!')
      navigate(routes.adminPrintableItems())
    },
    onError: (error) => {
      toast.error(`Error updating printable item: ${error.message}`)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }))

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFile = () => {
    setFormData(prev => ({ ...prev, file: null }))
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For now, only update text fields. Image updates would require more complex logic
      // to handle Cloudinary image replacement and database updates
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        status: formData.status
      }

      await updatePrintableItem({
        variables: {
          id: parseInt(id),
          input: updateData
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
        <div className="text-red-600">Error loading printable item: {error.message}</div>
      </div>
    )
  }

  return (
    <>
      <Metadata
        title="Edit Printable Item - Admin"
        description="Edit an existing printable item for custom orders"
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Printable Item</h1>
                <p className="text-gray-600 mt-1">Update the details of this printable item</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.adminPrintableItems()}
                  className="btn-outline"
                >
                  ← Back to Printable Items
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
                <h2 className="text-lg font-medium text-gray-900 mb-4">Item Details</h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name *
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

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Base Price (€) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Customers will pay this amount plus €10 printing fee
                    </p>
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

                  {/* Current Image Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    {data?.printableItem?.imageUrl ? (
                      <div className="flex items-center space-x-4">
                        <img
                          src={previewUrl || data.printableItem.imageUrl}
                          alt={data.printableItem.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="text-sm text-gray-500">
                          <p>To change the image, you would need to upload a new one.</p>
                          <p className="text-xs mt-1">Image replacement functionality can be added later.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No image uploaded yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  to={routes.adminPrintableItems()}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Printable Item'}
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

export default AdminPrintableItemEditPage
