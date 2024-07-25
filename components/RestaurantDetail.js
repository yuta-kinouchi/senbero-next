import {
  AccessTime,
  AttachMoney,
  Description,
  DirectionsWalk,
  EventSeat,
  Language,
  LocalBar,
  LocationOn,
  OutdoorGrill,
  Phone,
  Restaurant,
  SmokingRooms,
  Tv,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const RestaurantDetail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchRestaurantDetail(id);
    }
  }, [id]);

  const fetchRestaurantDetail = async (restaurantId) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Restaurant not found');
      }
      const data = await response.json();
      setRestaurant(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Typography variant="h6" align="center">
        Restaurant not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
            {restaurant.name}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                {restaurant.phone_number || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                {`${restaurant.address_line1}, ${restaurant.address_line2}, ${restaurant.city}, ${restaurant.state}, ${restaurant.country}`}
              </Typography>
            </Grid>
            {restaurant.home_page && (
              <Grid item xs={12}>
                <Typography variant="body1">
                  <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <a href={restaurant.home_page} target="_blank" rel="noopener noreferrer">
                    {restaurant.home_page}
                  </a>
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {restaurant.description || 'No description available.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <EventSeat sx={{ mr: 1, verticalAlign: 'middle' }} />
            Capacity and Seating
          </Typography>
          <Typography variant="body1">
            Capacity: {restaurant.capacity || 'N/A'}
          </Typography>
          <Box mt={1}>
            <Chip
              icon={<DirectionsWalk />}
              label={restaurant.is_standing ? 'Standing Available' : 'No Standing'}
              color={restaurant.is_standing ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            {restaurant.is_standing && (
              <Typography variant="body2">
                {restaurant.standing_description}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
            Availability
          </Typography>
          <Box>
            <Chip
              label="Morning"
              color={restaurant.morning_available ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label="Daytime"
              color={restaurant.daytime_available ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <LocalBar sx={{ mr: 1, verticalAlign: 'middle' }} />
            Special Features
          </Typography>
          <Box>
            <Chip
              label="Set Menu"
              color={restaurant.has_set ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label="Senbero"
              color={restaurant.senbero_description ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label="Chinchiro"
              color={restaurant.has_chinchiro ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label="Happy Hour"
              color={restaurant.has_happy_hour ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
          {restaurant.senbero_description && (
            <Typography variant="body2" mt={1}>
              Senbero: {restaurant.senbero_description}
            </Typography>
          )}
          {restaurant.chinchiro_description && (
            <Typography variant="body2" mt={1}>
              Chinchiro: {restaurant.chinchiro_description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <OutdoorGrill sx={{ mr: 1, verticalAlign: 'middle' }} />
            Outdoor Seating
          </Typography>
          <Chip
            label={restaurant.outside_available ? 'Available' : 'Not Available'}
            color={restaurant.outside_available ? 'primary' : 'default'}
            sx={{ mr: 1, mb: 1 }}
          />
          {restaurant.outside_description && (
            <Typography variant="body2" mt={1}>
              {restaurant.outside_description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
            Payment and Charges
          </Typography>
          <Box>
            <Chip
              label={restaurant.is_cash_on ? 'Cash Only' : 'Card Accepted'}
              color={restaurant.is_cash_on ? 'secondary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={restaurant.has_charge ? 'Cover Charge' : 'No Cover Charge'}
              color={restaurant.has_charge ? 'secondary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
          {restaurant.charge_description && (
            <Typography variant="body2" mt={1}>
              Charge details: {restaurant.charge_description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Other Information
          </Typography>
          <Box>
            <Chip
              icon={<Tv />}
              label={restaurant.has_tv ? 'TV Available' : 'No TV'}
              color={restaurant.has_tv ? 'primary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              icon={<SmokingRooms />}
              label={restaurant.smoking_allowed ? 'Smoking Allowed' : 'No Smoking'}
              color={restaurant.smoking_allowed ? 'secondary' : 'default'}
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>

          {restaurant.special_rule && (
            <Typography variant="body2" mt={2}>
              Special Rules: {restaurant.special_rule}
            </Typography>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LocationOn />}
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RestaurantDetail;