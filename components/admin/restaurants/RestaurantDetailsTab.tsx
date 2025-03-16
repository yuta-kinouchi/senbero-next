import { Restaurant } from '@/types/restaurant';
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField
} from '@mui/material';
import React from 'react';

interface RestaurantDetailsTabProps {
  restaurant: Restaurant;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RestaurantDetailsTab: React.FC<RestaurantDetailsTabProps> = ({
  restaurant,
  handleInputChange,
  handleNumberChange,
  handleCheckboxChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="店舗の特徴" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="収容人数"
                  name="capacity"
                  type="number"
                  value={restaurant.capacity || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.morning_available || false}
                        onChange={handleCheckboxChange}
                        name="morning_available"
                      />
                    }
                    label="朝営業あり"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.daytime_available || false}
                        onChange={handleCheckboxChange}
                        name="daytime_available"
                      />
                    }
                    label="昼営業あり"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restaurant.is_standing || false}
                      onChange={handleCheckboxChange}
                      name="is_standing"
                    />
                  }
                  label="立ち飲み可"
                />
                {restaurant.is_standing && (
                  <TextField
                    fullWidth
                    label="立ち飲み詳細"
                    name="standing_description"
                    value={restaurant.standing_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.is_kakuuchi || false}
                        onChange={handleCheckboxChange}
                        name="is_kakuuchi"
                      />
                    }
                    label="角打ち可"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.is_cash_on || false}
                        onChange={handleCheckboxChange}
                        name="is_cash_on"
                      />
                    }
                    label="現金オン可"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restaurant.has_set || false}
                      onChange={handleCheckboxChange}
                      name="has_set"
                    />
                  }
                  label="セットメニューあり"
                />
                {restaurant.has_set && (
                  <TextField
                    fullWidth
                    label="せんべろセット詳細"
                    name="senbero_description"
                    value={restaurant.senbero_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restaurant.has_chinchiro || false}
                      onChange={handleCheckboxChange}
                      name="has_chinchiro"
                    />
                  }
                  label="ちんちろゲームあり"
                />
                {restaurant.has_chinchiro && (
                  <TextField
                    fullWidth
                    label="ちんちろ詳細"
                    name="chinchiro_description"
                    value={restaurant.chinchiro_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restaurant.outside_available || false}
                      onChange={handleCheckboxChange}
                      name="outside_available"
                    />
                  }
                  label="外席あり"
                />
                {restaurant.outside_available && (
                  <TextField
                    fullWidth
                    label="外席詳細"
                    name="outside_description"
                    value={restaurant.outside_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.has_tv || false}
                        onChange={handleCheckboxChange}
                        name="has_tv"
                      />
                    }
                    label="テレビあり"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.smoking_allowed || false}
                        onChange={handleCheckboxChange}
                        name="smoking_allowed"
                      />
                    }
                    label="喫煙可"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={restaurant.has_happy_hour || false}
                        onChange={handleCheckboxChange}
                        name="has_happy_hour"
                      />
                    }
                    label="ハッピーアワーあり"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RestaurantDetailsTab;