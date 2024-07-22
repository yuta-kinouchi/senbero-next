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

      // Insert restaurant
      const restaurantValues = {
        name: row.name || null,
        phone_number: row.phone_number || null,
        country: row.country || null,
        state: row.state || null,
        city: row.city || null,
        address_line1: row.address_line1 || null,
        address_line2: row.address_line2 || null,
        latitude: parseFloat(row.latitude) || null,
        longitude: parseFloat(row.longitude) || null,
        capacity: parseInt(row.capacity) || null,
        home_page: row.home_page || null,
        description: row.description || null,
        special_rule: row.special_rule || null,
        morning_available: row.morning_available === 'FALSE' ? false : true,
        daytime_available: row.daytime_available === 'FALSE' ? false : true,
        has_set: row.has_set === 'FALSE' ? false : true,
        senbero_description: row.senbero_description || null,
        has_chinchiro: row.has_chinchiro === 'FALSE' ? false : true,
        chinchiro_description: row.chinchiro_description || null,
        outside_available: row.outside_available === 'FALSE' ? false : true,
        outside_description: row.outside_description || null,
        is_standing: row.is_standing === 'FALSE' ? false : true,
        standing_description: row.standing_description || null,
        is_kakuuchi: row.is_kakuuchi === 'FALSE' ? false : true,
        is_cash_on: row.is_cash_on === 'FALSE' ? false : true,
        has_charge: row.has_charge === 'FALSE' ? false : true,
        charge_description: row.charge_description || null,
        has_tv: row.has_tv === 'FALSE' ? false : true,
        smoking_allowed: row.smoking_allowed === 'FALSE' ? false : true,
        has_happy_hour: row.has_happy_hour === 'FALSE' ? false : true,
        deleted_at: null,
        created_at: isValidDate(row.created_at) ? row.created_at : currentDateTime,
        updated_at: isValidDate(row.updated_at) ? row.updated_at : currentDateTime
      };

      const restaurantSql = `
        INSERT INTO restaurant (
          name, phone_number, country, state, city, 
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

      const restaurantInsertValues = Object.values(restaurantValues);

      let restaurantId;
      try {
        const result = await query({ query: restaurantSql, values: restaurantInsertValues });
        restaurantId = result.insertId;
        console.log(`Inserted restaurant: ${restaurantValues.name} (ID: ${restaurantId})`);
      } catch (dbError) {
        console.error(`Database error inserting restaurant ${restaurantValues.name}:`, dbError);
        continue;
      }

      // Insert operating hours
      if (row.day_of_week) {
        const operatingHoursValues = [
          restaurantId,
          row.day_of_week || null,
          row.open_time || null,
          row.close_time || null,
          row.drink_last_order_time || null,
          row.food_last_order_time || null,
          isValidDate(row.created_at) ? row.created_at : currentDateTime,
          isValidDate(row.updated_at) ? row.updated_at : currentDateTime
        ];

        console.log("-------");
        console.log("Restaurant ID:", restaurantId);
        console.log("Operating Hours Values:", operatingHoursValues);

        if (operatingHoursValues.every(value => value !== null)) {
          const operatingHoursSql = `
            INSERT INTO operating_hours (
              restaurant_id, day_of_week, start_time, end_time, 
              drink_last_order_time, food_last_order_time, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          try {
            await query({ query: operatingHoursSql, values: operatingHoursValues });
            console.log(`Inserted operating hours for restaurant: ${restaurantValues.name}, day: ${row.day_of_week}`);
          } catch (dbError) {
            console.error(`Database error inserting operating hours for restaurant ${restaurantValues.name}:`, dbError);
          }
        } else {
          console.warn(`Skipping operating hours insertion for restaurant ${restaurantValues.name} due to null values`);
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