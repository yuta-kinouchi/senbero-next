import { Restaurant } from '@/types/restaurant';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import React from 'react';

interface BasicInfoTabProps {
  restaurant: Restaurant;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  restaurant,
  handleInputChange,
  handleNumberChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="基本情報" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="店舗名"
                  name="name"
                  value={restaurant.name || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="電話番号"
                  name="phone_number"
                  value={restaurant.phone_number || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ホームページ"
                  name="home_page"
                  value={restaurant.home_page || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="国"
                  name="country"
                  value={restaurant.country || '日本'}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="都道府県"
                  name="state"
                  value={restaurant.state || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="市区町村"
                  name="city"
                  value={restaurant.city || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="住所1（番地など）"
                  name="address_line1"
                  value={restaurant.address_line1 || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="住所2（建物名など）"
                  name="address_line2"
                  value={restaurant.address_line2 || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="緯度"
                  name="latitude"
                  type="number"
                  value={restaurant.latitude || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: { step: 'any' }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="経度"
                  name="longitude"
                  type="number"
                  value={restaurant.longitude || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: { step: 'any' }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="店舗画像URL"
                  name="restaurant_image"
                  value={restaurant.restaurant_image || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="説明"
                  name="description"
                  value={restaurant.description || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="特別ルール"
                  name="special_rule"
                  value={restaurant.special_rule || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BasicInfoTab;