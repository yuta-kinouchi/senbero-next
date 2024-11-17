// components/RestaurantList.tsx
import { useNavigation } from '@/hooks/useNavigation';
import { Restaurant } from '@/types/restaurant';
import { Box, Container, Stack, Typography } from '@mui/material';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  const { navigateToRestaurantDetail } = useNavigation();

  // 空の状態をコンポーネント化
  const EmptyState = () => (
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

  if (!restaurants || restaurants.length === 0) {
    return <EmptyState />;
  }

  return (
    <Container sx={{ p: 0 }}>
      <Stack spacing={1} sx={{ pb: 5 }}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            onClick={() => navigateToRestaurantDetail(restaurant.restaurant_id)}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default RestaurantList;