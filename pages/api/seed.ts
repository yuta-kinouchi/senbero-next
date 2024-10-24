import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function isValidDate(dateString: string): boolean {
  return !isNaN(Date.parse(dateString))
}

function getCurrentDateTime(): Date {
  return new Date()
}

function formatDateTime(timeString: string): Date | string {
  const defaultDate = '1970-01-01';
  const dateTimeString = `${defaultDate}T${timeString}.000Z`;

  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    return ""; // Return an empty string instead of null
  }

  return date;
}

function processBooleanAsInteger(value: string | undefined | null): number {
  if (value === null || value === undefined) return 0
  return value.toLowerCase() === 'true' || value === '1' ? 1 : 0
}

function parseDayOfWeek(day: string): number {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  const index = days.indexOf(day)
  return index !== -1 ? index : parseInt(day, 10)
}

async function main() {
  console.log("Seeding process started")

  const filePath = path.join(process.cwd(), 'data', 'restaurants.csv')

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const results: any[] = []
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve())
      .on('error', (error) => {
        console.error('Error reading CSV:', error)
        reject(error)
      })
  })

  console.log(`CSV parsing completed. ${results.length} rows found.`)

  for (const row of results) {
    const currentDateTime = getCurrentDateTime()

    await prisma.$transaction(async (prisma) => {
      let restaurantId = parseInt(row.restaurant_id)
      let restaurantExists = false

      if (!isNaN(restaurantId)) {
        const existingRestaurant = await prisma.restaurant.findUnique({
          where: { restaurant_id: restaurantId },
          select: { restaurant_id: true }
        })

        if (existingRestaurant) {
          restaurantExists = true
          console.log(`Restaurant ID ${restaurantId} already exists.`)
        }
      }

      if (!restaurantExists) {
        try {
          const restaurant = await prisma.restaurant.create({
            data: {
              restaurant_id: isNaN(restaurantId) ? undefined : restaurantId,
              name: row.name || undefined,
              phone_number: row.phone_number || undefined,
              country: row.country || undefined,
              state: row.state || undefined,
              city: row.city || undefined,
              address_line1: row.address_line1 || undefined,
              address_line2: row.address_line2 || undefined,
              latitude: row.latitude ? parseFloat(row.latitude) : 0, // Default to 0 if undefined
              longitude: row.longitude ? parseFloat(row.longitude) : 0, // Default to 0 if undefined
              capacity: row.capacity ? parseInt(row.capacity) : 0, // Default to 0 if undefined
              home_page: row.home_page || undefined,
              description: row.description || undefined,
              special_rule: row.special_rule || undefined,
              morning_available: !!processBooleanAsInteger(row.morning_available),
              daytime_available: !!processBooleanAsInteger(row.daytime_available),
              has_set: !!processBooleanAsInteger(row.has_set),
              senbero_description: row.senbero_description || undefined,
              has_chinchiro: !!processBooleanAsInteger(row.has_chinchiro),
              chinchiro_description: row.chinchiro_description || undefined,
              outside_available: !!processBooleanAsInteger(row.outside_available),
              outside_description: row.outside_description || undefined,
              is_standing: !!processBooleanAsInteger(row.is_standing),
              standing_description: row.standing_description || undefined,
              is_kakuuchi: !!processBooleanAsInteger(row.is_kakuuchi),
              is_cash_on: !!processBooleanAsInteger(row.is_cash_on),
              has_charge: !!processBooleanAsInteger(row.has_charge),
              charge_description: row.charge_description || undefined,
              has_tv: !!processBooleanAsInteger(row.has_tv),
              smoking_allowed: !!processBooleanAsInteger(row.smoking_allowed),
              has_happy_hour: !!processBooleanAsInteger(row.has_happy_hour),
              created_at: isValidDate(row.created_at) ? new Date(row.created_at) : currentDateTime,
              updated_at: isValidDate(row.updated_at) ? new Date(row.updated_at) : currentDateTime
            }
          })

          restaurantId = restaurant.restaurant_id
          console.log(`Inserted restaurant: ${restaurant.name} (ID: ${restaurantId})`)
        } catch (dbError) {
          console.error(`Database error inserting restaurant ${row.name}:`, dbError)
          throw dbError // トランザクションをロールバックするためにエラーを投げる
        }
      }

      if (row.day_of_week && restaurantId) {
        try {
          await prisma.operatingHour.create({
            data: {
              restaurant_id: restaurantId,
              day_of_week: parseDayOfWeek(row.day_of_week),
              open_time: formatDateTime(row.open_time),
              close_time: formatDateTime(row.close_time),
              drink_last_order_time: formatDateTime(row.drink_last_order_time) || null,
              food_last_order_time: formatDateTime(row.food_last_order_time) || null,
              created_at: isValidDate(row.created_at) ? new Date(row.created_at) : currentDateTime,
              updated_at: isValidDate(row.updated_at) ? new Date(row.updated_at) : currentDateTime
            }
          })

          console.log(`Inserted operating hours for restaurantID: ${restaurantId}, day: ${row.day_of_week}`)
        } catch (dbError) {
          console.error(`Database error inserting operating hours for restaurantID: ${restaurantId}:`, dbError)
          throw dbError // トランザクション���ロールバックするためにエラーを投げる
        }
      }
    })
  }

  console.log("Seeding completed successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
