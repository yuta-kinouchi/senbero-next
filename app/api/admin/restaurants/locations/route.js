import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: レストランの市区町村リストを取得
export async function GET() {
  try {
    // レストランテーブルからユニークな市区町村を取得
    const uniqueLocations = await prisma.restaurant.findMany({
      select: {
        city: true
      },
      distinct: ['city'],
      where: {
        deleted_at: null
      },
      orderBy: {
        city: 'asc'
      }
    });

    // city列の値だけを配列に変換
    const locations = uniqueLocations
      .map(item => item.city)
      .filter(city => !!city); // nullや空の値を除外

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}