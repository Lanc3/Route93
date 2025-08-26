import { useState, useEffect } from 'react'
import {
  Form,
  TextField,
  TextAreaField,
  CheckboxField,
  Submit,
  FieldError,
  FormError,
} from '@redwoodjs/forms'

const CollectionForm = ({ collection, onSave, error, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
  })

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSlugChange = (e) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData({
      ...formData,
      slug,
    })
  }

  // Initialize form data when collection prop changes
  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
        slug: collection.slug || '',
        image: collection.image || '',
        isActive: collection.isActive !== undefined ? collection.isActive : true,
      })
    }
  }, [collection])

  const onSubmit = (data) => {
    // Merge form data with any auto-generated values
    const submitData = {
      ...data,
      slug: formData.slug || generateSlug(data.name),
      isActive: data.isActive !== undefined ? data.isActive : true,
    }
    onSave(submitData)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {collection ? 'Edit Collection' : 'Create New Collection'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {collection 
            ? 'Update collection details and settings' 
            : 'Create a new product collection to organize your products'
          }
        </p>
      </div>

      <div className="p-6">
        <Form onSubmit={onSubmit} error={error}>
          <FormError
            error={error}
            wrapperClassName="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            titleClassName="text-red-800 font-semibold"
            listClassName="text-red-700 text-sm mt-2 list-disc list-inside"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Collection Name */}
              <div>
                <TextField
                  name="name"
                  defaultValue={formData.name}
                  onChange={handleNameChange}
                  validation={{ required: 'Collection name is required' }}
                  placeholder="Enter collection name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <FieldError name="name" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Slug */}
              <div>
                <TextField
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  validation={{ 
                    required: 'URL slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
                    }
                  }}
                  placeholder="collection-url-slug"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in the URL: /collections/{formData.slug || 'collection-slug'}
                </p>
                <FieldError name="slug" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Image URL */}
              <div>
                <TextField
                  name="image"
                  defaultValue={formData.image}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Image URL
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Add an image URL for the collection banner
                </p>
                <FieldError name="image" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center">
                  <CheckboxField
                    name="isActive"
                    defaultChecked={formData.isActive}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Active Collection
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive collections won't be displayed on the website
                </p>
                <FieldError name="isActive" className="text-red-600 text-sm mt-1" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <TextAreaField
                  name="description"
                  defaultValue={formData.description}
                  rows={6}
                  placeholder="Describe this collection and what makes it special..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Describe the collection for customers
                </p>
                <FieldError name="description" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img
                      src={formData.image}
                      alt="Collection preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <div 
                      className="hidden w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                    >
                      Invalid image URL
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Collection Tips
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Choose a descriptive name that customers will understand</li>
                        <li>Keep the URL slug short and SEO-friendly</li>
                        <li>Add a compelling description to help customers</li>
                        <li>Use high-quality images that represent the collection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <Submit
              disabled={loading}
              className="btn-primary min-w-[120px] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                collection ? 'Update Collection' : 'Create Collection'
              )}
            </Submit>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CollectionForm