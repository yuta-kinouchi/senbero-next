import { Restaurant } from '@/types/restaurant';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  TextField
} from '@mui/material';
import React from 'react';

interface DrinkInfoTabProps {
  restaurant: Restaurant;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DrinkInfoTab: React.FC<DrinkInfoTabProps> = ({
  restaurant,
  handleInputChange,
  handleNumberChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="ドリンク情報" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ビール価格"
                  name="beer_price"
                  type="number"
                  value={restaurant.beer_price || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: <InputAdornment position="end">円</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="チューハイ価格"
                  name="chuhai_price"
                  type="number"
                  value={restaurant.chuhai_price || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: <InputAdornment position="end">円</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ビールの種類"
                  name="beer_types"
                  value={restaurant.beer_types || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="例: アサヒスーパードライ, エビス, サッポロ黒ラベルなど"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DrinkInfoTab;