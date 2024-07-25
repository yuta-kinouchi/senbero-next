import { AccessTime } from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/restaurants/${id}`);
  };
  return (
    <Container>
      {restaurants.length > 0 ? (
        <Stack spacing={3} sx={{ paddingTop: 5, paddingBottom: 5 }}
        >
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 2,
                overflow: 'hidden',
              }}
              onClick={() => handleCardClick(restaurant.restaurant_id)}
            >
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={restaurant.image_url}
                alt="Restaurant Image"
              />
              <Box sx={{ flex: 1, padding: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {restaurant.name}
                  </Typography>
                  <Box sx={{ marginTop: 1 }}>
                    <Box display="flex" alignItems="center">
                      <AccessTime sx={{ marginRight: 1 }} />
                      <Typography variant="body2">
                        営業時間：~ {restaurant.close_time}
                        {restaurant.food_last_order_time
                          ? ` （L.O ${restaurant.food_last_order_time}）`
                          : ""}
                      </Typography>
                    </Box>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          restaurant.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<PlaceIcon />}
                      >
                        Googleマップで検索
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography variant="body1" color="textSecondary">
          検索結果はありません。
        </Typography>
      )}
    </Container>
  );
};

export default RestaurantList;