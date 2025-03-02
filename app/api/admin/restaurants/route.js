import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: レストラン一覧を取得
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const restaurants = await prisma.restaurant.findMany({
      skip,
      take: limit,
      orderBy: {
        updated_at: 'desc'
      },
      select: {
        restaurant_id: true,
        name: true,
        city: true,
        state: true,
        created_at: true,
        updated_at: true
      },
      where: {
        deleted_at: null // 削除されていないレコードのみ
      }
    });

    const totalCount = await prisma.restaurant.count({
      where: {
        deleted_at: null
      }
    });

    return NextResponse.json({
      restaurants,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: 新規レストラン登録
export async function POST(request) {
  try {
    // リクエストボディを取得
    const data = await request.json();

    // 営業時間データを分離
    const { operating_hours, ...restaurantData } = data;

    // トランザクション開始
    const newRestaurant = await prisma.$transaction(async (tx) => {
      // 1. レストラン情報を作成
      const restaurant = await tx.restaurant.create({
        data: {
          ...restaurantData,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // 2. 営業時間情報があれば作成
      if (operating_hours && operating_hours.length > 0) {
        const operatingHoursData = operating_hours.map(hour => ({
          restaurant_id: restaurant.restaurant_id,
          day_of_week: hour.day_of_week,
          open_time: hour.open_time,
          close_time: hour.close_time,
          drink_last_order_time: hour.drink_last_order_time,
          food_last_order_time: hour.food_last_order_time,
          happy_hour_start: hour.happy_hour_start,
          happy_hour_end: hour.happy_hour_end,
        }));

        await tx.operatingHour.createMany({
          data: operatingHoursData,
        });
      }

      // 3. 作成したレストラン情報（営業時間含む）を取得
      return tx.restaurant.findUnique({
        where: { restaurant_id: restaurant.restaurant_id },
        include: { operating_hours: true },
      });
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant', message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}