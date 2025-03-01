import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);

  // ページネーションパラメータの取得
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // 検索パラメータの取得
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const isKakuuchi = searchParams.get('is_kakuuchi') === 'true';
  const hasHappyHour = searchParams.get('has_happy_hour') === 'true';
  const smokingAllowed = searchParams.get('smoking_allowed') === 'true';

  // ソートパラメータの取得
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'desc';

  try {
    // クエリの条件を構築
    let whereCondition = {};

    // 検索条件の追加
    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      };
    }

    // 都市でフィルタリング
    if (city) {
      whereCondition = {
        ...whereCondition,
        city,
      };
    }

    // 特定条件でフィルタリング（条件が指定された場合のみ）
    if (searchParams.has('is_kakuuchi')) {
      whereCondition = {
        ...whereCondition,
        is_kakuuchi: isKakuuchi,
      };
    }

    if (searchParams.has('has_happy_hour')) {
      whereCondition = {
        ...whereCondition,
        has_happy_hour: hasHappyHour,
      };
    }

    if (searchParams.has('smoking_allowed')) {
      whereCondition = {
        ...whereCondition,
        smoking_allowed: smokingAllowed,
      };
    }

    // レストラン一覧を取得
    const restaurants = await prisma.restaurant.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        restaurant_id: true,
        name: true,
        address_line1: true,
        city: true,
        state: true,
        description: true,
        is_kakuuchi: true,
        beer_price: true,
        has_happy_hour: true,
        smoking_allowed: true,
        restaurant_image: true,
        created_at: true,
        updated_at: true,
      },
    });

    // 総数をカウント（ページネーション用）
    const totalCount = await prisma.restaurant.count({
      where: whereCondition,
    });

    // レスポンスを返す
    return NextResponse.json({
      restaurants,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
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