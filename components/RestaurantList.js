import { AccessTime, DirectionsRun, Place } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Container, Fab, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (restaurant_id) => {
    router.push(`/restaurants/${restaurant_id}`);
  };

  const today = new Date().getDay();

  const getOperatingHours = (restaurant) => {
    if (restaurant.operating_hours && Array.isArray(restaurant.operating_hours) && restaurant.operating_hours[today]) {
      const todayOperatingHours = restaurant.operating_hours[today];
      return `${formatTime(todayOperatingHours.open_time)} ~ ${formatTime(todayOperatingHours.close_time)}`;
    }
    return "営業時間情報がありません";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const jstOffset = 9 * 60 * 60 * 1000;

      const date = new Date(new Date(timeString).getTime() - jstOffset);

      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tokyo'
      });
    } catch (error) {
      console.error("Invalid time format:", timeString);
      return "";
    }
  };

  return (
    <Container>
      {restaurants.length > 0 ? (
        <Stack spacing={3} sx={{ paddingTop: 5, paddingBottom: 5 }}>
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.restaurant_id}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => handleCardClick(restaurant.restaurant_id)}
            >
              <CardMedia
                component="img"
                sx={{ width: 180 }}
                image={restaurant.restaurant_image || '/default-restaurant-image.jpg'}
                alt={restaurant.name}
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
                        営業時間：{getOperatingHours(restaurant)}
                      </Typography>
                    </Box>
                    {restaurant.distance != null && (
                      <Box display="flex" alignItems="center" mt={2}>
                        <DirectionsRun sx={{ marginRight: 1 }} />
                        <Typography variant="body2">
                          距離：{restaurant.distance.toFixed(2)} km
                        </Typography>
                      </Box>
                    )}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Place />
                </Fab>
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