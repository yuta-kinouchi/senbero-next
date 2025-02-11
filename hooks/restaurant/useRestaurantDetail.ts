// hooks/restaurant/useRestaurantDetail.ts
import { useRestaurantApi } from '@/hooks/api/useRestaurantApi';
import { Restaurant } from '@/types/restaurant';
import { useEffect, useState } from 'react';

interface UseRestaurantDetailReturn {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

export const useRestaurantDetail = (id: string | undefined): UseRestaurantDetailReturn => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getRestaurant } = useRestaurantApi();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getRestaurant(id);
        setRestaurant(data);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch restaurant');
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  return { restaurant, loading, error };
};