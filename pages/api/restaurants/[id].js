import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const restaurant = await prisma.restaurant.findUnique({
        where: { restaurant_id: parseInt(id) },
        include: {
          operating_hours: true, // 営業時間情報を含める
        },
      });
      console.log(restaurant)

      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ message: 'Restaurant not found' });
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      res.status(500).json({ message: 'Error fetching restaurant' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        name,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        phone_number,
        website,
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
      } = req.body;

      const updatedRestaurant = await prisma.restaurant.update({
        where: { restaurant_id: parseInt(id) },
        data: {
          name,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          country,
          phone_number,
          website,
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

      res.status(200).json(updatedRestaurant);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      res.status(500).json({ error: 'Failed to update restaurant' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}