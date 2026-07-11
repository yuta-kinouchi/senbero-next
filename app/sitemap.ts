import { PrismaClient } from '@prisma/client';
import type { MetadataRoute } from 'next';

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const restaurants = await prisma.restaurant.findMany({
    select: { restaurant_id: true, updated_at: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/restaurants/search`, lastModified: new Date() },
  ];

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((restaurant) => ({
    url: `${baseUrl}/restaurants/${restaurant.restaurant_id}`,
    lastModified: restaurant.updated_at,
  }));

  return [...staticRoutes, ...restaurantRoutes];
}
