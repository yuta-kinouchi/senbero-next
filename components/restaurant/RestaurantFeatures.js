import {
  Casino,
  Deck,
  LocalDrink,
  Payments,
  SmokingRooms,
  SportsBar,
  Tv,
} from '@mui/icons-material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {
  Box,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { palette } from '@/styles/theme';

const FeatureItem = ({ icon: Icon, label, isActive, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
    <Box sx={{ mr: 2, color: isActive ? 'primary.main' : 'action.disabled' }}>
      <Icon fontSize="large" />
    </Box>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1" component="div">
        {label}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  </Box>
);

const PriceItem = ({ icon: Icon, label, price }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      p: 2,
    }}
  >
    <Box
      sx={{
        bgcolor: palette.amberSoft,
        color: 'primary.main',
        borderRadius: '50%',
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <Icon fontSize="medium" />
    </Box>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" component="div" sx={{ mt: 0.5, fontWeight: 700 }}>
      ¥{price}
    </Typography>
  </Box>
);

const featureCategories = [
  {
    category: "楽しみ方",
    items: [
      { name: 'has_set', label: 'せんべろセット', icon: SportsBar, descriptionKey: 'senbero_description' },
      { name: 'has_happy_hour', label: 'ハッピーアワー', icon: SportsBar, descriptionKey: 'happy_hour_description' },
      { name: 'has_chinchiro', label: 'チンチロ', icon: Casino, descriptionKey: 'chinchiro_description' },
      { name: 'has_hoppy', label: 'ホッピー', icon: SportsBar },
    ]
  },
  {
    category: "時間",
    items: [
      { name: 'morning_available', label: '朝飲み', icon: SportsBar },
      { name: 'daytime_available', label: '昼飲み', icon: SportsBar },
    ]
  },
  {
    category: "雰囲気",
    items: [
      { name: 'outside_available', label: '外飲み', icon: Deck, descriptionKey: 'outside_description' },
      { name: 'is_standing', label: '立ち飲み', icon: SportsBar, descriptionKey: 'standing_description' },
      { name: 'is_kakuuchi', label: '角打ち', icon: SportsBar },
      { name: 'solo_friendly', label: '一人飲み歓迎', icon: SportsBar },
    ]
  },
  {
    category: "支払い",
    items: [
      { name: 'is_cash_on', label: 'キャッシュオン', icon: Payments },
      { name: 'has_charge', label: 'チャージ', icon: Payments, descriptionKey: 'charge_description' },
      { name: 'credit_card', label: 'クレカ利用可能', icon: CreditCardIcon, descriptionKey: 'credit_card_description' },
      { name: 'qr_payment', label: 'QRコード決済', icon: Payments },
    ]
  },
  {
    category: "その他",
    items: [
      { name: 'has_tv', label: 'TV設置', icon: Tv },
      { name: 'smoking_allowed', label: '喫煙可', icon: SmokingRooms },
    ]
  },
];

const RestaurantFeatures = ({ restaurant }) => (
  <Box>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        料金
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <PriceItem
            icon={SportsBar}
            label="ビール"
            price={restaurant.beer_price || "未設定"}
          />
        </Grid>
        <Grid item xs={4}>
          <PriceItem
            icon={LocalDrink}
            label="酎ハイ"
            price={restaurant.chuhai_price || "未設定"}
          />
        </Grid>
        <Grid item xs={4}>
          <PriceItem
            icon={SportsBar}
            label="せんべろセット"
            price={restaurant.set_price || "未設定"}
          />
        </Grid>
      </Grid>
    </Box>

    {restaurant.signature_menu && (
      <>
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>名物</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {restaurant.signature_menu}
          </Typography>
        </Box>
      </>
    )}

    <Divider sx={{ my: 3 }} />

    {featureCategories.map((category, index) => (
      <Box key={category.category}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {category.category}
        </Typography>
        {category.items.map((item) => (
          <React.Fragment key={item.name}>
            <FeatureItem
              icon={item.icon}
              label={item.label}
              isActive={Boolean(restaurant[item.name])}
              description={item.descriptionKey ? restaurant[item.descriptionKey] : undefined}
            />
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    ))}

    {restaurant.special_rule && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">特別ルール</Typography>
        <Typography variant="body2">{restaurant.special_rule}</Typography>
      </Box>
    )}
  </Box>
);

export default RestaurantFeatures;