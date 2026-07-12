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
import LocationSection from './LocationSection';

const FeatureEditItem = ({ icon: Icon, label, isActive, description, descriptionName, onChangeActive, onChangeDescription }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ m: 2, color: isActive ? 'primary.main' : 'action.disabled' }}>
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
      {descriptionName !== undefined && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          name={descriptionName}
          placeholder="詳細(任意)"
          value={description || ''}
          onChange={onChangeDescription}
          disabled={!isActive}
        />
      )}
    </Box>
  </Box>
);

const RestaurantEdit = ({
  restaurant,
  handleInputChange,
  handleSubmit,
  handleCheckboxChange,
  handleFileChange,
  applyFields,
  imagePreview
}) => {
  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {restaurant.name} の編集
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
                name="signature_menu"
                label="名物メニュー(例: ハムカツ)"
                value={restaurant.signature_menu || ''}
                onChange={(e) => handleInputChange(e)}
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
                  画像を選択
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

          {/* 場所(GPS取得つき) */}
          <LocationSection
            restaurant={restaurant}
            onInputChange={handleInputChange}
            onApplyFields={applyFields}
          />

          <Divider sx={{ my: 3 }} />

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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="set_price"
                label="せんべろセット価格"
                type="number"
                value={restaurant.set_price || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            descriptionName="senbero_description"
            onChangeActive={handleCheckboxChange('has_set')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="ハッピーアワー"
            isActive={restaurant.has_happy_hour}
            description={restaurant.happy_hour_description}
            descriptionName="happy_hour_description"
            onChangeActive={handleCheckboxChange('has_happy_hour')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={Casino}
            label="チンチロ"
            isActive={restaurant.has_chinchiro}
            description={restaurant.chinchiro_description}
            descriptionName="chinchiro_description"
            onChangeActive={handleCheckboxChange('has_chinchiro')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="ホッピーあり"
            isActive={restaurant.has_hoppy}
            onChangeActive={handleCheckboxChange('has_hoppy')}
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
            descriptionName="outside_description"
            onChangeActive={handleCheckboxChange('outside_available')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="立ち飲み"
            isActive={restaurant.is_standing}
            description={restaurant.standing_description}
            descriptionName="standing_description"
            onChangeActive={handleCheckboxChange('is_standing')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={LocalBar}
            label="角打ち"
            isActive={restaurant.is_kakuuchi}
            onChangeActive={handleCheckboxChange('is_kakuuchi')}
          />
          <FeatureEditItem
            icon={SportsBar}
            label="一人飲み歓迎"
            isActive={restaurant.solo_friendly}
            onChangeActive={handleCheckboxChange('solo_friendly')}
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
            descriptionName="charge_description"
            onChangeActive={handleCheckboxChange('has_charge')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={Payments}
            label="クレジットカード利用可"
            isActive={restaurant.credit_card}
            description={restaurant.credit_card_description}
            descriptionName="credit_card_description"
            onChangeActive={handleCheckboxChange('credit_card')}
            onChangeDescription={(e) => handleInputChange(e)}
          />
          <FeatureEditItem
            icon={Payments}
            label="QRコード決済可"
            isActive={restaurant.qr_payment}
            onChangeActive={handleCheckboxChange('qr_payment')}
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

          {/* スマホで長いフォームでも常に保存できるよう画面下部に固定 */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.paper',
              py: 1.5,
              mt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              zIndex: 1,
            }}
          >
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              保存する
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantEdit;