import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Restaurant } from '@/types/restaurant';
import { isWalkable, WALKABLE_LIMIT_MINUTES } from '@/utils/features';
import { DirectionsWalk } from '@mui/icons-material';
import { Box, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  const { restaurant: navigationFunctions } = useAppNavigation();

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

  const renderCard = (restaurant: Restaurant) => (
    <RestaurantCard
      key={restaurant.restaurant_id}
      restaurant={restaurant}
      onClick={() => restaurant.restaurant_id && navigationFunctions.toDetail(restaurant.restaurant_id)}
    />
  );

  // イマココ検索(距離あり)の場合、徒歩圏内とそれ以遠の間に境界線を入れる。
  // 結果は距離昇順で返ってくるため、前半=徒歩圏内・後半=圏外に二分できる
  const hasDistance = restaurants.some((r) => r.distance != null);
  const walkableList = hasDistance
    ? restaurants.filter((r) => r.distance != null && isWalkable(r.distance))
    : restaurants;
  const farList = hasDistance
    ? restaurants.filter((r) => r.distance == null || !isWalkable(r.distance))
    : [];

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 }, pt: 2 }}>
      <Stack spacing={1.5} sx={{ pb: 5 }}>
        {walkableList.map(renderCard)}

        {hasDistance && farList.length > 0 && (
          <>
            {walkableList.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
                徒歩{WALKABLE_LIMIT_MINUTES}分圏内に条件に合うお店がありませんでした。
              </Typography>
            )}
            <Divider sx={{ pt: 1 }}>
              <Chip
                icon={<DirectionsWalk />}
                label={`ここから先は徒歩${WALKABLE_LIMIT_MINUTES}分以上`}
                size="small"
                sx={{ fontWeight: 700, color: 'text.secondary' }}
              />
            </Divider>
            {farList.map(renderCard)}
          </>
        )}
      </Stack>
    </Container>
  );
};

export default RestaurantList;
