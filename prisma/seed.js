import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString))
}

function formatDateTime(timeString) {
  const defaultDate = '1970-01-01'
  const dateTimeString = `${defaultDate}T${timeString}.000Z`

  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) {
    return null
  }

  return date
}

function parseBoolean(value) {
  if (value === null || value === undefined) return false
  return value.toLowerCase() === 'true' || value === '1'
}

function parseDayOfWeek(day) {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  const index = days.indexOf(day)
  return index !== -1 ? index : parseInt(day, 10)
}

function parseIntOrNull(value) {
  if (!value) return null
  const num = parseInt(value, 10)
  return isNaN(num) ? null : num
}

function buildRestaurantData(row, now) {
  return {
    name: row.name || undefined,
    phone_number: row.phone_number || null,
    country: row.country || '日本',
    state: row.state || '',
    city: row.city || '',
    address_line1: row.address_line1 || '',
    address_line2: row.address_line2 || '',
    latitude: row.latitude ? parseFloat(row.latitude) : 0,
    longitude: row.longitude ? parseFloat(row.longitude) : 0,
    capacity: parseIntOrNull(row.capacity),
    home_page: row.home_page || null,
    description: row.description || null,
    special_rule: row.special_rule || null,
    morning_available: parseBoolean(row.morning_available),
    daytime_available: parseBoolean(row.daytime_available),
    has_set: parseBoolean(row.has_set),
    senbero_description: row.senbero_description || null,
    has_chinchiro: parseBoolean(row.has_chinchiro),
    chinchiro_description: row.chinchiro_description || null,
    outside_available: parseBoolean(row.outside_available),
    outside_description: row.outside_description || null,
    is_standing: parseBoolean(row.is_standing),
    standing_description: row.standing_description || null,
    is_kakuuchi: parseBoolean(row.is_kakuuchi),
    is_cash_on: parseBoolean(row.is_cash_on),
    has_charge: parseBoolean(row.has_charge),
    charge_description: row.charge_description || null,
    has_tv: parseBoolean(row.has_tv),
    smoking_allowed: parseBoolean(row.smoking_allowed),
    has_happy_hour: parseBoolean(row.has_happy_hour),
    restaurant_image: row.restaurant_image || null,
    credit_card: parseBoolean(row.credit_card),
    credit_card_description: row.credit_card_description || null,
    beer_price: parseIntOrNull(row.beer_price),
    beer_types: row.beer_types || null,
    chuhai_price: parseIntOrNull(row.chuhai_price),
    set_price: parseIntOrNull(row.set_price),
    signature_menu: row.signature_menu || null,
    has_hoppy: parseBoolean(row.has_hoppy),
    solo_friendly: parseBoolean(row.solo_friendly),
    nearest_station: row.nearest_station || null,
    happy_hour_description: row.happy_hour_description || null,
    qr_payment: parseBoolean(row.qr_payment),
    created_at: isValidDate(row.created_at) ? new Date(row.created_at) : now,
    updated_at: now,
  }
}

async function main() {
  console.log('Seeding process started')

  const filePath = path.join(process.cwd(), 'data', 'restaurants.csv')

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const results = []
  await new Promise((resolve, reject) => {
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

  // CSVは「1店舗 x 営業曜日」で複数行になっているため、店舗ごとにまとめる
  const restaurantRows = new Map()
  for (const row of results) {
    const id = parseInt(row.restaurant_id, 10)
    if (isNaN(id)) continue
    if (!restaurantRows.has(id)) {
      restaurantRows.set(id, [])
    }
    restaurantRows.get(id).push(row)
  }

  console.log(`${restaurantRows.size} unique restaurants found.`)

  const now = new Date()

  for (const [restaurantId, rows] of restaurantRows) {
    const data = buildRestaurantData(rows[0], now)

    try {
      // 冪等にするため upsert: 既存店舗は属性を更新、新規は作成
      await prisma.restaurant.upsert({
        where: { restaurant_id: restaurantId },
        update: data,
        create: { restaurant_id: restaurantId, ...data },
      })

      // 営業時間は洗い替え(全削除→再作成)。重複登録を防ぐ
      await prisma.operatingHour.deleteMany({
        where: { restaurant_id: restaurantId },
      })

      const hoursData = rows
        .filter((row) => row.day_of_week !== undefined && row.day_of_week !== '')
        .map((row) => ({
          restaurant_id: restaurantId,
          day_of_week: parseDayOfWeek(row.day_of_week),
          open_time: row.open_time ? formatDateTime(row.open_time) : null,
          close_time: row.close_time ? formatDateTime(row.close_time) : null,
          drink_last_order_time: row.drink_last_order_time ? formatDateTime(row.drink_last_order_time) : null,
          food_last_order_time: row.food_last_order_time ? formatDateTime(row.food_last_order_time) : null,
          happy_hour_start: row.happy_hour_start ? formatDateTime(row.happy_hour_start) : null,
          happy_hour_end: row.happy_hour_end ? formatDateTime(row.happy_hour_end) : null,
          created_at: now,
          updated_at: now,
        }))
        .filter((h) => h.open_time && h.close_time)

      if (hoursData.length > 0) {
        await prisma.operatingHour.createMany({ data: hoursData })
      }

      console.log(`Upserted restaurant ${restaurantId} (${data.name}) with ${hoursData.length} operating hours`)
    } catch (dbError) {
      console.error(`Database error for restaurant ${restaurantId} (${rows[0].name}):`, dbError)
    }
  }

  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
