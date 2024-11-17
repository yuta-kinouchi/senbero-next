// hooks/api/useRestaurantApi.ts
import { Restaurant } from '@/types/restaurant';

export const useRestaurantApi = () => {
  const createRestaurant = async (data: FormData): Promise<Restaurant> => {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'レストランの作成に失敗しました');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  // 検索用の関数を追加
  const searchRestaurants = async (params: URLSearchParams): Promise<Restaurant[]> => {
    const response = await fetch(`/api/restaurants/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    return response.json();
  };

  // 近くのレストランを取得する関数
  const getNearbyRestaurants = async (
    latitude: number,
    longitude: number,
    params: URLSearchParams
  ): Promise<Restaurant[]> => {
    const searchParams = new URLSearchParams(params.toString());
    searchParams.append('lat', latitude.toString());
    searchParams.append('lng', longitude.toString());
    searchParams.append('timestamp', new Date().toISOString());

    return searchRestaurants(searchParams);
  };

  return {
    createRestaurant,
    searchRestaurants,
    getNearbyRestaurants,
  };
};