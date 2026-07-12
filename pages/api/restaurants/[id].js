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
        country,
        latitude,
        longitude,
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
        chinchiro_description,
        has_happy_hour,
        happy_hour_description,
        outside_available,
        outside_description,
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
        set_price,
        signature_menu,
        has_hoppy,
        solo_friendly,
        nearest_station,
        qr_payment,
      } = req.body;

      // TextField(type=number)経由でも文字列で届くため数値系は必ず変換する
      const toIntOrNull = (value) => {
        if (value === undefined || value === null || value === '') return null;
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };
      const toFloatOrUndefined = (value) => {
        if (value === undefined || value === null || value === '') return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      };

      const updatedRestaurant = await prisma.restaurant.update({
        where: { restaurant_id: parseInt(id) },
        data: {
          name,
          address_line1,
          address_line2,
          city,
          state,
          country,
          latitude: toFloatOrUndefined(latitude),
          longitude: toFloatOrUndefined(longitude),
          phone_number,
          description,
          capacity: toIntOrNull(capacity),
          is_standing,
          standing_description,
          is_kakuuchi,
          is_cash_on,
          morning_available,
          daytime_available,
          has_set,
          senbero_description,
          has_chinchiro,
          chinchiro_description,
          has_happy_hour,
          happy_hour_description,
          outside_available,
          outside_description,
          has_charge,
          charge_description,
          has_tv,
          smoking_allowed,
          special_rule,
          restaurant_image,
          credit_card,
          credit_card_description,
          beer_price: toIntOrNull(beer_price),
          beer_types,
          chuhai_price: toIntOrNull(chuhai_price),
          set_price: toIntOrNull(set_price),
          signature_menu,
          has_hoppy,
          solo_friendly,
          nearest_station,
          qr_payment,
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