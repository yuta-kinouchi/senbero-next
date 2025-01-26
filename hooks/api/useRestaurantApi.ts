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

  const getRestaurant = async (id: string): Promise<Restaurant> => {
    try {
      const response = await fetch(`/api/restaurants/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }

      const data = await response.json();
      return data as Restaurant;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  };

  const updateRestaurant = async (id: number, data: Partial<Restaurant>): Promise<Restaurant> => {
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  };

  return {
    createRestaurant,
    searchRestaurants,
    getNearbyRestaurants,
    getRestaurant,
    updateRestaurant,
  };
};