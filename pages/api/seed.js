// pages/api/seed.js
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { query } from '../../lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const results = [];
      const filePath = path.join(process.cwd(), 'data', 'restaurants.csv');

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const row of results) {
            const restaurantValues = [
              row.restaurant_id,
              row.name,
              row.phone_number,
              row.country,
              row.state,
              row.city,
              row.address_line1,
              row.address_line2,
              parseFloat(row.latitude),
              parseFloat(row.longitude),
              parseInt(row.capacity),
              row.home_page || null,
              row.description || null,
              row.special_rule || null,
              row.morning_available === 'FALSE',
              row.daytime_available === 'FALSE',
              row.has_set === 'FALSE',
              row.senbero_description || null,
              row.has_chinchiro === 'FALSE',
              row.chinchiro_description || null,
              row.outside_available === 'FALSE',
              row.outside_description || null,
              row.is_standing === 'FALSE',
              row.standing_description || null,
              row.is_kakuuchi === 'FALSE',
              row.is_cash_on === 'FALSE',
              row.has_charge === 'FALSE',
              row.charge_description || null,
              row.has_tv === 'FALSE',
              row.smoking_allowed === 'FALSE',
              row.has_happy_hour === 'FALSE',
              null,
              row.created_at,
              row.updated_at
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

            await query({ query: restaurantSql, values: restaurantValues });

            if (row.day_of_week) {
              const operatingHoursValues = [
                row.restaurant_id,
                row.day_of_week,
                row.start_time,
                row.end_time,
                row.happy_hour_start,
                row.happy_hour_end,
                row.created_at,
                row.updated_at
              ];

              const operatingHoursSql = `
                INSERT INTO operating_hours (
                  restaurant_id, day_of_week, start_time, end_time, 
                  happy_hour_start, happy_hour_end, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;

              await query({ query: operatingHoursSql, values: operatingHoursValues });
            }
          }

          res.status(200).json({ message: 'Seeding completed successfully' });
        });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}