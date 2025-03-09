import OperatingHours from '@/components/restaurant/OperationgHour';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Edit } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import {
  Box, Card, CardContent, CardMedia, Container, Divider, Grid,
  IconButton, Tab, Tabs, Typography
} from '@mui/material';
import { useState } from 'react';
import RestaurantFeatures from './RestaurantFeatures';


const RestaurantDetail = ({ restaurant }) => {
  const { restaurant: navigationFunctions } = useAppNavigation();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <Box sx={{ position: 'relative' }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {restaurant.name}
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
              aria-label="edit"
              onClick={() => navigationFunctions.toEdit(restaurant.restaurant_id)}
            >
              <Edit />
            </IconButton>

            <Grid container spacing={2}>
              {/* Image section */}
              <Grid item xs={12}>
                <CardMedia
                  component="img"
                  sx={{ width: '100%', borderRadius: 2, maxHeight: 400, objectFit: 'cover' }}
                  image={restaurant.restaurant_image}
                  alt="Restaurant Image"
                />
              </Grid>

              {/* Tabs section */}
              <Grid item xs={12}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="restaurant details tabs">
                  <Tab
                    icon={<SportsBarRoundedIcon />}
                    iconPosition="start"
                    label="せんべろ情報"
                  />
                  <Tab
                    icon={<ChatBubbleOutlineIcon />}
                    iconPosition="start"
                    label="投稿"
                  />
                </Tabs>

                {tabIndex === 0 && (
                  <Box sx={{ mt: 2 }}>
                    <RestaurantFeatures restaurant={restaurant} />
                  </Box>
                )}

                {tabIndex === 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Posts
                    </Typography>
                    <Typography variant="body1">
                      No posts available.
                    </Typography>
                  </Box>
                )}
              </Grid>



              {/* Basic Information section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>基本情報</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>住所</Typography>
                    <Typography variant="body2">
                      {`${restaurant.state}${restaurant.city}${restaurant.address_line1}${restaurant.address_line2}`}
                    </Typography>
                  </Grid>
                  {/* Operating Hours section */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <OperatingHours restaurant={restaurant} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>電話番号</Typography>
                    <Typography variant="body2">{restaurant.phone_number || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>座席数</Typography>
                    <Typography variant="body2">{restaurant.capacity || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>ウェブサイト</Typography>
                    <Typography variant="body2">
                      {restaurant.home_page ? (
                        <a href={restaurant.home_page} target="_blank" rel="noopener noreferrer">
                          {restaurant.home_page}
                        </a>
                      ) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>説明</Typography>
                    <Typography variant="body2">{restaurant.description || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </Card>
    </Container>
  );
};

export default RestaurantDetail;