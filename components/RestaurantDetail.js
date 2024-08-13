import {
  Description,
  Edit,
  EventSeat,
  Language,
  LocationOn,
  Phone
} from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RestaurantFeatures from './RestaurantFeatures';


const RestaurantDetail = ({ restaurant }) => {
  console.log(restaurant)
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditClick = (restaurant_id) => {
    router.push(`/restaurants/${restaurant_id}/edit`);
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
              onClick={() => handleEditClick(restaurant.restaurant_id)}
            >
              <Edit />
            </IconButton>

            <Grid container spacing={2}>
              {/* Image section */}
              <Grid item xs={12} sm={6}>
                <CardMedia
                  component="img"
                  sx={{ width: '100%', borderRadius: 2 }}
                  image={restaurant.restaurant_image}
                  alt="Restaurant Image"
                />
              </Grid>

              {/* Information section */}
              <Grid item xs={12} sm={6}>
                <CardContent>
                  <Typography variant="body1">
                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {restaurant.state}{restaurant.city}{restaurant.address_line1}{restaurant.address_line2}
                  </Typography>
                  <Typography variant="body1">
                    <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {restaurant.phone_number || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <EventSeat sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {restaurant.capacity || 'N/A'}
                  </Typography>
                  {restaurant.home_page && (
                    <Typography variant="body1">
                      <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                      <a href={restaurant.home_page} target="_blank" rel="noopener noreferrer">
                        {restaurant.home_page}
                      </a>
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {restaurant.description || 'N/A'}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
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
              <Box>
                <RestaurantFeatures restaurant={restaurant} />
              </Box>
            )}

            {tabIndex === 1 && (
              <Box>
                {/* Posts section */}
                <Typography variant="h6" gutterBottom>
                  Posts
                </Typography>
                {/* Add your posts content here */}
                <Typography variant="body1">
                  No posts available.
                </Typography>
              </Box>
            )}

            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocationOn />}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  restaurant.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Container>
  );
};

export default RestaurantDetail;