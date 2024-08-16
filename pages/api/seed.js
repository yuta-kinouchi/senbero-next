import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { query } from '../../lib/db';

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}

function getCurrentMySQLDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function formatDateTime(timeString) {
  const defaultDate = '1970-01-01';
  const dateTimeString = `${defaultDate}T${timeString}.000Z`;

  console.log("Original time string:", timeString);
  console.log("Full datetime string:", dateTimeString);

  const date = new Date(dateTimeString);
  console.log(date)
  if (isNaN(date.getTime())) {
    console.log(date)
    return null;
  }

  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// 修正: boolean値を0または1の整数として処理する
function processBooleanAsInteger(value) {
  if (value === null || value === undefined) return 0;
  return value.toLowerCase() === 'true' || value === '1' ? 1 : 0;
}

export default async function handler(req, res) {
  console.log("API route handler started");

  if (req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    console.log("POST request received, starting seeding process");

    const filePath = path.join(process.cwd(), 'data', 'restaurants.csv');

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return res.status(500).json({ error: 'CSV file not found' });
    }

    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });

    console.log(`CSV parsing completed. ${results.length} rows found.`);

    for (const row of results) {
      const currentDateTime = getCurrentMySQLDateTime();

      let restaurantId = row.restaurant_id;
      let restaurantExists = false;
      console.log(restaurantId)

      if (restaurantId) {
        try {
          const existingRestaurant = await query({
            query: 'SELECT restaurant_id FROM restaurant WHERE restaurant_id = ?',
            values: [restaurantId],
          });

          if (existingRestaurant.length > 0) {
            restaurantExists = true;
            console.log(`Restaurant ID ${restaurantId} already exists.`);
          }
        } catch (dbError) {
          console.error(`Database error checking restaurant ID ${restaurantId}:`, dbError);
          continue;
        }
      }

      if (!restaurantExists) {
        const restaurantValues = [
          row.restaurant_id || null,
          row.name || null,
          row.phone_number || null,
          row.country || null,
          row.state || null,
          row.city || null,
          row.address_line1 || null,
          row.address_line2 || null,
          parseFloat(row.latitude) || null,
          parseFloat(row.longitude) || null,
          parseInt(row.capacity) || null,
          row.home_page || null,
          row.description || null,
          row.special_rule || null,
          processBooleanAsInteger(row.morning_available),
          processBooleanAsInteger(row.daytime_available),
          processBooleanAsInteger(row.has_set),
          row.senbero_description || null,
          processBooleanAsInteger(row.has_chinchiro),
          row.chinchiro_description || null,
          processBooleanAsInteger(row.outside_available),
          row.outside_description || null,
          processBooleanAsInteger(row.is_standing),
          row.standing_description || null,
          processBooleanAsInteger(row.is_kakuuchi),
          processBooleanAsInteger(row.is_cash_on),
          processBooleanAsInteger(row.has_charge),
          row.charge_description || null,
          processBooleanAsInteger(row.has_tv),
          processBooleanAsInteger(row.smoking_allowed),
          processBooleanAsInteger(row.has_happy_hour),
          null,
          isValidDate(row.created_at) ? row.created_at : currentDateTime,
          isValidDate(row.updated_at) ? row.updated_at : currentDateTime
        ];

        const restaurantSql = `
          INSERT INTO restaurant (
            restaurant_id, name, phone_number, country, state, city, 
            address_line1, address_line2, latitude, longitude, capacity, 
            home_page, description, special_rule, morning_available, 
            daytime_available, has_set, senbero_description, has_chinchiro, 
            chinchiro_description, outside_available, outside_description, 
            is_standing, standing_description, is_kakuuchi, is_cash_on, 
            has_charge, charge_description, has_tv, smoking_allowed, 
            has_happy_hour, deleted_at, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `;

        try {
          const result = await query({ query: restaurantSql, values: restaurantValues });
          restaurantId = result.insertId;
          console.log(`Inserted restaurant: ${restaurantValues[1]} (ID: ${restaurantId})`);
        } catch (dbError) {
          console.error(`Database error inserting restaurant ${restaurantValues[1]}:`, dbError);
          continue;
        }
      }

      if (row.day_of_week && restaurantId) {
        const operatingHoursValues = [
          restaurantId,
          row.day_of_week || null,
          formatDateTime(row.open_time) || null,
          formatDateTime(row.close_time) || null,
          formatDateTime(row.drink_last_order_time) || null,
          formatDateTime(row.food_last_order_time) || null,
          isValidDate(row.created_at) ? row.created_at : currentDateTime,
          isValidDate(row.updated_at) ? row.updated_at : currentDateTime
        ];

        console.log("-------");
        console.log("Restaurant ID:", restaurantId);
        console.log("Operating Hours Values:", operatingHoursValues);
        console.log(row)

        const operatingHoursSql = `
          INSERT INTO OperatingHour (
            restaurant_id, day_of_week, open_time, close_time, 
            drink_last_order_time, food_last_order_time, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
          await query({ query: operatingHoursSql, values: operatingHoursValues });
          console.log(`Inserted operating hours for restaurantID: ${restaurantId}, day: ${row.day_of_week}`);
        } catch (dbError) {
          console.error(`Database error inserting operating hours for restaurantID: ${restaurantId}:`, dbError);
        }
      }
    }

    console.log("Seeding completed successfully");
    res.status(200).json({ message: 'Seeding completed successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}