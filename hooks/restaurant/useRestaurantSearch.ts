import { useRestaurantApi } from '@/hooks/api/useRestaurantApi';
import { useNavigation } from '@/hooks/useNavigation';
import { Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseRestaurantSearchReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  selectedFeatures: string[];
  availableFeatures: { name: string; label: string }[];
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
  const { updateSearchParams } = useNavigation();
  const { searchRestaurants, getNearbyRestaurants } = useRestaurantApi();

  // 前回の検索パラメータを保持
  const lastSearchRef = useRef<string>('');

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

  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedFeatures.length > 0) {
      params.append('features', selectedFeatures.join(','));
    }
    if (maxBeerPrice) params.append('maxBeerPrice', maxBeerPrice as string);
    if (maxChuhaiPrice) params.append('maxChuhaiPrice', maxChuhaiPrice as string);
    return params;
  }, [selectedFeatures, maxBeerPrice, maxChuhaiPrice]);

  // 検索実行の制御
  const executeSearch = useCallback(async () => {
    const currentParams = getSearchParams().toString();
    
    // パラメータが前回と同じ場合は検索をスキップ
    if (currentParams === lastSearchRef.current) {
      return;
    }

    try {
      setLoading(true);
      let data: Restaurant[];

      if (useLocation === 'true') {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });

          data = await getNearbyRestaurants(
            position.coords.latitude,
            position.coords.longitude,
            getSearchParams()
          );
        } else {
          throw new Error('お使いのブラウザは位置情報をサポートしていません。');
        }
      } else {
        data = await searchRestaurants(getSearchParams());
      }

      setRestaurants(data);
      lastSearchRef.current = currentParams; // 成功時に検索パラメータを更新
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'レストラン情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [useLocation, getSearchParams, getNearbyRestaurants, searchRestaurants]);

  // URLのfeaturesパラメータから選択された特徴を設定
  useEffect(() => {
    if (router.isReady && features) {
      const featuresList = Array.isArray(features) ? features : features ? [features] : [];
      setSelectedFeatures(featuresList);
    }
  }, [router.isReady, features]);

  // 検索条件変更時の処理
  useEffect(() => {
    if (!router.isReady) return;

    const timeoutId = setTimeout(() => {
      executeSearch();
    }, 300); // 300ms のデバウンス

    return () => clearTimeout(timeoutId);
  }, [router.isReady, useLocation, selectedFeatures, maxBeerPrice, maxChuhaiPrice, executeSearch]);

  const handleFeatureToggle = useCallback((feature: string) => {
    setSelectedFeatures((prev) => {
      const newFeatures = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature];

      updateSearchParams({ features: newFeatures });
      return newFeatures;
    });
  }, [updateSearchParams]);

  const handleCloseError = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setError(null);
  };

  return {
    restaurants,
    loading,
    error,
    selectedFeatures,
    availableFeatures,
    handleFeatureToggle,
    handleCloseError,
  };
};