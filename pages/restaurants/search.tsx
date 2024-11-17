import Navbar from '@/components/Navbar';
import RestaurantList from '@/components/RestaurantList';
import { useRestaurantSearch } from '@/hooks/restaurant/useRestaurantSearch';
import styles from '@/styles/HomePage.module.css';
import { Alert, Box, Chip, CircularProgress, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

const RestaurantListPage = () => {
  const {
    restaurants,
    loading,
    error,
    selectedFeatures,
    availableFeatures,
    handleFeatureToggle,
    handleCloseError,
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