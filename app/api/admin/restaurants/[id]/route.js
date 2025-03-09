import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: レストラン詳細取得
export async function GET(request, { params }) {
  const { id } = params;

  try {
    // 数値型IDを確保
    const restaurantId = parseInt(id);

    if (isNaN(restaurantId)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    // レストランの詳細情報を取得（全フィールド）
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        restaurant_id: restaurantId,
      },
      include: {
        operating_hours: true // 営業時間情報も含める
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: レストラン情報更新
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const restaurantId = parseInt(id);

    if (isNaN(restaurantId)) {
      return NextResponse.json(
        { error: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    // リクエストボディを取得
    const data = await request.json();

    // 全フィールドを更新
    const updatedRestaurant = await prisma.restaurant.update({
      where: { restaurant_id: restaurantId },
      data: {
        // 基本情報
        name: data.name,
        phone_number: data.phone_number || null,
        country: data.country,
        state: data.state,
        city: data.city,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        capacity: data.capacity || null,
        home_page: data.home_page || null,
        description: data.description || null,
        special_rule: data.special_rule || null,
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

        updated_at: new Date(),
      },
      include: {
        operating_hours: true // 更新後のデータに営業時間も含める
      }
    });

    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error(`Error updating restaurant with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update restaurant details', message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}