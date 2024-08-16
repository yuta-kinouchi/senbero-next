import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { features } = req.body;

  if (!features || !Array.isArray(features) || features.length === 0) {
    return res.status(400).json({ message: 'Valid features array is required' });
  }

  try {
    // Construct the query for features
    const featureQuery = features.reduce((acc, feature) => {
      acc[feature] = true;
      return acc;
    }, {});

    const restaurants = await prisma.restaurant.findMany({
      where: featureQuery,
    });

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return res.status(500).json({ message: 'Error fetching restaurants' });
  } finally {
    await prisma.$disconnect();
  }
}