// pages/api/restaurants/index.ts
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // FormDataを使用するため、デフォルトのbodyParserを無効化
  },
};

const saveFile = async (file: formidable.File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // アップロードディレクトリが存在しない場合は作成
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

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    // フォームデータからレストラン情報を取得
    const restaurantData = JSON.parse(fields.restaurant[0]);

    // 画像ファイルの処理
    let restaurant_image = null;
    if (files.image && files.image[0]) {
      restaurant_image = await saveFile(files.image[0]);
    }

    // レストランの作成
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurantData.name,
        address_line1: restaurantData.address_line1,
        address_line2: restaurantData.address_line2,
        city: restaurantData.city,
        state: restaurantData.state,
        postal_code: restaurantData.postal_code,
        country: restaurantData.country,
        phone_number: restaurantData.phone_number,
        website: restaurantData.website,
        description: restaurantData.description,
        capacity: restaurantData.capacity ? parseInt(restaurantData.capacity) : null,
        is_standing: restaurantData.is_standing || false,
        standing_description: restaurantData.standing_description,
        is_kakuuchi: restaurantData.is_kakuuchi || false,
        is_cash_on: restaurantData.is_cash_on || false,
        morning_available: restaurantData.morning_available || false,
        daytime_available: restaurantData.daytime_available || false,
        has_set: restaurantData.has_set || false,
        senbero_description: restaurantData.senbero_description,
        has_chinchiro: restaurantData.has_chinchiro || false,
        has_happy_hour: restaurantData.has_happy_hour || false,
        outside_available: restaurantData.outside_available || false,
        outside_description: restaurantData.outside_description,
        is_cash_only: restaurantData.is_cash_only || false,
        has_charge: restaurantData.has_charge || false,
        charge_description: restaurantData.charge_description,
        has_tv: restaurantData.has_tv || false,
        smoking_allowed: restaurantData.smoking_allowed || false,
        special_rule: restaurantData.special_rule,
        restaurant_image,
        credit_card: restaurantData.credit_card || false,
        credit_card_description: restaurantData.credit_card_description,
        beer_price: restaurantData.beer_price,
        beer_types: restaurantData.beer_types,
        chuhai_price: restaurantData.chuhai_price,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // 営業時間の作成（もし含まれている場合）
    if (restaurantData.operating_hours && restaurantData.operating_hours.length > 0) {
      await prisma.operatingHours.createMany({
        data: restaurantData.operating_hours.map((hours: any) => ({
          restaurant_id: newRestaurant.restaurant_id,
          day: hours.day,
          open_time: hours.open_time,
          close_time: hours.close_time,
        })),
      });
    }

    // 作成したレストラン情報を取得（営業時間を含む）
    const createdRestaurant = await prisma.restaurant.findUnique({
      where: { restaurant_id: newRestaurant.restaurant_id },
      include: {
        operating_hours: true,
      },
    });

    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  } finally {
    await prisma.$disconnect();
  }
}