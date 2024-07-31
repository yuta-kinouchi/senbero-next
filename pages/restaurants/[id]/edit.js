import { Alert, CircularProgress, Container, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import RestaurantEdit from '../../../components/RestaurantEdit';
import styles from '../../../styles/HomePage.module.css';

const RestaurantEditPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
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
      const updatedRestaurant = await response.json();
      setRestaurant(updatedRestaurant);
      setSuccessMessage('Restaurant updated successfully!');
      // Optionally, you can redirect to the detail page after a short delay
      // setTimeout(() => router.push(`/restaurants/${id}`), 2000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage('');
    setError(null);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>Error: {error}</p>
          </div>
        ) : (
          <RestaurantEdit
            restaurant={restaurant}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Container>
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RestaurantEditPage;