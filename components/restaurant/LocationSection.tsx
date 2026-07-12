import { Restaurant } from '@/types/restaurant';
import { MyLocation } from '@mui/icons-material';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface LocationSectionProps {
  restaurant: Partial<Restaurant>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // GPS取得結果など複数フィールドをまとめて反映する
  onApplyFields: (fields: Partial<Restaurant>) => void;
}

// 店に居ながらスマホで登録する運用を想定し、
// 現在地(GPS)から緯度経度を自動入力できるようにする。
// 住所はOpenStreetMap(Nominatim)の逆ジオコーディングでベストエフォート補完。
const LocationSection: React.FC<LocationSectionProps> = ({ restaurant, onInputChange, onApplyFields }) => {
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<{ severity: 'success' | 'warning' | 'error'; text: string } | null>(null);

  const handleUseCurrentLocation = async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setMessage({ severity: 'error', text: 'この端末では位置情報が利用できません' });
      return;
    }

    setLocating(true);
    setMessage(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      onApplyFields({ latitude, longitude });

      // 逆ジオコーディング(失敗しても緯度経度は入っているので致命的でない)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ja`
        );
        if (res.ok) {
          const data = await res.json();
          const a = data.address || {};
          const state = a.province || a.state || '';
          const city = a.city || a.town || a.village || a.county || '';
          const line1 = [a.suburb, a.neighbourhood, a.quarter].find(Boolean) || '';
          onApplyFields({
            country: restaurant.country || '日本',
            ...(state ? { state } : {}),
            ...(city ? { city } : {}),
            ...(line1 && !restaurant.address_line1 ? { address_line1: line1 } : {}),
          });
          setMessage({ severity: 'success', text: '現在地を取得しました。番地などは手で補正してください。' });
        } else {
          setMessage({ severity: 'warning', text: '緯度経度を取得しました。住所は手入力してください。' });
        }
      } catch {
        setMessage({ severity: 'warning', text: '緯度経度を取得しました。住所は手入力してください。' });
      }
    } catch {
      setMessage({ severity: 'error', text: '位置情報を取得できませんでした。設定で位置情報の利用を許可してください。' });
    } finally {
      setLocating(false);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        場所
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<MyLocation />}
        onClick={handleUseCurrentLocation}
        disabled={locating}
        sx={{ mb: 1 }}
      >
        {locating ? '取得中...' : '現在地から位置情報を取得'}
      </Button>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
        お店の中・前でタップすると、イマココ検索に必要な緯度経度が自動で入ります。
      </Typography>
      {message && (
        <Alert severity={message.severity} sx={{ mb: 1 }}>
          {message.text}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            margin="normal"
            name="latitude"
            label="緯度"
            type="number"
            inputProps={{ step: 'any' }}
            value={restaurant.latitude ?? ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            margin="normal"
            name="longitude"
            label="経度"
            type="number"
            inputProps={{ step: 'any' }}
            value={restaurant.longitude ?? ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            margin="normal"
            name="state"
            label="都道府県"
            value={restaurant.state || ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            margin="normal"
            name="city"
            label="市区町村"
            value={restaurant.city || ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            name="address_line1"
            label="住所1(町名)"
            value={restaurant.address_line1 || ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            name="address_line2"
            label="住所2(番地・ビル名)"
            value={restaurant.address_line2 || ''}
            onChange={onInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            name="nearest_station"
            label="最寄り駅(例: JR錦糸町駅 徒歩3分)"
            value={restaurant.nearest_station || ''}
            onChange={onInputChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LocationSection;
