import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RestaurantList from '../components/RestaurantList';
import styles from '../styles/HomePage.module.css';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { latitude, longitude } = router.query;
  const localTime = new Date().toISOString();

  useEffect(() => {
    if (latitude && longitude) {
      const fetchRestaurants = async () => {
        try {
          const response = await fetch(`/api/restaurants?latitude=${latitude}&longitude=${longitude}&localTime=${localTime}`);
          if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
          }
          const data = await response.json();
          setRestaurants(data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurants();
    } else {
      setLoading(false); // 位置情報がない場合もローディングを解除
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <RestaurantList restaurants={restaurants} />
    </div>
  );
};

export default RestaurantListPage;