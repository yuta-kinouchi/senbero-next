import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import RestaurantDetail from '../../components/RestaurantDetail';
import styles from '../../styles/HomePage.module.css';

const RestaurantDetailPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/restaurants/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant');
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      {restaurant ? (
        <RestaurantDetail restaurant={restaurant} />
      ) : (
        <div className={styles.notFoundContainer}>
          <p>Restaurant not found</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;