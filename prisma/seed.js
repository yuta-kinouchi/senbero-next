import { PrismaClient } from '@prisma/client'
import path from 'path'
import { seedRestaurantsFromCsv } from '../lib/seedRestaurants.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding process started')
  const filePath = path.join(process.cwd(), 'data', 'restaurants.csv')
  const result = await seedRestaurantsFromCsv(prisma, filePath)
  console.log(`Seeding completed: ${result.upserted}/${result.totalRestaurants} restaurants upserted, ${result.errors.length} errors`)
  if (result.errors.length > 0) {
    console.error(result.errors)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
