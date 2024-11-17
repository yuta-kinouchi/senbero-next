// hooks/useNavigation.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useNavigation = () => {
  const router = useRouter();

  const navigateToRestaurantList = useCallback(() => {
    router.push('/restaurants');
  }, [router]);

  const navigateToRestaurantDetail = useCallback((id: number) => {
    router.push(`/restaurants/${id}`);
  }, [router]);

  const navigateToRestaurantSearch = useCallback((params?: Record<string, string | string[]>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query.append(key, value.join(','));
        } else {
          query.append(key, value);
        }
      });
    }
    router.push(`/restaurants/search${query.toString() ? `?${query.toString()}` : ''}`);
  }, [router]);

  const navigateToNearbyRestaurants = useCallback(() => {
    router.push('/restaurants/nearby');
  }, [router]);

  const updateSearchParams = useCallback((params: Record<string, string | string[]>) => {
    const query = { ...router.query, ...params };
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  }, [router]);

  return {
    navigateToRestaurantList,
    navigateToRestaurantDetail,
    navigateToRestaurantSearch,
    navigateToNearbyRestaurants,
    updateSearchParams,
    currentPath: router.pathname,
    currentQuery: router.query,
  };
};