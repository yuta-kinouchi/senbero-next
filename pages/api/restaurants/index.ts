// pages/api/restaurants/index.ts
import { Prisma, PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: formidable.File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const uniqueFileName = `${Date.now()}-${file.originalFilename}`;
  const newPath = path.join(uploadsDir, uniqueFileName);
  await fs.promises.copyFile(file.filepath, newPath);
  return `/uploads/${uniqueFileName}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const prisma = new PrismaClient();

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    if (!fields.restaurant?.[0]) {
      return res.status(400).json({ error: 'Restaurant data is required' });
    }

    const restaurantData = JSON.parse(fields.restaurant[0]);


    let restaurant_image = null;
    if (files.image && files.image[0]) {
      restaurant_image = await saveFile(files.image[0]);
    }

    // トランザクションを使用してレストランを作成
    const result = await prisma.$transaction(async (tx) => {
      // レストランを作成
      const newRestaurant = await tx.restaurant.create({
        data: {
          name: restaurantData.name,
          country: restaurantData.country ?? '日本',
          state: restaurantData.state ?? '',
          city: restaurantData.city ?? '',
          address_line1: restaurantData.address_line1 ?? '',
          address_line2: restaurantData.address_line2 ?? '',
          latitude: restaurantData.latitude || 0,
          longitude: restaurantData.longitude || 0,
          phone_number: restaurantData.phone_number || null,
          capacity: restaurantData.capacity ? parseInt(restaurantData.capacity) : null,
          home_page: restaurantData.home_page || null,
          description: restaurantData.description || null,
          special_rule: restaurantData.special_rule || null,
          morning_available: restaurantData.morning_available || false,
          daytime_available: restaurantData.daytime_available || false,
          has_set: restaurantData.has_set || false,
          senbero_description: restaurantData.senbero_description || null,
          has_chinchiro: restaurantData.has_chinchiro || false,
          chinchiro_description: restaurantData.chinchiro_description || null,
          outside_available: restaurantData.outside_available || false,
          outside_description: restaurantData.outside_description || null,
          is_standing: restaurantData.is_standing || false,
          standing_description: restaurantData.standing_description || null,
          is_kakuuchi: restaurantData.is_kakuuchi || false,
          is_cash_on: restaurantData.is_cash_on || false,
          has_charge: restaurantData.has_charge || false,
          charge_description: restaurantData.charge_description || null,
          has_tv: restaurantData.has_tv || false,
          smoking_allowed: restaurantData.smoking_allowed || false,
          has_happy_hour: restaurantData.has_happy_hour || false,
          restaurant_image,
          credit_card: restaurantData.credit_card || false,
          credit_card_description: restaurantData.credit_card_description || null,
          beer_price: restaurantData.beer_price ? parseInt(restaurantData.beer_price) : null,
          beer_types: restaurantData.beer_types || null,
          chuhai_price: restaurantData.chuhai_price ? parseInt(restaurantData.chuhai_price) : null,
        },
      });

      // 営業時間がある場合は作成
      if (restaurantData.operating_hours?.length > 0) {
        await tx.operatingHour.createMany({
          data: restaurantData.operating_hours.map((hours: any) => ({
            restaurant_id: newRestaurant.restaurant_id,
            day_of_week: hours.day_of_week,
            open_time: new Date(hours.open_time),
            close_time: new Date(hours.close_time),
            drink_last_order_time: hours.drink_last_order_time ? new Date(hours.drink_last_order_time) : null,
            food_last_order_time: hours.food_last_order_time ? new Date(hours.food_last_order_time) : null,
            happy_hour_start: hours.happy_hour_start ? new Date(hours.happy_hour_start) : null,
            happy_hour_end: hours.happy_hour_end ? new Date(hours.happy_hour_end) : null,
          })),
        });
      }

      // 作成したレストランを取得して返す
      return tx.restaurant.findUnique({
        where: { restaurant_id: newRestaurant.restaurant_id },
        include: { operating_hours: true },
      });
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'A restaurant with this ID already exists'
        });
      }
    }
    res.status(500).json({ error: 'Failed to create restaurant' });
  } finally {
    await prisma.$disconnect();
  }
}