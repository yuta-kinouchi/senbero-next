import { AREAS } from '@/lib/areas';
import prisma from '@/lib/prisma';
import { getSiteUrl } from '@/lib/siteUrl';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const restaurants = await prisma.restaurant.findMany({
    where: { deleted_at: null },
    select: { restaurant_id: true, updated_at: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/restaurants/search`, lastModified: new Date() },
    ...AREAS.map((area) => ({
      url: `${baseUrl}/areas/${area.slug}`,
      lastModified: new Date(),
    })),
  ];

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((restaurant) => ({
    url: `${baseUrl}/restaurants/${restaurant.restaurant_id}`,
    lastModified: restaurant.updated_at,
  }));

  return [...staticRoutes, ...restaurantRoutes];
}
