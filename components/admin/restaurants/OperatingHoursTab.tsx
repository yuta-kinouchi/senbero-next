import { OperatingHour } from '@/types/restaurant';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

// 曜日の配列
const DAYS_OF_WEEK = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
];

// 空の営業時間の初期値
const emptyOperatingHour: Partial<OperatingHour> = {
  day_of_week: 1, // デフォルトは月曜日
  open_time: new Date('2000-01-01T10:00:00'),
  close_time: new Date('2000-01-01T22:00:00'),
};

// DetailページのformatTime関数を移植
// 時刻のフォーマット (00:00 形式)
const formatTime = (timeString: Date | string | null | undefined): string => {
  if (!timeString) return '';

  try {
    const date = typeof timeString === 'string' ? new Date(timeString) : timeString;
    // JSTオフセットを調整（9時間）
    const jpTime = new Date(date.getTime() - (9 * 60 * 60 * 1000));
    return jpTime.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    console.error('Time parsing error:', e);
    return '';
  }
};

// 文字列からDateに変換する関数
const parseTimeInput = (timeStr: string): Date | undefined => {
  if (!timeStr) return undefined;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // JSTオフセットを考慮して調整（APIに送信する際にUTC変換されるため）
  const jstOffset = 9 * 60 * 60 * 1000;
  return new Date(date.getTime() + jstOffset);
};

interface OperatingHoursTabProps {
  operatingHours: OperatingHour[];
  onChange: (hours: OperatingHour[]) => void;
}

const OperatingHoursTab: React.FC<OperatingHoursTabProps> = ({ operatingHours, onChange }) => {
  // 営業時間の追加
  const handleAddOperatingHour = () => {
    const newHour = {
      ...emptyOperatingHour,
      id: Math.floor(Math.random() * -1000000), // 仮のマイナスIDを設定（新規アイテム識別用）
      restaurant_id: operatingHours[0]?.restaurant_id || 0,
    } as OperatingHour;

    onChange([...operatingHours, newHour]);
  };

  // 営業時間の削除
  const handleRemoveOperatingHour = (index: number) => {
    const updatedHours = [...operatingHours];
    updatedHours.splice(index, 1);
    onChange(updatedHours);
  };

  // 営業時間の変更
  const handleOperatingHourChange = (index: number, field: keyof OperatingHour, value: any) => {
    const updatedHours = [...operatingHours];

    // 時間フィールドの場合は文字列からDateに変換
    if (['open_time', 'close_time', 'drink_last_order_time', 'food_last_order_time', 'happy_hour_start', 'happy_hour_end'].includes(field)) {
      if (value) {
        updatedHours[index][field] = parseTimeInput(value) as any;
      } else {
        updatedHours[index][field] = null as any;
      }
    } else {
      updatedHours[index][field] = value as any;
    }

    onChange(updatedHours);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="営業時間"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOperatingHour}
                color="primary"
              >
                営業時間を追加
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {operatingHours.length === 0 ? (
              <Typography color="textSecondary" align="center">
                営業時間情報がありません。「営業時間を追加」ボタンをクリックして追加してください。
              </Typography>
            ) : (
              operatingHours.map((hour, index) => (
                <Box key={hour.id || index} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">営業時間 #{index + 1}</Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveOperatingHour(index)}
                          aria-label="削除"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel id={`day-of-week-label-${index}`}>曜日</InputLabel>
                        <Select
                          labelId={`day-of-week-label-${index}`}
                          value={hour.day_of_week}
                          label="曜日"
                          onChange={(e) => handleOperatingHourChange(index, 'day_of_week', e.target.value)}
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                              {day.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="開店時間"
                        type="time"
                        value={formatTime(hour.open_time)}
                        onChange={(e) => handleOperatingHourChange(index, 'open_time', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="閉店時間"
                        type="time"
                        value={formatTime(hour.close_time)}
                        onChange={(e) => handleOperatingHourChange(index, 'close_time', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1">ラストオーダー</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ドリンクラストオーダー"
                        type="time"
                        value={formatTime(hour.drink_last_order_time)}
                        onChange={(e) => handleOperatingHourChange(index, 'drink_last_order_time', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="フードラストオーダー"
                        type="time"
                        value={formatTime(hour.food_last_order_time)}
                        onChange={(e) => handleOperatingHourChange(index, 'food_last_order_time', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1">ハッピーアワー</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ハッピーアワー開始"
                        type="time"
                        value={formatTime(hour.happy_hour_start)}
                        onChange={(e) => handleOperatingHourChange(index, 'happy_hour_start', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ハッピーアワー終了"
                        type="time"
                        value={formatTime(hour.happy_hour_end)}
                        onChange={(e) => handleOperatingHourChange(index, 'happy_hour_end', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5分間隔
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OperatingHoursTab;