import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';


const RestaurantEdit = ({ restaurant, handleInputChange, handleSubmit, handleCheckboxChange }) => {
  const [formData, setFormData] = useState(restaurant || {});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  if (!restaurant) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Restaurant not found</Typography>
        </CardContent>
      </Card>
    );
  }

  const getValue = (value) => value === null ? '' : value;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...restaurant, imageFile };
    console.log('Form Data before submission:', updatedFormData);
    handleSubmit(updatedFormData);
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Restaurant: {restaurant.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                value={getValue(restaurant.name)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Restaurant Image
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box mt={2}>
                  <img src={imagePreview} alt="Restaurant preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="phone_number"
                label="Phone Number"
                value={getValue(restaurant.phone_number)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="country"
                label="Country"
                value={getValue(restaurant.country)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="state"
                label="State"
                value={getValue(restaurant.state)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="city"
                label="City"
                value={getValue(restaurant.city)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="address_line1"
                label="Address Line 1"
                value={getValue(restaurant.address_line1)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="address_line2"
                label="Address Line 2"
                value={getValue(restaurant.address_line2)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="latitude"
                label="Latitude"
                type="number"
                value={getValue(restaurant.latitude)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="longitude"
                label="Longitude"
                type="number"
                value={getValue(restaurant.longitude)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="capacity"
                label="Capacity"
                type="number"
                value={getValue(restaurant.capacity)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="home_page"
                label="Home Page"
                value={getValue(restaurant.home_page)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={getValue(restaurant.description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="special_rule"
                label="Special Rule"
                value={getValue(restaurant.special_rule)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.morning_available}
                    onChange={handleCheckboxChange}
                    name="morning_available"
                  />
                }
                label="Morning Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.daytime_available}
                    onChange={handleCheckboxChange}
                    name="daytime_available"
                  />
                }
                label="Daytime Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.has_set}
                    onChange={handleCheckboxChange}
                    name="has_set"
                  />
                }
                label="Has Set Menu"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="senbero_description"
                label="Senbero Description"
                value={getValue(restaurant.senbero_description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.has_chinchiro}
                    onChange={handleCheckboxChange}
                    name="has_chinchiro"
                  />
                }
                label="Has Chinchiro"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="chinchiro_description"
                label="Chinchiro Description"
                value={getValue(restaurant.chinchiro_description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.outside_available}
                    onChange={handleCheckboxChange}
                    name="outside_available"
                  />
                }
                label="Outside Available"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="outside_description"
                label="Outside Description"
                value={getValue(restaurant.outside_description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.is_standing}
                    onChange={handleCheckboxChange}
                    name="is_standing"
                  />
                }
                label="Is Standing"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="standing_description"
                label="Standing Description"
                value={getValue(restaurant.standing_description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.is_kakuuchi}
                    onChange={handleCheckboxChange}
                    name="is_kakuuchi"
                  />
                }
                label="Is Kakuuchi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.is_cash_on}
                    onChange={handleCheckboxChange}
                    name="is_cash_on"
                  />
                }
                label="Is Cash On"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.has_charge}
                    onChange={handleCheckboxChange}
                    name="has_charge"
                  />
                }
                label="Has Charge"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="charge_description"
                label="Charge Description"
                value={getValue(restaurant.charge_description)}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.has_tv}
                    onChange={handleCheckboxChange}
                    name="has_tv"
                  />
                }
                label="Has TV"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.smoking_allowed}
                    onChange={handleCheckboxChange}
                    name="smoking_allowed"
                  />
                }
                label="Smoking Allowed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!restaurant.has_happy_hour}
                    onChange={handleCheckboxChange}
                    name="has_happy_hour"
                  />
                }
                label="Has Happy Hour"
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Restaurant
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantEdit;