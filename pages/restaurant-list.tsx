import { CircularProgress, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RestaurantList from '../components/RestaurantList';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants');
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
  }, []);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Navbar />
        <CircularProgress />
      </Container>
    );
  }
  return (
    <div>
      <Navbar />
      <RestaurantList restaurants={restaurants} />
    </div>
  );
};

export default RestaurantListPage;