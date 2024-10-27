import { Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { RestaurantCard } from './RestaurantCard';

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (restaurantId) => {
    router.push(`/restaurants/${restaurantId}`);
  };

  if (restaurants.length === 0) {
    return (
      <Container className="p-0">
        <Typography variant="body1" color="textSecondary">
          検索結果はありません。
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="p-0">
      <Stack spacing={1} className="pb-5">
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