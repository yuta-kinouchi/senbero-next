import { Box, Divider, Grid, Typography } from '@mui/material';

interface OperatingHour {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  drink_last_order_time?: string;
  food_last_order_time?: string;
  happy_hour_start?: string;
  happy_hour_end?: string;
}

interface Restaurant {
  operating_hours: OperatingHour[];
}

interface OperatingHoursProps {
  restaurant: Restaurant;
}

const OperatingHours: React.FC<OperatingHoursProps> = ({ restaurant }) => {
  const groupedHours = restaurant.operating_hours.reduce((acc, hour) => {
    if (!acc[hour.day_of_week]) {
      acc[hour.day_of_week] = [];
    }
    acc[hour.day_of_week].push(hour);
    return acc;
  }, {} as Record<string, OperatingHour[]>);

  const getDayName = (dayNumber: number): string => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayNumber] + '曜日';
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    try {
      const jstOffset = 9 * 60 * 60 * 1000;
      const date = new Date(new Date(timeString).getTime() - jstOffset);
      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tokyo'
      });
    } catch (error) {
      console.error("Invalid time format:", timeString);
      return "";
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>営業時間</Typography>
      {Object.entries(groupedHours).length > 0 ? (
        Object.entries(groupedHours)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([dayOfWeek, hours]) => (
            <Box key={dayOfWeek} sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="body2">{getDayName(parseInt(dayOfWeek))}</Typography>
                </Grid>
                <Grid item xs={8}>
                  {hours.map((hour, index) => (
                    <Box key={hour.id} sx={{ mb: index !== hours.length - 1 ? 1 : 0 }}>
                      <Typography variant="body2">
                        {formatTime(hour.open_time)} - {formatTime(hour.close_time)}
                      </Typography>
                      {(hour.drink_last_order_time || hour.food_last_order_time) && (
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                          {hour.drink_last_order_time && `ドリンクL.O. ${formatTime(hour.drink_last_order_time)}`}
                          {hour.drink_last_order_time && hour.food_last_order_time && ' / '}
                          {hour.food_last_order_time && `フードL.O. ${formatTime(hour.food_last_order_time)}`}
                        </Typography>
                      )}
                      {(hour.happy_hour_start && hour.happy_hour_end) && (
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'success.main' }}>
                          ハッピーアワー: {formatTime(hour.happy_hour_start)} - {formatTime(hour.happy_hour_end)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Grid>
              </Grid>
              {parseInt(dayOfWeek) !== 6 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
      ) : (
        <Typography variant="body2">営業時間情報がありません</Typography>
      )}
    </Box>
  );
};

export default OperatingHours;