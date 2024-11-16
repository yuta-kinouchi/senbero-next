import { FeatureEditItemProps, RestaurantFormProps } from '@/types/restaurant';
import {
  AttachMoney,
  Casino,
  CloudUpload,
  Deck,
  LocalBar,
  Payments,
  SmokingRooms,
  SportsBar,
  Tv,
  WbSunny
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
import { OperatingHoursFields } from './OperatingHoursFields';


const FeatureEditItem: React.FC<FeatureEditItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  description, 
  onChangeActive, 
  onChangeDescription 
}) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ m: 2, color: isActive ? 'warning.main' : 'action.disabled' }}>
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

export const RestaurantNew: React.FC<RestaurantFormProps> = ({
  restaurant,
  handleInputChange,
  handleOperatingHoursChange,
  handleSubmit,
  handleCheckboxChange,
  handleFileChange,
  imagePreview,
  isNew = false
}) => {
  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            せんべろの追加
          </Typography>
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="店名"
                value={restaurant.name || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="phone_number"
                label="電話番号"
                value={restaurant.phone_number || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="capacity"
                label="収容人数"
                value={restaurant.capacity || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="詳細"
                multiline
                rows={4}
                value={restaurant.description || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                店舗外観画像
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
                  startIcon={<CloudUpload />}
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

          {/* 住所情報を追加 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                margin="normal"
                name="state"
                label="都道府県"
                value={restaurant.state || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                margin="normal"
                name="city"
                label="市区町村"
                value={restaurant.city || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="normal"
                name="address_line1"
                label="住所1"
                value={restaurant.address_line1 || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="address_line2"
                label="住所2"
                value={restaurant.address_line2 || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <OperatingHoursFields
              operatingHours={restaurant.operating_hours || []}
              onChange={handleOperatingHoursChange} 
            />
          </Grid>

          <Typography variant="h5" gutterBottom>
            料金
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="beer_price"
                label="ビール料金"
                type="number"
                value={restaurant.beer_price || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="chuhai_price"
                label="酎ハイ料金"
                type="number"
                value={restaurant.chuhai_price || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="beer_types"
                label="ビールの種類"
                value={restaurant.beer_types || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h5" gutterBottom>
            特徴
          </Typography>

          {/* 楽しみ方 */}
          <Typography variant="h6" gutterBottom>
            楽しみ方
          </Typography>
          <FeatureEditItem
            icon={SportsBar}
            label="せんべろセット"
            isActive={restaurant.has_set}
            description={restaurant.senbero_description}
            onChangeActive={handleCheckboxChange('has_set')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="ハッピーアワー"
            isActive={restaurant.has_happy_hour}
            onChangeActive={handleCheckboxChange('has_happy_hour')}
          />
          <FeatureEditItem
            icon={Casino}
            label="チンチロ"
            isActive={restaurant.has_chinchiro}
            description={restaurant.chinchiro_description}
            onChangeActive={handleCheckboxChange('has_chinchiro')}
            onChangeDescription={(e) => handleInputChange(e)}
          />

          <Divider sx={{ my: 2 }} />

          {/* 時間 */}
          <Typography variant="h6" gutterBottom>
            時間
          </Typography>
          <FeatureEditItem
            icon={WbSunny}
            label="朝飲み"
            isActive={restaurant.morning_available}
            onChangeActive={handleCheckboxChange('morning_available')}
          />
          <FeatureEditItem
            icon={LocalBar}
            label="昼飲み"
            isActive={restaurant.daytime_available}
            onChangeActive={handleCheckboxChange('daytime_available')}
          />

          <Divider sx={{ my: 2 }} />

          {/* 雰囲気 */}
          <Typography variant="h6" gutterBottom>
            雰囲気
          </Typography>
          <FeatureEditItem
            icon={Deck}
            label="外飲み"
            isActive={restaurant.outside_available}
            description={restaurant.outside_description}
            onChangeActive={handleCheckboxChange('outside_available')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="立ち飲み"
            isActive={restaurant.is_standing}
            description={restaurant.standing_description}
            onChangeActive={handleCheckboxChange('is_standing')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={LocalBar}
            label="角打ち"
            isActive={restaurant.is_kakuuchi}
            onChangeActive={handleCheckboxChange('is_kakuuchi')}
          />

          <Divider sx={{ my: 2 }} />

          {/* 支払い */}
          <Typography variant="h6" gutterBottom>
            支払い
          </Typography>
          <FeatureEditItem
            icon={AttachMoney}
            label="キャッシュオン"
            isActive={restaurant.is_cash_on}
            onChangeActive={handleCheckboxChange('is_cash_on')}
          />
          <FeatureEditItem
            icon={AttachMoney}
            label="チャージあり"
            isActive={restaurant.has_charge}
            description={restaurant.charge_description}
            onChangeActive={handleCheckboxChange('has_charge')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={Payments}
            label="クレジットカード利用可"
            isActive={restaurant.credit_card}
            description={restaurant.credit_card_description}
            onChangeActive={handleCheckboxChange('credit_card')}
            onChangeDescription={(e) => handleInputChange(e)}
          />

          <Divider sx={{ my: 2 }} />

          {/* その他 */}
          <Typography variant="h6" gutterBottom>
            その他
          </Typography>
          <FeatureEditItem
            icon={Tv}
            label="TV設置"
            isActive={restaurant.has_tv}
            onChangeActive={handleCheckboxChange('has_tv')}
          />
          <FeatureEditItem
            icon={SmokingRooms}
            label="喫煙可"
            isActive={restaurant.smoking_allowed}
            onChangeActive={handleCheckboxChange('smoking_allowed')}
          />

          <TextField
            fullWidth
            margin="normal"
            name="special_rule"
            label="特別ルール"
            value={restaurant.special_rule || ''}
            onChange={(e) => handleInputChange(e)}
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            {isNew ? 'Create Restaurant' : 'Update Restaurant'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};