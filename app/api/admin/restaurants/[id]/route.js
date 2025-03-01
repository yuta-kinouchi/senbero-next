// app/api/admin/restaurants/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { restaurant_id: parseInt(id) },
      include: {
        operating_hours: true,
      },
    });

    if (restaurant) {
      return NextResponse.json(restaurant);
    } else {
      return NextResponse.json(
        { message: 'Restaurant not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { message: 'Error fetching restaurant' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      phone_number,
      description,
      capacity,
      is_standing,
      standing_description,
      is_kakuuchi,
      is_cash_on,
      morning_available,
      daytime_available,
      has_set,
      senbero_description,
      has_chinchiro,
      has_happy_hour,
      outside_available,
      outside_description,
      is_cash_only,
      has_charge,
      charge_description,
      has_tv,
      smoking_allowed,
      special_rule,
      restaurant_image,
      credit_card,
      credit_card_description,
      beer_price,
      beer_types,
      chuhai_price,
    } = data;

    const updatedRestaurant = await prisma.restaurant.update({
      where: { restaurant_id: parseInt(id) },
      data: {
        name,
        address_line1,
        address_line2,
        city,
        state,
        country,
        phone_number,
        description,
        capacity: capacity ? parseInt(capacity) : null,
        is_standing,
        standing_description,
        is_kakuuchi,
        is_cash_on,
        morning_available,
        daytime_available,
        has_set,
        senbero_description,
        has_chinchiro,
        has_happy_hour,
        outside_available,
        outside_description,
        is_cash_only,
        has_charge,
        charge_description,
        has_tv,
        smoking_allowed,
        special_rule,
        restaurant_image,
        credit_card,
        credit_card_description,
        beer_price,
        beer_types,
        chuhai_price,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}