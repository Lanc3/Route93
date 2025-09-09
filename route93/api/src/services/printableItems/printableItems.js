import { db } from 'src/lib/db'
import { uploadToCloudinary } from 'src/lib/cloudinary'
import { logger } from 'src/lib/logger'

export const printableItems = ({ search, status, limit, offset }) => {
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

  return db.printableItem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit || 20,
    skip: offset || 0
  })
}

export const printableItem = ({ id }) => {
  return db.printableItem.findUnique({
    where: { id },
  })
}

export const printableItemsByStatus = ({ status }) => {
  return db.printableItem.findMany({
    where: { status },
  })
}

export const createPrintableItem = ({ input }) => {
  return db.printableItem.create({
    data: input,
  })
}

export const updatePrintableItem = ({ id, input }) => {
  return db.printableItem.update({
    data: input,
    where: { id },
  })
}

export const deletePrintableItem = ({ id }) => {
  return db.printableItem.delete({
    where: { id },
  })
}

export const uploadPrintableItemImage = async ({ name, description, price, file, status = 'ACTIVE' }) => {
  try {
    // Convert base64 file to buffer
    let fileBuffer
    if (typeof file === 'string' && file.startsWith('data:')) {
      const base64Data = file.split(',')[1]
      fileBuffer = Buffer.from(base64Data, 'base64')
    } else {
      throw new Error('Invalid file format. Please provide a base64 data URL.')
    }

    // Upload to Cloudinary with printItem folder
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
      folder: 'route93/printItem',
      width: 800,
      height: 800,
      quality: 'auto',
      format: 'auto'
    })

    // Save to database
    const printableItem = await db.printableItem.create({
      data: {
        name: name,
        description: description || '',
        price: price,
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        status: status,
      }
    })

    logger.info(`Printable item created successfully: ${printableItem.name}`)
    return printableItem

  } catch (error) {
    logger.error('Printable item upload failed:', error)
    throw new Error(`Failed to create printable item: ${error.message}`)
  }
}

export const updatePrintableItemStatus = ({ id, status }) => {
  return db.printableItem.update({
    data: { status },
    where: { id },
  })
}
