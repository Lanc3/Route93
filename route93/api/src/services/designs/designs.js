import { db } from 'src/lib/db'
import { uploadToCloudinary } from 'src/lib/cloudinary'
import { logger } from 'src/lib/logger'

export const designs = ({ search, status, limit, offset }) => {
  const where = {}

  // Add status filter if provided
  if (status) {
    where.status = status
  }

  // Add search filter if provided (searches in name and description)
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  return db.design.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit || 20,
    skip: offset || 0
  })
}

export const design = ({ id }) => {
  return db.design.findUnique({
    where: { id },
  })
}

export const designsByStatus = ({ status }) => {
  return db.design.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' }
  })
}

export const createDesign = ({ input }) => {
  return db.design.create({
    data: input,
  })
}

export const updateDesign = ({ id, input }) => {
  return db.design.update({
    data: input,
    where: { id },
  })
}

export const deleteDesign = ({ id }) => {
  return db.design.delete({
    where: { id },
  })
}

export const updateDesignStatus = ({ id, status }) => {
  return db.design.update({
    data: { status },
    where: { id },
  })
}

export const uploadDesignImage = async ({ name, description, file, status = 'ACTIVE' }) => {
  try {
    // Convert base64 file to buffer
    let fileBuffer
    if (typeof file === 'string' && file.startsWith('data:')) {
      const base64Data = file.split(',')[1]
      fileBuffer = Buffer.from(base64Data, 'base64')
    } else {
      throw new Error('Invalid file format. Please provide a base64 data URL.')
    }

    // Upload to Cloudinary with designs folder
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
      folder: 'route93/designs',
      width: 800,
      height: 800,
      quality: 'auto',
      format: 'auto'
    })

    // Save to database
    const design = await db.design.create({
      data: {
        name: name || 'Unnamed Design',
        description: description || '',
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        status: status,
      }
    })

    logger.info(`Design uploaded successfully: ${design.name}`)
    return design

  } catch (error) {
    logger.error('Design upload failed:', error)
    throw new Error(`Failed to upload design: ${error.message}`)
  }
}
