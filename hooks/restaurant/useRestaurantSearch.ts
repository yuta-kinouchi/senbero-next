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

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('この端末では位置情報がサポートされていません'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
};

export const useRestaurantSearch = (): UseRestaurantSearchReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchRestaurants: searchRestaurantsApi, getNearbyRestaurants } = useRestaurantApi();
  const router = useRouter();

  const searchRestaurants = useCallback(async () => {
    const { useLocation, features, maxBeerPrice, maxChuhaiPrice } = router.query;

    const searchParams = new URLSearchParams();
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

    try {
      setLoading(true);

      if (useLocation === 'true') {
        try {
          const position = await getCurrentPosition();
          const data = await getNearbyRestaurants(
            position.coords.latitude,
            position.coords.longitude,
            searchParams
          );
          setRestaurants(data);
          setError(null);
          return;
        } catch (geoError) {
          setError('位置情報を取得できなかったため、現在地からの近さでは並び替えていません。');
          const data = await searchRestaurantsApi(searchParams);
          setRestaurants(data);
          return;
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (router.isReady) {
      searchRestaurants();
    }
  }, [router.isReady, searchRestaurants]);

  return { restaurants, loading, error };
};
