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
      sx={{
        position: 'relative',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(42, 32, 25, 0.14)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Restaurant Image */}
      <Box sx={{ position: 'relative', width: 112, height: 144, flexShrink: 0 }}>
        <Image
          src={restaurant.restaurant_image || '/default-restaurant-image.jpg'}
          alt={restaurant.name}
          fill
          sizes="112px"
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Restaurant Details */}
      <Box className="flex-1" sx={{ minWidth: 0 }}>
        <CardContent sx={{ py: 1.5, pr: 8 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}
          >
            {restaurant.name}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ color: 'text.secondary' }}>
            <AccessTime sx={{ mr: 0.75, fontSize: 18 }} />
            <Typography variant="body2">
              {getTodayOperatingHours(restaurant.operating_hours)}
            </Typography>
          </Box>
          {restaurant.distance != null && (
            <Box display="flex" alignItems="center" mt={0.5} sx={{ color: 'text.secondary' }}>
              <DirectionsRun sx={{ mr: 0.75, fontSize: 18 }} />
              <Typography variant="body2">
                {restaurant.distance.toFixed(2)} km
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Map Button */}
        <Fab
          color="primary"
          size="small"
          href={mapSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ position: 'absolute', bottom: 12, right: 12, boxShadow: 'none' }}
          onClick={handleMapClick}
        >
          <Place fontSize="small" />
        </Fab>
      </Box>
    </Card>
  );
};