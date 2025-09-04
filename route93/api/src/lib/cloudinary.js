import { v2 as cloudinary } from 'cloudinary'
import { logger } from './logger'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Upload image to Cloudinary with automatic optimization
 */
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    const {
      folder = 'route93/products',
      width = 1200,
      height = 1200,
      quality = 'auto',
      format = 'auto',
      crop = 'limit'
    } = options

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width, height, crop, quality },
            { format }
          ],
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(fileBuffer)
    })

    return result
  } catch (error) {
    logger.error('Failed to upload to Cloudinary:', error)
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    logger.info(`Deleted image from Cloudinary: ${publicId}`)
    return result
  } catch (error) {
    logger.error('Failed to delete from Cloudinary:', error)
    throw new Error(`Image deletion failed: ${error.message}`)
  }
}

/**
 * Generate optimized image URL with transformations
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, quality },
      { format }
    ],
    secure: true
  })
}

export default cloudinary
