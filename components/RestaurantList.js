import { AccessTime, DirectionsRun, Place } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Container, Fab, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (restaurant_id) => {
    router.push(`/restaurants/${restaurant_id}`);
  };

  const today = new Date().getDay();

  return (
    <Container>
      {restaurants.length > 0 ? (
        <Stack spacing={3} sx={{ paddingTop: 5, paddingBottom: 5 }}>
          {restaurants.map((restaurant) => {
            const todayOperatingHours = restaurant.operating_hours[today];

            return (
              <Card
                key={restaurant.restaurant_id}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 2,
                  overflow: 'hidden',
                  cursor: 'pointer', // カード全体をクリック可能にする
                  position: 'relative' // ボタンを絶対位置で配置するため
                }}
                onClick={() => handleCardClick(restaurant.restaurant_id)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 180 }}
                  image={restaurant.restaurant_image}
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
                          営業時間：
                          {todayOperatingHours
                            ? `${new Date(todayOperatingHours.open_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ~ ${new Date(todayOperatingHours.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : "営業時間情報がありません"}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={2}>
                        <DirectionsRun sx={{ marginRight: 1 }} />
                        <Typography variant="body2">
                          距離：{restaurant.distance.toFixed(2)} km
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Fab
                    color="primary"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      restaurant.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                  >
                    <Place />
                  </Fab>
                </Box>
              </Card>
            );
          })}
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