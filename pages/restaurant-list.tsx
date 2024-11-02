import { Alert, Box, Chip, CircularProgress, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import RestaurantList from '../components/RestaurantList';
import styles from '../styles/HomePage.module.css';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const router = useRouter();
  const { useLocation, features, maxBeerPrice, maxChuhaiPrice } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          // 新しいURLSearchParamsインスタンスを作成
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


  useEffect(() => {
    if (router.isReady) {
      const featuresList = Array.isArray(features) ? features : features ? [features] : [];
      setSelectedFeatures(featuresList);
    }
  }, [router.isReady, features]);

  useEffect(() => {
    if (!router.isReady) return;
    
    const executeSearch = async () => {
      if (useLocation === 'true') {
        getLocationAndSearch();
      } else if (searchParams.toString()) {
        const params = new URLSearchParams(searchParams.toString());
        await fetchRestaurants(params);
      } else {
        setLoading(false);
      }
    };
  
    executeSearch();
  }, [router.isReady, useLocation, searchParams]);

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

  const restaurantListComponent = useMemo(() => {
    if (loading) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2 
          }}
        >
          <CircularProgress />
          <p>レストラン情報を読み込んでいます...</p>
        </Box>
      );
    }
  
    // RestaurantListコンポーネントに結果の表示を委譲
    return <RestaurantList restaurants={restaurants} />;
  }, [restaurants, loading]);
  
  return (
    <div className={styles.container}>
      <Navbar />
      <Box
        sx={{
          mb: 3,
          mt: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'center',
          maxWidth: '100%',
          padding: isMobile ? '0 16px' : '0 32px',
        }}
      >
        {availableFeatures.map((feature) => (
          <Chip
            key={feature.name}
            label={feature.label}
            onClick={() => handleFeatureToggle(feature.name)}
            color={selectedFeatures.includes(feature.name) ? "primary" : "default"}
            sx={{
              margin: '4px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              height: isMobile ? '28px' : '32px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              transition: 'all 0.3s',
            }}
          />
        ))}
      </Box>
      {restaurantListComponent}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RestaurantListPage;