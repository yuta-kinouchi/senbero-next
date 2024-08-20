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

const FeatureItem = ({ icon: Icon, label, isActive, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
    <Box sx={{ mr: 2, color: isActive ? '#ffc107' : 'action.disabled' }}>
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
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', m: 2 }}>
    <Icon fontSize="large" sx={{ color: '#ffc107', mb: 1 }} />
    <Typography variant="subtitle1" component="div">
      {label}
    </Typography>
    <Typography variant="h6" component="div" sx={{ mt: 1 }}>
      ¥{price}
    </Typography>
  </Box>
);

const featureCategories = [
  {
    category: "楽しみ方",
    items: [
      { name: 'has_set', label: 'せんべろセット', icon: SportsBar },
      { name: 'has_happy_hour', label: 'ハッピーアワー', icon: SportsBar },
      { name: 'has_chinchiro', label: 'チンチロ', icon: Casino },
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
      { name: 'outside_available', label: '外飲み', icon: Deck },
      { name: 'is_standing', label: '立ち飲み', icon: SportsBar },
      { name: 'is_kakuuchi', label: '角打ち', icon: SportsBar },
    ]
  },
  {
    category: "支払い",
    items: [
      { name: 'is_cash_on', label: 'キャッシュオン', icon: Payments },
      { name: 'has_charge', label: 'チャージ', icon: Payments },
      { name: 'credit_card', label: 'クレカ利用可能', icon: CreditCardIcon },
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
        <Grid item xs={6}>
          <PriceItem
            icon={LocalDrink}
            label="ビール"
            price={restaurant.beer_price || "未設定"}
          />
        </Grid>
        <Grid item xs={6}>
          <PriceItem
            icon={LocalDrink}
            label="酎ハイ"
            price={restaurant.chuhai_price || "未設定"}
          />
        </Grid>
      </Grid>
    </Box>

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
              description={restaurant[`${item.name}_description`]}
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