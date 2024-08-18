import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RestaurantList from '../components/RestaurantList';
import styles from '../styles/HomePage.module.css';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { useLocation, features } = router.query;

  const fetchRestaurants = useCallback(async (params: URLSearchParams) => {
    try {
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

  const getLocationAndSearch = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentTimestamp = new Date().toISOString();
          const params = new URLSearchParams({
            lat: latitude.toString(),
            lng: longitude.toString(),
            timestamp: currentTimestamp,
          });
          if (features) {
            params.append('features', features as string);
          }
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
  }, [features, fetchRestaurants]);

  useEffect(() => {
    if (useLocation === 'true') {
      getLocationAndSearch();
    } else {
      const params = new URLSearchParams();
      if (features) {
        params.append('features', features as string);
      }
      fetchRestaurants(params);
    }
  }, [useLocation, features, getLocationAndSearch, fetchRestaurants]);

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <CircularProgress />
          <p>レストラン情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      {restaurants.length > 0 ? (
        <RestaurantList restaurants={restaurants} />
      ) : (
        <p>条件に合うレストランが見つかりませんでした。</p>
      )}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RestaurantListPage;