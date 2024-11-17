// pages/api/restaurants/index.ts
import { parseForm } from '@/lib/parseForm';
import { OperatingHour, PrismaClient, Restaurant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// FormDataを使用するため、デフォルトのボディパーサーを無効化
export const config = {
 api: {
   bodyParser: false,
 },
};

type RestaurantWithDistance = Restaurant & {
 distance: number;
 operating_hours: OperatingHour[];
};

type ErrorResponse = {
 message: string;
};

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<RestaurantWithDistance[] | Restaurant | ErrorResponse>
) {
 switch (req.method) {
   case 'POST':
     return handlePost(req, res);
   default:
     res.setHeader('Allow', ['GET', 'POST']);
     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
 }
}

async function handlePost(
 req: NextApiRequest,
 res: NextApiResponse<Restaurant | ErrorResponse>
) {
 try {
   const { fields, files } = await parseForm(req);

   // 画像ファイルの処理
   let imageUrl = null;
   if (files.restaurant_image) {
     const file = Array.isArray(files.restaurant_image) 
       ? files.restaurant_image[0] 
       : files.restaurant_image;
     // TODO: 画像アップロード処理の実装
     imageUrl = file.filepath; // 仮の実装
   }

   // operating_hoursの処理
   let operating_hours = [];
   if (fields.operating_hours) {
     operating_hours = JSON.parse(fields.operating_hours.toString());
   }

   // レストランデータの作成
   const restaurant = await prisma.restaurant.create({
     data: {
       name: fields.name.toString(),
       phone_number: fields.phone_number?.toString(),
       country: fields.country?.toString(),
       state: fields.state?.toString(),
       city: fields.city?.toString(),
       address_line1: fields.address_line1?.toString(),
       address_line2: fields.address_line2?.toString(),
       latitude: fields.latitude ? parseFloat(fields.latitude.toString()) : null,
       longitude: fields.longitude ? parseFloat(fields.longitude.toString()) : null,
       capacity: fields.capacity ? parseInt(fields.capacity.toString(), 10) : null,
       description: fields.description?.toString(),
       special_rule: fields.special_rule?.toString(),
       morning_available: fields.morning_available === 'true',
       daytime_available: fields.daytime_available === 'true',
       has_set: fields.has_set === 'true',
       senbero_description: fields.senbero_description?.toString(),
       has_chinchiro: fields.has_chinchiro === 'true',
       chinchiro_description: fields.chinchiro_description?.toString(),
       outside_available: fields.outside_available === 'true',
       outside_description: fields.outside_description?.toString(),
       is_standing: fields.is_standing === 'true',
       standing_description: fields.standing_description?.toString(),
       is_kakuuchi: fields.is_kakuuchi === 'true',
       is_cash_on: fields.is_cash_on === 'true',
       has_charge: fields.has_charge === 'true',
       charge_description: fields.charge_description?.toString(),
       has_tv: fields.has_tv === 'true',
       smoking_allowed: fields.smoking_allowed === 'true',
       has_happy_hour: fields.has_happy_hour === 'true',
       restaurant_image: imageUrl,
       credit_card: fields.credit_card === 'true',
       credit_card_description: fields.credit_card_description?.toString(),
       beer_price: fields.beer_price ? parseInt(fields.beer_price.toString(), 10) : null,
       beer_types: fields.beer_types?.toString(),
       chuhai_price: fields.chuhai_price ? parseInt(fields.chuhai_price.toString(), 10) : null,
       operating_hours: {
         create: operating_hours
       }
     },
     include: {
       operating_hours: true,
     },
   });

   return res.status(201).json(restaurant);
 } catch (error) {
   console.error('Error creating restaurant:', error);
   return res.status(500).json({ message: 'Error creating restaurant' });
 } finally {
   await prisma.$disconnect();
 }
}