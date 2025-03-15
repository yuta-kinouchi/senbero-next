import { Restaurant } from '@/types/restaurant';
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField
} from '@mui/material';
import React from 'react';

interface PaymentInfoTabProps {
  restaurant: Restaurant;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentInfoTab: React.FC<PaymentInfoTabProps> = ({
  restaurant,
  handleInputChange,
  handleCheckboxChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="支払い情報" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restaurant.credit_card || false}
                      onChange={handleCheckboxChange}
                      name="credit_card"
                    />
                  }
                  label="クレジットカード決済可"
                />
                {restaurant.credit_card && (
                  <TextField
                    fullWidth
                    label="クレジットカード詳細"
                    name="credit_card_description"
                    value={restaurant.credit_card_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                    placeholder="例: VISA, Mastercard, JCB"
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
                      checked={restaurant.has_charge || false}
                      onChange={handleCheckboxChange}
                      name="has_charge"
                    />
                  }
                  label="席料/チャージあり"
                />
                {restaurant.has_charge && (
                  <TextField
                    fullWidth
                    label="席料/チャージ詳細"
                    name="charge_description"
                    value={restaurant.charge_description || ''}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                    placeholder="例: 1人500円、飲食代に含む"
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PaymentInfoTab;