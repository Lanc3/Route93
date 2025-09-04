import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { uploadToCloudinary, deleteFromCloudinary } from 'src/lib/cloudinary'
import { logger } from 'src/lib/logger'

export const uploadImage = async ({ file, folder = 'products', altText = '', tags = [] }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    // Convert base64 file to buffer
    let fileBuffer
    if (typeof file === 'string' && file.startsWith('data:')) {
      const base64Data = file.split(',')[1]
      fileBuffer = Buffer.from(base64Data, 'base64')
    } else {
      throw new Error('Invalid file format. Please provide a base64 data URL.')
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
      folder: `route93/${folder}`,
      width: 1200,
      height: 1200,
      quality: 'auto',
      format: 'auto'
    })

    // Save to database
    const mediaAsset = await db.mediaAsset.create({
      data: {
        publicId: cloudinaryResult.public_id,
        url: cloudinaryResult.url,
        secureUrl: cloudinaryResult.secure_url,
        format: cloudinaryResult.format,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        bytes: cloudinaryResult.bytes,
        originalName: cloudinaryResult.original_filename || 'uploaded_image',
        altText: altText || '',
        tags: JSON.stringify(tags),
        folder: folder,
        uploadedBy: context.currentUser.id,
      }
    })

    logger.info(`Image uploaded successfully: ${mediaAsset.publicId}`)
    return mediaAsset

  } catch (error) {
    logger.error('Image upload failed:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

export const deleteImage = async ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const mediaAsset = await db.mediaAsset.findUnique({
      where: { id }
    })

    if (!mediaAsset) {
      throw new Error('Image not found')
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(mediaAsset.publicId)

    // Delete from database
    const deletedAsset = await db.mediaAsset.delete({
      where: { id }
    })

    logger.info(`Image deleted successfully: ${deletedAsset.publicId}`)
    return deletedAsset

  } catch (error) {
    logger.error('Image deletion failed:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

export const getMediaAssets = async ({ folder = null, limit = 50, offset = 0 }) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = folder ? { folder } : {}

  return db.mediaAsset.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })
}

export const updateImageMetadata = async ({ id, altText, tags }) => {
  requireAuth({ roles: ['ADMIN'] })

  return db.mediaAsset.update({
    where: { id },
    data: {
      altText: altText || '',
      tags: tags ? JSON.stringify(tags) : null,
    }
  })
}
