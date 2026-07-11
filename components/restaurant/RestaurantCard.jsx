import { AccessTime, DirectionsRun, Place } from "@mui/icons-material";
import { Box, Card, CardContent, Fab, Typography } from '@mui/material';
import Image from 'next/image';
import { getTodayOperatingHours } from '../../utils/dateUtils';


export const RestaurantCard = ({ restaurant, onClick }) => {
  const handleMapClick = (e) => {
    e.stopPropagation();
  };

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    restaurant.name
  )}`;

  return (
    <Card
      className="flex flex-row overflow-hidden cursor-pointer"
      onClick={() => onClick(restaurant.restaurant_id)}
      sx={{ position: 'relative'}}
    >
      {/* Restaurant Image */}
      <Box className="w-32" sx={{ position: 'relative', width: 128, height: 200, flexShrink: 0 }}>
        <Image
          src={restaurant.restaurant_image || '/default-restaurant-image.jpg'}
          alt={restaurant.name}
          fill
          sizes="128px"
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Restaurant Details */}
      <Box className="flex-1">
      <CardContent>
        <Typography variant="h6" component="div">
          {restaurant.name}
        </Typography>
        <Box sx={{ marginTop: 1 }}>
          <Box display="flex" alignItems="center">
            <AccessTime sx={{ marginRight: 1 }} />
            <Typography variant="body2">
              営業時間：{getTodayOperatingHours(restaurant.operating_hours)}
            </Typography>
          </Box>
          {restaurant.distance != null && (
            <Box display="flex" alignItems="center" mt={2}>
              <DirectionsRun sx={{ marginRight: 1 }} />
              <Typography variant="body2">
                距離：{restaurant.distance.toFixed(2)} km
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

        {/* Map Button */}
        <Fab
          color="primary"
          href={mapSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={handleMapClick}
        >
          <Place />
        </Fab>
      </Box>
    </Card>
  );
};