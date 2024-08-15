import {
  AttachMoney,
  Casino as CasinoIcon,
  CloudUpload as CloudUploadIcon,
  LocalBar as LocalBarIcon,
  NightlifeTwoTone as NightlifeTwoToneIcon,
  OutdoorGrill,
  SmokingRooms,
  SportsBarRounded as SportsBarRoundedIcon,
  Tv,
  WbSunny as WbSunnyIcon,
} from '@mui/icons-material';
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

  const handleFeatureChange = (name) => (event) => {
    handleCheckboxChange(name)(event);
  };

  const handleFeatureDescriptionChange = (name) => (event) => {
    handleInputChange(event, name);
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
                onChange={(e) => handleInputChange(e, 'name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="phone_number"
                label="Phone Number"
                value={restaurant.phone_number || ''}
                onChange={(e) => handleInputChange(e, 'phone_number')}
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
                onChange={(e) => handleInputChange(e, 'description')}
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
            icon={SportsBarRoundedIcon}
            label="せんべろセット"
            isActive={restaurant.has_set}
            description={restaurant.senbero_description}
            onChangeActive={handleFeatureChange('has_set')}
            onChangeDescription={handleFeatureDescriptionChange('senbero_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={LocalBarIcon}
            label="立ち飲み"
            isActive={restaurant.is_standing}
            description={restaurant.standing_description}
            onChangeActive={handleFeatureChange('is_standing')}
            onChangeDescription={handleFeatureDescriptionChange('standing_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={OutdoorGrill}
            label="外飲み"
            isActive={restaurant.outside_available}
            description={restaurant.outside_description}
            onChangeActive={handleFeatureChange('outside_available')}
            onChangeDescription={handleFeatureDescriptionChange('outside_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={WbSunnyIcon}
            label="朝飲み"
            isActive={restaurant.morning_available}
            onChangeActive={handleFeatureChange('morning_available')}
          />
          <Divider />

          <FeatureEditItem
            icon={NightlifeTwoToneIcon}
            label="昼飲み"
            isActive={restaurant.daytime_available}
            onChangeActive={handleFeatureChange('daytime_available')}
          />
          <Divider />

          <FeatureEditItem
            icon={CasinoIcon}
            label="チンチロ"
            isActive={restaurant.has_chinchiro}
            description={restaurant.chinchiro_description}
            onChangeActive={handleFeatureChange('has_chinchiro')}
            onChangeDescription={handleFeatureDescriptionChange('chinchiro_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={SportsBarRoundedIcon}
            label="ハッピーアワー"
            isActive={restaurant.has_happy_hour}
            onChangeActive={handleFeatureChange('has_happy_hour')}
          />
          <Divider />

          <FeatureEditItem
            icon={LocalBarIcon}
            label="角打ち"
            isActive={restaurant.is_kakuuchi}
            onChangeActive={handleFeatureChange('is_kakuuchi')}
          />
          <Divider />

          <FeatureEditItem
            icon={AttachMoney}
            label="キャッシュオン"
            isActive={restaurant.is_cash_on}
            onChangeActive={handleFeatureChange('is_cash_on')}
          />
          <Divider />

          <FeatureEditItem
            icon={AttachMoney}
            label="チャージ"
            isActive={restaurant.has_charge}
            description={restaurant.charge_description}
            onChangeActive={handleFeatureChange('has_charge')}
            onChangeDescription={handleFeatureDescriptionChange('charge_description')}
          />
          <Divider />

          <FeatureEditItem
            icon={Tv}
            label="TV設置"
            isActive={restaurant.has_tv}
            onChangeActive={handleFeatureChange('has_tv')}
          />
          <Divider />

          <FeatureEditItem
            icon={SmokingRooms}
            label="喫煙"
            isActive={restaurant.smoking_allowed}
            onChangeActive={handleFeatureChange('smoking_allowed')}
          />

          <TextField
            fullWidth
            margin="normal"
            name="special_rule"
            label="Special Rule"
            value={restaurant.special_rule || ''}
            onChange={(e) => handleInputChange(e, 'special_rule')}
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