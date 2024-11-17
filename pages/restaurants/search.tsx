import Navbar from '@/components/common/Navbar';
import RestaurantList from '@/components/restaurant/RestaurantList';
import { useRestaurantSearch } from '@/hooks/restaurant/useRestaurantSearch';
import styles from '@/styles/HomePage.module.css';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const RestaurantListPage = () => {
  const router = useRouter();
  const {
    restaurants,
    loading,
    error,
  } = useRestaurantSearch();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  
    return <RestaurantList restaurants={restaurants} />;
  }, [restaurants, loading]);
  
  return (
    <div className={styles.container}>
      <Navbar />
      {restaurantListComponent}
    </div>
  );
}

export default RestaurantListPage;