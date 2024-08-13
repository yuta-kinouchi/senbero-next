import {
  AttachMoney,
  DirectionsWalk,
  OutdoorGrill,
  SmokingRooms,
  SportsBar,
  Tv,
} from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

const FeatureEditItem = ({ icon: Icon, label, isActive, description, onChangeActive, onChangeDescription }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ mr: 2, color: isActive ? 'warning.main' : 'action.disabled' }}>
      <Icon fontSize="large" />
    </Box>
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={isActive}
          onChange={onChangeActive}
          sx={{ mr: 1 }}
        />
        <Typography variant="subtitle1">{label}</Typography>
      </Box>
      {description !== undefined && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          value={description || ''}
          onChange={onChangeDescription}
          disabled={!isActive}
        />
      )}
    </Box>
  </Box>
);

const RestaurantEdit = ({ restaurant, handleInputChange, handleSubmit, handleCheckboxChange }) => {
  const [imagePreview, setImagePreview] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

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
            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                value={restaurant.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="phone_number"
                label="Phone Number"
                value={restaurant.phone_number || ''}
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
                value={restaurant.description || ''}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Image Upload */}
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
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h5" gutterBottom>
            Features
          </Typography>

          <FeatureEditItem
            icon={DirectionsWalk}
            label="立ち飲み"
            isActive={restaurant.is_standing}
            description={restaurant.standing_description}
            onChangeActive={(e) => handleCheckboxChange(e, 'is_standing')}
            onChangeDescription={(e) => handleInputChange(e, 'standing_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={SportsBar}
            label="せんべろセット"
            isActive={restaurant.has_set}
            description={restaurant.senbero_description}
            onChangeActive={(e) => handleCheckboxChange(e, 'has_set')}
            onChangeDescription={(e) => handleInputChange(e, 'senbero_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={SportsBar}
            label="チンチロ"
            isActive={restaurant.has_chinchiro}
            description={restaurant.chinchiro_description}
            onChangeActive={(e) => handleCheckboxChange(e, 'has_chinchiro')}
            onChangeDescription={(e) => handleInputChange(e, 'chinchiro_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={SportsBar}
            label="ハッピーアワー"
            isActive={restaurant.has_happy_hour}
            onChangeActive={(e) => handleCheckboxChange(e, 'has_happy_hour')}
          />
          <Divider />

          <FeatureEditItem
            icon={OutdoorGrill}
            label="外飲み"
            isActive={restaurant.outside_available}
            description={restaurant.outside_description}
            onChangeActive={(e) => handleCheckboxChange(e, 'outside_available')}
            onChangeDescription={(e) => handleInputChange(e, 'outside_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={AttachMoney}
            label="キャッシュオン"
            isActive={restaurant.is_cash_on}
            onChangeActive={(e) => handleCheckboxChange(e, 'is_cash_on')}
          />
          <Divider />

          <FeatureEditItem
            icon={AttachMoney}
            label="チャージ"
            isActive={restaurant.has_charge}
            description={restaurant.charge_description}
            onChangeActive={(e) => handleCheckboxChange(e, 'has_charge')}
            onChangeDescription={(e) => handleInputChange(e, 'charge_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={Tv}
            label="TV設置"
            isActive={restaurant.has_tv}
            onChangeActive={(e) => handleCheckboxChange(e, 'has_tv')}
          />
          <Divider />

          <FeatureEditItem
            icon={SmokingRooms}
            label="喫煙"
            isActive={restaurant.smoking_allowed}
            onChangeActive={(e) => handleCheckboxChange(e, 'smoking_allowed')}
          />

          <TextField
            fullWidth
            margin="normal"
            name="special_rule"
            label="Special Rule"
            value={restaurant.special_rule || ''}
            onChange={handleInputChange}
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Update Restaurant
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantEdit;