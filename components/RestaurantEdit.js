import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React from 'react';

const RestaurantEdit = ({ restaurant, handleInputChange, handleSubmit }) => {
  if (!restaurant) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Restaurant not found</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Restaurant: {restaurant.name}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={restaurant.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="address_line1"
            label="Address Line 1"
            value={restaurant.address_line1}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="phone_number"
            label="Phone Number"
            value={restaurant.phone_number}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={restaurant.description}
            onChange={handleInputChange}
          />
          {/* Add more fields as needed */}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Restaurant
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantEdit;