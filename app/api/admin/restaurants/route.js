import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: レストラン一覧を取得（検索機能付き）
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const skip = (page - 1) * limit;

  try {
    // 検索条件を構築
    const whereCondition = {
      deleted_at: null, // 削除されていないレコードのみ
    };

    // 検索キーワードが指定されていれば条件に追加
    if (search) {
      whereCondition.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { address_line1: { contains: search } },
        { address_line2: { contains: search } },
      ];
    }

    // 市区町村が指定されていれば条件に追加
    if (city) {
      whereCondition.city = city;
    }

    // 条件に合致するレストランを取得
    const restaurants = await prisma.restaurant.findMany({
      skip,
      take: limit,
      where: whereCondition,
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
      }
    });

    // 条件に合致するレストランの総数を取得
    const totalCount = await prisma.restaurant.count({
      where: whereCondition
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

    // operating_hoursを取得
    const { operating_hours } = data;

    // 基本的なバリデーション
    if (!data.name || !data.address_line1 || !data.city || !data.state || !data.country) {
      return NextResponse.json(
        { error: "店舗名、住所、市区町村、都道府県、国は必須項目です" },
        { status: 400 }
      );
    }

    const maxRecord = await prisma.restaurant.findFirst({
      orderBy: { restaurant_id: 'desc' }
    });
    const nextId = (maxRecord?.restaurant_id || 0) + 1;

    // レストラン情報を作成
    const newRestaurant = await prisma.restaurant.create({
      data: {
        restaurant_id: nextId,
        name: data.name,
        phone_number: data.phone_number || null,
        country: data.country,
        state: data.state,
        city: data.city,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || null,
        description: data.description || null,
        special_rule: data.special_rule || null,
        capacity: data.capacity || null,
        home_page: data.home_page || null,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        restaurant_image: data.restaurant_image || null,

        // 店舗詳細
        morning_available: data.morning_available || false,
        daytime_available: data.daytime_available || false,
        has_set: data.has_set || false,
        senbero_description: data.senbero_description || null,
        has_chinchiro: data.has_chinchiro || false,
        chinchiro_description: data.chinchiro_description || null,
        outside_available: data.outside_available || false,
        outside_description: data.outside_description || null,
        is_standing: data.is_standing || false,
        standing_description: data.standing_description || null,
        is_kakuuchi: data.is_kakuuchi || false,
        is_cash_on: data.is_cash_on || false,
        has_tv: data.has_tv || false,
        smoking_allowed: data.smoking_allowed || false,
        has_happy_hour: data.has_happy_hour || false,

        // ドリンク情報
        beer_price: data.beer_price || null,
        beer_types: data.beer_types || null,
        chuhai_price: data.chuhai_price || null,

        // 支払い情報
        credit_card: data.credit_card || false,
        credit_card_description: data.credit_card_description || null,
        has_charge: data.has_charge || false,
        charge_description: data.charge_description || null,

        // タイムスタンプ
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (operating_hours && Array.isArray(operating_hours) && operating_hours.length > 0) {
      await Promise.all(operating_hours.map(hour => {
        // IDを削除して自動生成にする
        const { id, ...hourData } = hour;
        return prisma.operatingHour.create({
          data: {
            ...hourData,
            restaurant_id: newRestaurant.restaurant_id
          }
        });
      }));

      // 作成した営業時間情報を含めたレストラン情報を再取得
      const updatedRestaurant = await prisma.restaurant.findUnique({
        where: { restaurant_id: newRestaurant.restaurant_id },
        include: { operating_hours: true }
      });

      return NextResponse.json(updatedRestaurant, { status: 201 });
    }

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