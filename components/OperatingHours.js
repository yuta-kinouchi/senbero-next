import {
  Box,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import React from 'react';

const OperatingHours = ({ restaurant }) => {
  const groupedHours = restaurant.operating_hours.reduce((acc, hour) => {
    if (!acc[hour.day_of_week]) {
      acc[hour.day_of_week] = [];
    }
    acc[hour.day_of_week].push(hour);
    return acc;
  }, {});


  const getDayName = (dayNumber) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayNumber] + '曜日';
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
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
