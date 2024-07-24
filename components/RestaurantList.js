import { Box, Card, CardContent, Container, Typography } from '@mui/material';

const RestaurantList = ({ restaurants }) => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        近くのレストラン一覧
      </Typography>
      <Box>
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                住所: {restaurant.address}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                営業時間: {restaurant.openingHours}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default RestaurantList;