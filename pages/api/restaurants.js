import { PrismaClient } from '@prisma/client';
import { getDay } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { latitude, longitude, localTime } = req.query;

    if (!latitude || !longitude || !localTime) {
      res.status(400).json({ message: 'Latitude, longitude, and localTime are required' });
      return;
    }

    try {
      const currentTime = new Date(localTime);
      const dayOfWeek = getDay(currentTime);

      const currentHours = currentTime.getUTCHours();
      const currentMinutes = currentTime.getUTCMinutes();

      const restaurants = await prisma.restaurant.findMany({
        include: {
          operating_hours: true,
        },
      });

      const openRestaurants = restaurants.filter((restaurant) => {
        const todayOperatingHours = restaurant.operating_hours.find(
          (hour) => hour.day_of_week === dayOfWeek
        );

        if (todayOperatingHours) {
          const openTime = new Date(todayOperatingHours.open_time);
          const closeTime = new Date(todayOperatingHours.close_time);

          const openHours = openTime.getUTCHours();
          const openMinutes = openTime.getUTCMinutes();

          const closeHours = closeTime.getUTCHours();
          const closeMinutes = closeTime.getUTCMinutes();

          const isOpen = (
            (currentHours >= openHours || (currentHours === openHours && currentMinutes >= openMinutes)) &&
            (currentHours < closeHours || (currentHours === closeHours && currentMinutes <= closeMinutes))
          );

          if (isOpen) {
            return { ...restaurant, close_time: todayOperatingHours.close_time.toISOString() };
          }
        }

        return false;
      });

      const sortedRestaurants = openRestaurants.map((restaurant) => {
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          restaurant.latitude,
          restaurant.longitude
        );
        return { ...restaurant, distance };
      }).sort((a, b) => a.distance - b.distance);

      res.status(200).json(sortedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ message: 'Error fetching restaurants' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Haversine formulaで距離を計算
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球の半径（キロメートル）
  const dLat = deg2rad(lat2 - lat1); // 緯度の差をラジアンに変換
  const dLon = deg2rad(lon2 - lon1); // 経度の差をラジアンに変換
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 距離を計算
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}