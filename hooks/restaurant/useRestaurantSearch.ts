// hooks/restaurant/useRestaurantSearch.ts
import { Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

interface UseRestaurantSearchReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  selectedFeatures: string[];
  searchParams: URLSearchParams;
  availableFeatures: { name: string; label: string }[];
  fetchRestaurants: (params: URLSearchParams) => Promise<void>;
  getLocationAndSearch: () => void;
  handleFeatureToggle: (feature: string) => void;
  handleCloseError: (event: React.SyntheticEvent | Event, reason?: string) => void;
}

export const useRestaurantSearch = (): UseRestaurantSearchReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const router = useRouter();
  const { useLocation, features, maxBeerPrice, maxChuhaiPrice } = router.query;

  // availableFeaturesをメモ化
  const availableFeatures = useMemo(() => [
    { name: 'morning_available', label: '朝飲み' },
    { name: 'daytime_available', label: '昼飲み' },
    { name: 'has_set', label: 'せんべろセット' },
    { name: 'has_chinchiro', label: 'チンチロ' },
    { name: 'outside_available', label: '外飲み' },
    { name: 'is_standing', label: '立ち飲み' },
    { name: 'is_kakuuchi', label: '角打ち' },
    { name: 'is_cash_on', label: 'キャッシュオン' },
    { name: 'has_charge', label: 'チャージなし' },
    { name: 'has_tv', label: 'TV設置' },
    { name: 'smoking_allowed', label: '喫煙可' },
    { name: 'has_happy_hour', label: 'ハッピーアワー' },
  ], []);

  const fetchRestaurants = useCallback(async (params: URLSearchParams) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurants/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error:', error);
      setError('レストラン情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedFeatures.length > 0) {
      params.append('features', selectedFeatures.join(','));
    }
    if (maxBeerPrice) params.append('maxBeerPrice', maxBeerPrice as string);
    if (maxChuhaiPrice) params.append('maxChuhaiPrice', maxChuhaiPrice as string);
    return params;
  }, [selectedFeatures, maxBeerPrice, maxChuhaiPrice]);

  const getLocationAndSearch = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const params = new URLSearchParams(searchParams.toString());
          params.append('lat', latitude.toString());
          params.append('lng', longitude.toString());
          params.append('timestamp', new Date().toISOString());
          fetchRestaurants(params);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('位置情報の取得に失敗しました。ブラウザの設定をご確認ください。');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('お使いのブラウザは位置情報をサポートしていません。');
      setLoading(false);
    }
  }, [searchParams, fetchRestaurants]);

  const handleFeatureToggle = useCallback((feature: string) => {
    setSelectedFeatures((prev) => {
      const newFeatures = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature];

      const params = new URLSearchParams(router.query as any);
      params.set('features', newFeatures.join(','));
      router.push(`${router.pathname}?${params.toString()}`, undefined, { shallow: true });

      return newFeatures;
    });
  }, [router]);

  const handleCloseError = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  };

  return {
    restaurants,
    loading,
    error,
    selectedFeatures,
    searchParams,
    availableFeatures,
    fetchRestaurants,
    getLocationAndSearch,
    handleFeatureToggle,
    handleCloseError,
  };
};