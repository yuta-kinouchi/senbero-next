import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // リクエストボディからフィルタ条件を取得
    const body = await request.json();
    const {
      search,
      city,
      state,
      filters = {},
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = body;

    // スキップ数を計算
    const skip = (page - 1) * limit;

    // 検索条件の構築
    let whereCondition = {};

    // テキスト検索
    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { address_line1: { contains: search } },
          { city: { contains: search } },
          { state: { contains: search } },
        ],
      };
    }

    // 都市と州のフィルタ
    if (city) {
      whereCondition = {
        ...whereCondition,
        city,
      };
    }

    if (state) {
      whereCondition = {
        ...whereCondition,
        state,
      };
    }

    // 特徴でのフィルタリング
    const featureFilters = [
      'is_kakuuchi',
      'is_standing',
      'is_cash_only',
      'has_set',
      'has_happy_hour',
      'has_chinchiro',
      'outside_available',
      'has_charge',
      'has_tv',
      'smoking_allowed',
      'credit_card',
      'morning_available',
      'daytime_available'
    ];

    // 存在するフィルターのみ追加
    featureFilters.forEach(feature => {
      if (feature in filters) {
        whereCondition[feature] = filters[feature];
      }
    });

    // 価格範囲でのフィルタリング
    if (filters.minBeerPrice !== undefined) {
      whereCondition = {
        ...whereCondition,
        beer_price: {
          ...whereCondition.beer_price,
          gte: parseInt(filters.minBeerPrice),
        },
      };
    }

    if (filters.maxBeerPrice !== undefined) {
      whereCondition = {
        ...whereCondition,
        beer_price: {
          ...whereCondition.beer_price,
          lte: parseInt(filters.maxBeerPrice),
        },
      };
    }

    // 収容人数でのフィルタリング
    if (filters.minCapacity !== undefined) {
      whereCondition = {
        ...whereCondition,
        capacity: {
          ...whereCondition.capacity,
          gte: parseInt(filters.minCapacity),
        },
      };
    }

    if (filters.maxCapacity !== undefined) {
      whereCondition = {
        ...whereCondition,
        capacity: {
          ...whereCondition.capacity,
          lte: parseInt(filters.maxCapacity),
        },
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
        address_line2: true,
        city: true,
        state: true,
        country: true,
        description: true,
        capacity: true,
        is_kakuuchi: true,
        is_standing: true,
        is_cash_only: true,
        has_set: true,
        has_happy_hour: true,
        outside_available: true,
        beer_price: true,
        beer_types: true,
        chuhai_price: true,
        restaurant_image: true,
        operating_hours: {
          select: {
            day_of_week: true,
            opening_time: true,
            closing_time: true,
            is_closed: true
          }
        },
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
    console.error('Error searching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to search restaurants', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}