import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import styles from '../../../styles/HomePage.module.css';

const RestaurantEditPage = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
      });
      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }
      router.push(`/restaurants/${id}`);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Restaurant: {restaurant.name}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={restaurant.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="address_line1"
            label="Address Line 1"
            value={restaurant.address_line1}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="phone_number"
            label="Phone Number"
            value={restaurant.phone_number}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={restaurant.description}
            onChange={handleInputChange}
          />
          {/* Add more fields as needed */}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Restaurant
          </Button>
        </Box>
      ) : (
        <div className={styles.notFoundContainer}>
          <p>Restaurant not found</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantEditPage;