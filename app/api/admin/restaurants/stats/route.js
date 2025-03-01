import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // レストラン総数を取得
    const totalRestaurants = await prisma.restaurant.count();

    // 今月の新規登録数を取得
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newRestaurantsThisMonth = await prisma.restaurant.count({
      where: {
        created_at: {
          gte: firstDayOfMonth
        }
      }
    });

    // 最近の更新（最新の5件）
    const recentUpdates = await prisma.restaurant.findMany({
      orderBy: {
        updated_at: 'desc'
      },
      take: 5,
      select: {
        restaurant_id: true,
        name: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      totalRestaurants,
      newRestaurantsThisMonth,
      recentUpdates
    });
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}