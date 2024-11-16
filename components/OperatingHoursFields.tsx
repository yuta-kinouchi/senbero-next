import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

export interface OperatingHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  drink_last_order_time?: string;
  food_last_order_time?: string;
  happy_hour_start?: string;
  happy_hour_end?: string;
}

interface OperatingHoursProps {
  operatingHours?: OperatingHour[];
  onChange: (hours: OperatingHour[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
] as const;

export const OperatingHoursFields: React.FC<OperatingHoursProps> = ({ operatingHours = [], onChange }) => {
  const handleAddHours = () => {
    const newHours: OperatingHour = {
      day_of_week: 1,
      open_time: '',
      close_time: '',
      drink_last_order_time: '',
      food_last_order_time: '',
      happy_hour_start: '',
      happy_hour_end: '',
    };
    onChange([...operatingHours, newHours]);
  };

  const handleRemoveHours = (index: number) => {
    const newHours = [...operatingHours];
    newHours.splice(index, 1);
    onChange(newHours);
  };

  const handleChange = (index: number, field: keyof OperatingHour, value: string | number) => {
    const newHours = [...operatingHours];
    newHours[index] = {
      ...newHours[index],
      [field]: value,
    };
    onChange(newHours);
  };

  const handleDayChange = (index: number, event: SelectChangeEvent<number>) => {
    handleChange(index, 'day_of_week', Number(event.target.value));
  };

  const formatTime = (timeStr: string | undefined): string => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleTimeChange = (index: number, field: keyof OperatingHour, time: string) => {
    if (!time) {
      handleChange(index, field, '');
      return;
    }
    const [hours, minutes] = time.split(':');
    const dateStr = `2024-01-01T${hours}:${minutes}:00`;
    handleChange(index, field, dateStr);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        営業時間
      </Typography>
      
      {operatingHours.map((hours, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Select
                  value={hours.day_of_week}
                  onChange={(e) => handleDayChange(index, e)}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="開店時間"
                type="time"
                value={formatTime(hours.open_time)}
                onChange={(e) => handleTimeChange(index, 'open_time', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="閉店時間"
                type="time"
                value={formatTime(hours.close_time)}
                onChange={(e) => handleTimeChange(index, 'close_time', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ドリンクラストオーダー"
                type="time"
                value={formatTime(hours.drink_last_order_time)}
                onChange={(e) => handleTimeChange(index, 'drink_last_order_time', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="フードラストオーダー"
                type="time"
                value={formatTime(hours.food_last_order_time)}
                onChange={(e) => handleTimeChange(index, 'food_last_order_time', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="ハッピーアワー開始"
                type="time"
                value={formatTime(hours.happy_hour_start)}
                onChange={(e) => handleTimeChange(index, 'happy_hour_start', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="ハッピーアワー終了"
                type="time"
                value={formatTime(hours.happy_hour_end)}
                onChange={(e) => handleTimeChange(index, 'happy_hour_end', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => handleRemoveHours(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddHours}
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
      >
        営業時間を追加
      </Button>
    </Box>
  );
};