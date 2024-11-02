import { Box, Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { RestaurantCard } from './RestaurantCard';

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (restaurantId) => {
    router.push(`/restaurants/${restaurantId}`);
  };

  if (restaurants.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '50vh',
          alignItems: 'center'
        }}
      >
        <Typography variant="body1" color="textSecondary">
          条件に合うレストランが見つかりませんでした。
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ p: 0 }}>
      <Stack spacing={1} sx={{ pb: 5 }}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            onClick={handleCardClick}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default RestaurantList;