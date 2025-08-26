import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

const GET_PARENT_CATEGORIES = gql`
  query GetParentCategories {
    categories {
      id
      name
    }
  }
`

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
    }
  }
`

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`

const CategoryForm = ({ category = null, onSave, onCancel }) => {
  const isEditing = !!category
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    image: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load parent categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_PARENT_CATEGORIES)

  // GraphQL mutations
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: (data) => {
      toast.success('Category created successfully!')
      if (onSave) onSave(data.createCategory)
      else navigate(routes.adminCategories())
    },
    onError: (error) => {
      toast.error('Error creating category: ' + error.message)
      setIsSubmitting(false)
    }
  })

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: (data) => {
      toast.success('Category updated successfully!')
      if (onSave) onSave(data.updateCategory)
      else navigate(routes.adminCategories())
    },
    onError: (error) => {
      toast.error('Error updating category: ' + error.message)
      setIsSubmitting(false)
    }
  })

  // Initialize form data when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        slug: category.slug || '',
        parentId: category.parentId?.toString() || '',
        image: category.image || '',
      })
    }
  }, [category])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }

    // Auto-generate slug from name
    if (name === 'name' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    
    // Validate slug format
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    // Prevent circular parent reference
    if (isEditing && formData.parentId && parseInt(formData.parentId) === category.id) {
      newErrors.parentId = 'Category cannot be its own parent'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    const input = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      slug: formData.slug.trim(),
      parentId: formData.parentId ? parseInt(formData.parentId) : null,
      image: formData.image.trim() || null,
    }

    try {
      if (isEditing) {
        await updateCategory({ variables: { id: category.id, input } })
      } else {
        await createCategory({ variables: { input } })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(routes.adminCategories())
    }
  }

  // Filter out current category from parent options to prevent circular reference
  const availableParentCategories = categoriesData?.categories?.filter(cat => 
    !isEditing || cat.id !== category?.id
  ) || []

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update category information' : 'Create a new category to organize your products'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="category-url-slug"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            <p className="text-gray-500 text-sm mt-1">
              This will be used in the category URL. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter category description"
          />
        </div>

        {/* Parent Category and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.parentId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={categoriesLoading}
            >
              <option value="">No parent (root category)</option>
              {availableParentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
            <p className="text-gray-500 text-sm mt-1">
              Select a parent category to create a subcategory, or leave empty for a root category.
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Category Image (URL)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/category-image.jpg"
            />
            <p className="text-gray-500 text-sm mt-1">
              Enter an image URL for the category, or leave empty for default placeholder.
            </p>
          </div>
        </div>

        {/* Preview */}
        {(formData.name || formData.image) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-16 w-16">
                <img
                  className="h-16 w-16 rounded-lg object-cover bg-gray-100"
                  src={formData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMxNy45IDIwIDEgMjguNyAxIDQwUzE3LjkgNjAgMzIgNjAgNjMgNTEuMyA2MyA0MCA0NS4xIDIwIDMyIDIwWk0zMiA1NkMxNy45IDU2IDEgNDguMyAxIDQwUzE3LjkgMjQgMzIgMjQgNjMgMzEuNyA2MyA0MCA0NS4xIDU2IDMyIDU2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
                  alt={formData.name || 'Category preview'}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMxNy45IDIwIDEgMjguNyAxIDQwUzE3LjkgNjAgMzIgNjAgNjMgNTEuMyA2MyA0MCA0NS4xIDIwIDMyIDIwWk0zMiA1NkMxNy45IDU2IDEgNDguMyAxIDQwUzE3LjkgMjQgMzIgMjQgNjMgMzEuNyA2MyA0MCA0NS4xIDU2IDMyIDU2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                  }}
                />
              </div>
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {formData.name || 'Category Name'}
                </div>
                <div className="text-sm text-gray-500">
                  /{formData.slug || 'category-slug'}
                </div>
                {formData.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {formData.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm