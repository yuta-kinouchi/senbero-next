// hooks/restaurant/useRestaurantSearch.ts
import { useRestaurantApi } from '@/hooks/api/useRestaurantApi';
import { Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

interface UseRestaurantSearchReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
}

export const useRestaurantSearch = (): UseRestaurantSearchReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchRestaurants: searchRestaurantsApi } = useRestaurantApi();
  const router = useRouter();

  const searchRestaurants = useCallback(async () => {
    const { location, features, maxBeerPrice, maxChuhaiPrice } = router.query;

    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (location) {
        searchParams.append('location', location as string);
      }
      if (features) {
        const featuresList = Array.isArray(features) ? features : [features];
        featuresList.forEach((feature) => {
          searchParams.append('features', feature);
        });
      }
      if (maxBeerPrice) {
        searchParams.append('maxBeerPrice', maxBeerPrice as string);
      }
      if (maxChuhaiPrice) {
        searchParams.append('maxChuhaiPrice', maxChuhaiPrice as string);
      }
      const data = await searchRestaurantsApi(searchParams);
      setRestaurants(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (router.isReady) {
      searchRestaurants();
    }
  }, [router.isReady, searchRestaurants]);

  return { restaurants, loading, error };
};