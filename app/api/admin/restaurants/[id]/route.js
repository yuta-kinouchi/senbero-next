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

    // レストランの詳細情報を取得
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        restaurant_id: restaurantId,
      },
      // 基本的な情報のみを取得
      select: {
        restaurant_id: true,
        name: true,
        phone_number: true,
        country: true,
        state: true,
        city: true,
        address_line1: true,
        address_line2: true,
        description: true,
        created_at: true,
        updated_at: true,
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

    // 基本情報のみを更新
    const updatedRestaurant = await prisma.restaurant.update({
      where: { restaurant_id: restaurantId },
      data: {
        name: data.name,
        phone_number: data.phone_number || null,
        country: data.country,
        state: data.state,
        city: data.city,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || null,
        description: data.description || null,
        updated_at: new Date(),
      },
      select: {
        restaurant_id: true,
        name: true,
        phone_number: true,
        country: true,
        state: true,
        city: true,
        address_line1: true,
        address_line2: true,
        description: true,
        created_at: true,
        updated_at: true,
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