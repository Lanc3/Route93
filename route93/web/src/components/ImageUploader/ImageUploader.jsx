import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: String!, $folder: String, $altText: String, $tags: [String!]) {
    uploadImage(file: $file, folder: $folder, altText: $altText, tags: $tags) {
      id
      publicId
      url
      secureUrl
      format
      width
      height
      bytes
      originalName
      altText
      tags
    }
  }
`

const ImageUploader = ({ 
  onUpload, 
  folder = 'products', 
  multiple = true,
  maxFiles = 10,
  className = '',
  tags: customTags = null,
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])

  const [uploadImage] = useMutation(UPLOAD_IMAGE, {
    onCompleted: (data) => {
      const newImage = data.uploadImage
      setUploadedImages(prev => [...prev, newImage])
      onUpload?.(newImage)
      toast.success(`Image "${newImage.originalName}" uploaded successfully!`)
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`)
      setUploading(false)
    }
  })

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    
    try {
      for (const file of acceptedFiles) {
        const base64File = await fileToBase64(file)
        await uploadImage({
          variables: { 
            file: base64File, 
            folder,
            altText: file.name.split('.')[0],
            tags: customTags && Array.isArray(customTags) && customTags.length > 0 ? customTags : [folder, 'product']
          }
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }, [uploadImage, folder, maxFiles, uploadedImages.length])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple,
    maxFiles
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-purple-500 bg-purple-50' 
            : uploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        <div className="space-y-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          {uploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading images...</span>
              </div>
              <p className="text-xs text-gray-500">Please wait while we optimize your images</p>
            </div>
          ) : isDragActive ? (
            <p className="text-purple-600 font-medium">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600">
                <span className="font-medium text-purple-600 hover:text-purple-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB each</p>
              <p className="text-xs text-gray-400">Maximum {maxFiles} images</p>
            </div>
          )}
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload Errors:</h4>
          <ul className="text-sm text-red-600 space-y-1">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.path}>
                <strong>{file.path}</strong>: {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Uploaded Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.secureUrl}
                  alt={image.altText || image.originalName}
                  className="w-full h-20 object-cover rounded border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 text-center px-1">
                    {image.originalName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
