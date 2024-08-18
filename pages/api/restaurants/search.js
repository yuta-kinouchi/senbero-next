import { PrismaClient } from '@prisma/client';
import { getDay } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log('API called: /api/restaurants/search');
  console.log('Query parameters:', req.query);

  if (req.method === 'GET') {
    const { lat, lng, features, timestamp } = req.query;

    const isLocationSearch = lat && lng;

    if (isLocationSearch && !timestamp) {
      console.log('Missing required parameter: timestamp for location-based search');
      res.status(400).json({ message: 'Timestamp is required for location-based search' });
      return;
    }

    try {
      console.log('Processing search parameters...');
      let whereClause = {};
      let currentMinutes, dayOfWeek;

      if (isLocationSearch) {
        const currentTime = new Date(timestamp);
        if (isNaN(currentTime.getTime())) {
          throw new Error('Invalid timestamp provided');
        }
        dayOfWeek = getDay(currentTime);
        currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        console.log('Current time:', { dayOfWeek, currentMinutes });
      }

      if (features) {
        const featureList = features.split(',');
        console.log('Features:', featureList);
        whereClause = {
          AND: featureList.map(feature => ({ [feature]: true }))
        };
      }

      console.log('Final where clause:', JSON.stringify(whereClause, null, 2));

      console.log('Executing database query...');
      const restaurants = await prisma.restaurant.findMany({
        where: whereClause,
        include: {
          operating_hours: true,
        },
      });

      console.log(`Query completed. Found ${restaurants.length} restaurants.`);

      let filteredRestaurants = restaurants;

      if (isLocationSearch) {
        filteredRestaurants = restaurants.filter(restaurant => {
          const todayHours = restaurant.operating_hours.find(h => h.day_of_week === dayOfWeek);
          if (!todayHours) return false;

          console.log('Today\'s hours for restaurant:', restaurant.id, todayHours);

          const openTime = new Date(todayHours.open_time);
          const closeTime = new Date(todayHours.close_time);

          const openMinutes = openTime.getHours() * 60 + openTime.getMinutes();
          const closeMinutes = closeTime.getHours() * 60 + closeTime.getMinutes();

          console.log('Parsed times:', {
            openMinutes,
            closeMinutes,
            currentMinutes
          });

          let isOpen;
          if (closeMinutes < openMinutes) {
            // 深夜営業の場合
            isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
          } else {
            isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
          }

          console.log('Is restaurant open:', isOpen);

          return isOpen;
        }).map(restaurant => ({
          ...restaurant,
          close_time: restaurant.operating_hours.find(h => h.day_of_week === dayOfWeek).close_time
        }));

        filteredRestaurants = filteredRestaurants.map((restaurant) => {
          const distance = getDistanceFromLatLonInKm(
            parseFloat(lat),
            parseFloat(lng),
            restaurant.latitude,
            restaurant.longitude
          );
          return { ...restaurant, distance };
        }).sort((a, b) => a.distance - b.distance);
      }

      console.log(`Filtered ${filteredRestaurants.length} restaurants.`);

      // デバッグ用：フィルタリングされたレストランの特徴を出力
      filteredRestaurants.forEach(restaurant => {
        console.log(`Restaurant ${restaurant.id} features:`,
          Object.entries(restaurant)
            .filter(([key, value]) => typeof value === 'boolean' && value === true)
            .map(([key]) => key)
        );
      });

      res.status(200).json(filteredRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    console.log('Method Not Allowed:', req.method);
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Haversine formulaで距離を計算（変更なし）
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}