import { AccessTime, DirectionsRun, Place, RestaurantMenu } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Fab, Typography } from '@mui/material';
import Image from 'next/image';
import { palette } from '../../styles/theme';
import { getTodayOperatingHours } from '../../utils/dateUtils';
import { FEATURE_TAGS, walkMinutes } from '../../utils/features';


// href を渡すと店名が実リンク(<a>)になり、クローラーが詳細ページを辿れる
export const RestaurantCard = ({ restaurant, onClick, href = '' }) => {
  const activeTags = FEATURE_TAGS.filter((tag) => restaurant[tag.key]);

  const handleMapClick = (e) => {
    e.stopPropagation();
  };

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    restaurant.name
  )}`;

  return (
    <Card
      onClick={() => onClick(restaurant.restaurant_id)}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(42, 32, 25, 0.14)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Restaurant Image */}
      <Box sx={{ position: 'relative', width: 112, minHeight: 144, flexShrink: 0, alignSelf: 'stretch' }}>
        <Image
          src={restaurant.restaurant_image || '/default-restaurant-image.jpg'}
          alt={restaurant.name}
          fill
          sizes="112px"
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Restaurant Details */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <CardContent sx={{ py: 1.5, pr: 8 }}>
          <Typography
            variant="subtitle1"
            component={href ? 'a' : 'div'}
            href={href || undefined}
            sx={{
              display: 'block',
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {restaurant.name}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ color: 'text.secondary' }}>
            <AccessTime sx={{ mr: 0.75, fontSize: 18 }} />
            <Typography variant="body2">
              {getTodayOperatingHours(restaurant.operating_hours)}
            </Typography>
          </Box>
          {restaurant.signature_menu && (
            <Box display="flex" alignItems="center" mt={0.5} sx={{ color: 'text.secondary' }}>
              <RestaurantMenu sx={{ mr: 0.75, fontSize: 18 }} />
              <Typography variant="body2" noWrap>
                名物: {restaurant.signature_menu}
              </Typography>
            </Box>
          )}
          {restaurant.distance != null && (
            <Box display="flex" alignItems="center" mt={0.5} sx={{ color: 'text.secondary' }}>
              <DirectionsRun sx={{ mr: 0.75, fontSize: 18 }} />
              <Typography variant="body2">
                {walkMinutes(restaurant.distance) <= 60
                  ? `徒歩${walkMinutes(restaurant.distance)}分（${restaurant.distance.toFixed(1)}km）`
                  : `${restaurant.distance.toFixed(1)}km`}
              </Typography>
            </Box>
          )}
          {activeTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {activeTags.map((tag) => (
                <Chip
                  key={tag.key}
                  label={tag.label}
                  size="small"
                  sx={{
                    bgcolor: palette.amberSoft,
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              ))}
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