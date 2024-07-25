import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  console.log(id)

  if (req.method === 'GET') {
    try {
      const restaurant = await prisma.restaurant.findUnique({
        where: { restaurant_id: parseInt(id) },
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}