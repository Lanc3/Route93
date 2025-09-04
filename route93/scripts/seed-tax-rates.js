import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function seedTaxRates() {
  try {
    console.log('🏦 Seeding Irish VAT rates...')

    // Create Irish VAT rates
    const taxRates = [
      {
        name: 'Standard Rate',
        rate: 23.0,
        description: 'Standard VAT rate for most goods and services in Ireland',
        country: 'IE',
        isActive: true
      },
      {
        name: 'Reduced Rate',
        rate: 13.5,
        description: 'Reduced VAT rate for fuel, electricity, newspapers, construction services',
        country: 'IE',
        isActive: true
      },
      {
        name: 'Second Reduced Rate',
        rate: 9.0,
        description: 'Second reduced VAT rate for hospitality, tourism, hairdressing',
        country: 'IE',
        isActive: true
      },
      {
        name: 'Zero Rate',
        rate: 0.0,
        description: 'Zero VAT rate for books, children\'s clothing, food, medical equipment',
        country: 'IE',
        isActive: true
      },
      {
        name: 'Exempt',
        rate: 0.0,
        description: 'Exempt from VAT - financial services, insurance, education',
        country: 'IE',
        isActive: true
      }
    ]

    for (const rateData of taxRates) {
      const existingRate = await db.taxRate.findFirst({
        where: { 
          name: rateData.name,
          country: rateData.country
        }
      })

      if (!existingRate) {
        await db.taxRate.create({
          data: rateData
        })
        console.log(`✅ Created tax rate: ${rateData.name} (${rateData.rate}%)`)
      } else {
        console.log(`⏭️  Tax rate already exists: ${rateData.name}`)
      }
    }

    // Update some categories with appropriate VAT rates
    console.log('🏷️  Updating category VAT rates...')
    
    // Find categories and set appropriate VAT rates
    const categories = await db.category.findMany()
    
    for (const category of categories) {
      let vatRate = 23.0 // Default standard rate
      
      // Set reduced rates for specific categories
      if (category.name.toLowerCase().includes('book') || 
          category.name.toLowerCase().includes('food') ||
          category.name.toLowerCase().includes('children')) {
        vatRate = 0.0 // Zero rate
      } else if (category.name.toLowerCase().includes('fuel') ||
                 category.name.toLowerCase().includes('electric')) {
        vatRate = 13.5 // Reduced rate
      }
      
      await db.category.update({
        where: { id: category.id },
        data: { vatRate }
      })
      
      console.log(`✅ Updated category "${category.name}" with VAT rate: ${vatRate}%`)
    }

    console.log('✅ Tax rates seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding tax rates:', error)
    throw error
  }
}

export default async function main() {
  try {
    await seedTaxRates()
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}
