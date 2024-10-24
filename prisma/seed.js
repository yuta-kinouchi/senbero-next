import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface RestaurantData {
  restaurant_id: string
  name: string
  phone_number: string
  country: string
  state: string
  city: string
  address_line1: string
  address_line2: string
  latitude: string
  longitude: string
  capacity: string
  home_page: string
  description: string
  special_rule: string
  morning_available: string
  daytime_available: string
  has_set: string
  senbero_description: string
  has_chinchiro: string
  chinchiro_description: string
  outside_available: string
  outside_description: string
  is_standing: string
  standing_description: string
  is_kakuuchi: string
  is_cash_on: string
  has_charge: string
  charge_description: string
  has_tv: string
  smoking_allowed: string
  has_happy_hour: string
  created_at: string
  updated_at: string
  day_of_week: string
  open_time: string
  close_time: string
  drink_last_order_time: string
  food_last_order_time: string
}

function isValidDate(dateString: string): boolean {
  return !isNaN(Date.parse(dateString))
}

function getCurrentMySQLDateTime(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function formatDateTime(timeString: string): string | null {
  const defaultDate = '1970-01-01'
  const dateTimeString = `${defaultDate}T${timeString}.000Z`

  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) {
    return null
  }

  return date.toISOString().slice(0, 19).replace('T', ' ')
}

function processBooleanAsInteger(value: string | undefined | null): number {
  if (value === null || value === undefined) return 0
  return value.toLowerCase() === 'true' || value === '1' ? 1 : 0
}

async function main() {
  console.log("Seeding process started")

  const filePath = path.join(process.cwd(), 'data', 'restaurants.csv')

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const results: RestaurantData[] = []
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: RestaurantData) => results.push(data))
      .on('end', () => resolve())
      .on('error', (error) => {
        console.error('Error reading CSV:', error)
        reject(error)
      })
  })

  console.log(`CSV parsing completed. ${results.length} rows found.`)

  for (const row of results) {
    const currentDateTime = getCurrentMySQLDateTime()

    let restaurantId = parseInt(row.restaurant_id)
    let restaurantExists = false

    if (!isNaN(restaurantId)) {
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { restaurant_id: restaurantId }
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
            latitude: row.latitude ? parseFloat(row.latitude) : undefined,
            longitude: row.longitude ? parseFloat(row.longitude) : undefined,
            capacity: row.capacity ? parseInt(row.capacity) : undefined,
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
            created_at: isValidDate(row.created_at) ? new Date(row.created_at) : new Date(currentDateTime),
            updated_at: isValidDate(row.updated_at) ? new Date(row.updated_at) : new Date(currentDateTime)
          }
        })

        restaurantId = restaurant.restaurant_id
        console.log(`Inserted restaurant: ${restaurant.name} (ID: ${restaurantId})`)
      } catch (dbError) {
        console.error(`Database error inserting restaurant ${row.name}:`, dbError)
        continue
      }
    }

    if (row.day_of_week && restaurantId) {
      try {
        await prisma.operatingHour.create({
          data: {
            restaurant_id: restaurantId,
            day_of_week: row.day_of_week || undefined,
            open_time: row.open_time ? new Date(formatDateTime(row.open_time) || '') : undefined,
            close_time: row.close_time ? new Date(formatDateTime(row.close_time) || '') : undefined,
            drink_last_order_time: row.drink_last_order_time ? new Date(formatDateTime(row.drink_last_order_time) || '') : undefined,
            food_last_order_time: row.food_last_order_time ? new Date(formatDateTime(row.food_last_order_time) || '') : undefined,
            created_at: isValidDate(row.created_at) ? new Date(row.created_at) : new Date(currentDateTime),
            updated_at: isValidDate(row.updated_at) ? new Date(row.updated_at) : new Date(currentDateTime)
          }
        })

        console.log(`Inserted operating hours for restaurantID: ${restaurantId}, day: ${row.day_of_week}`)
      } catch (dbError) {
        console.error(`Database error inserting operating hours for restaurantID: ${restaurantId}:`, dbError)
      }
    }
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
