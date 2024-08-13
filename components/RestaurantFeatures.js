import {
  AttachMoney,
  DirectionsWalk,
  OutdoorGrill,
  SmokingRooms,
  Tv
} from '@mui/icons-material';
import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import {
  Box,
  Divider,
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

const RestaurantFeatures = ({ restaurant }) => (
  <Box>

    <FeatureItem
      icon={DirectionsWalk}
      label="立ち飲み"
      isActive={restaurant.is_standing}
      description={restaurant.standing_description}
    />
    <Divider />

    <FeatureItem
      icon={SportsBarRoundedIcon}
      label="せんべろセット"
      isActive={Boolean(restaurant.has_set)}
      description={restaurant.senbero_description}
    />
    <Divider />

    <FeatureItem
      icon={SportsBarRoundedIcon}
      label="チンチロ"
      isActive={restaurant.has_chinchiro}
      description={restaurant.chinchiro_description}
    />
    <Divider />

    <FeatureItem
      icon={SportsBarRoundedIcon}
      label="ハッピーアワー"
      isActive={restaurant.has_happy_hour}
    />
    <Divider />

    <FeatureItem
      icon={OutdoorGrill}
      label="外飲み"
      isActive={restaurant.outside_available}
      description={restaurant.outside_description}
    />
    <Divider />

    <FeatureItem
      icon={AttachMoney}
      label="キャッシュオン"
      isActive={restaurant.is_cash_on}
    />
    <Divider />

    <FeatureItem
      icon={AttachMoney}
      label="チャージ"
      isActive={restaurant.has_charge}
      description={restaurant.charge_description}
    />
    <Divider />

    <FeatureItem
      icon={Tv}
      label="TV設置"
      isActive={restaurant.has_tv}
    />
    <Divider />

    <FeatureItem
      icon={SmokingRooms}
      label="喫煙"
      isActive={restaurant.smoking_allowed}
    />

    {restaurant.special_rule && (
      <>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Special Rules:</Typography>
          <Typography variant="body2">{restaurant.special_rule}</Typography>
        </Box>
      </>
    )}
  </Box>
);

export default RestaurantFeatures;