import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import {
  Alert,
  Box, Button,
  Checkbox,
  Container, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SearchForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSearching, setIsSearching] = useState(false);
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [features, setFeatures] = useState({
    morning_available: false,
    daytime_available: false,
    has_set: false,
    has_chinchiro: false,
    outside_available: false,
    is_standing: false,
    is_kakuuchi: false,
    is_cash_on: false,
    has_charge: false,
    has_tv: false,
    smoking_allowed: false,
    has_happy_hour: false,
  });

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const handleSearch = () => {
    if (locationPermission === 'denied') {
      setOpenLocationDialog(true);
      return;
    }
    router.push('/restaurant-list');
  };

  const handleFeatureDialogOpen = () => {
    setOpenFeatureDialog(true);
  };

  const handleFeatureDialogClose = () => {
    setOpenFeatureDialog(false);
  };

  const handleFeatureChange = (event) => {
    setFeatures({ ...features, [event.target.name]: event.target.checked });
  };

  const handleFeatureSearch = async () => {
    const selectedFeatures = Object.entries(features)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    try {
      const response = await fetch('/api/search-by-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: selectedFeatures }),
      });

      if (!response.ok) {
        throw new Error('Failed to search by features');
      }

      router.push('/restaurant-list');
    } catch (error) {
      console.error('Error searching by features:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }

    handleFeatureDialogClose();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLocationDialogClose = () => {
    setOpenLocationDialog(false);
  };

  return (
    <Container fixed>
      <Typography
        align="center"
        variant="h5"
        sx={{
          color: "white",
          margin: "48px 0px 24px 0px",
          fontSize: isMobile ? "20px" : "24px",
        }}
      >
        せんべろ好きのための検索サイト
      </Typography>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
      >
        <SportsBarRoundedIcon style={{ fontSize: 80, color: "white" }} />
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontSize: isMobile ? "28px" : "48px",
            marginLeft: isMobile ? "0px" : "10px",
            marginTop: isMobile ? "10px" : "0px",
          }}
        >
          せんべろCheers
        </Typography>
      </Box>
      <Typography
        align="center"
        variant="h4"
        sx={{
          color: "white",
          margin: "60px 0px 12px 0px",
          fontSize: isMobile ? "20px" : "32px",
        }}
      >
        イマココ検索とは？
      </Typography>
      <Typography
        align="center"
        sx={{
          color: "white",
          fontSize: isMobile ? "14px" : "18px",
          margin: "0px 0px 48px 0px",
        }}
      >
        次のお店はどこにしようか？
        <br />
        お店探しもはしご酒の醍醐味
        <br />
        そんなあなたへ送るはしご酒専用検索機能
        <br />
        「イマ」営業中の居酒屋を
        <br />
        「ココ」から近い順に表示します。
        <br />
        <br />
        新しいお店との出会いに乾杯
      </Typography>
      <Box
        sx={{
          backgroundColor: "lightyellow",
          border: "1px solid yellow",
          padding: "16px",
          marginTop: "20px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: isMobile ? "12px" : "16px",
          }}
        >
          ※このアプリは位置情報を使用します。機能を利用する際には位置情報の使用許可が必要になります。
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{
            fontSize: isMobile ? "14px" : "16px",
            padding: isMobile ? "8px 16px" : "12px 24px",
            borderRadius: "8px",
            marginRight: "10px",
          }}
        >
          検索する
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleFeatureDialogOpen}
          sx={{
            fontSize: isMobile ? "14px" : "16px",
            padding: isMobile ? "8px 16px" : "12px 24px",
            borderRadius: "8px",
          }}
        >
          特徴から検索
        </Button>
      </Box>

      <Dialog open={openFeatureDialog} onClose={handleFeatureDialogClose}>
        <DialogTitle>特徴から検索</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={features.morning_available} onChange={handleFeatureChange} name="morning_available" />}
            label="朝飲み"
          />
          <FormControlLabel
            control={<Checkbox checked={features.daytime_available} onChange={handleFeatureChange} name="daytime_available" />}
            label="昼飲み"
          />
          <FormControlLabel
            control={<Checkbox checked={features.has_set} onChange={handleFeatureChange} name="has_set" />}
            label="せんべろセット"
          />
          <FormControlLabel
            control={<Checkbox checked={features.has_chinchiro} onChange={handleFeatureChange} name="has_chinchiro" />}
            label="チンチロリン"
          />
          <FormControlLabel
            control={<Checkbox checked={features.outside_available} onChange={handleFeatureChange} name="outside_available" />}
            label="外飲み"
          />
          <FormControlLabel
            control={<Checkbox checked={features.is_standing} onChange={handleFeatureChange} name="is_standing" />}
            label="立ち飲み"
          />
          <FormControlLabel
            control={<Checkbox checked={features.is_kakuuchi} onChange={handleFeatureChange} name="is_kakuuchi" />}
            label="角打ち"
          />
          <FormControlLabel
            control={<Checkbox checked={features.is_cash_on} onChange={handleFeatureChange} name="is_cash_on" />}
            label="キャッシュオン"
          />
          <FormControlLabel
            control={<Checkbox checked={features.has_charge} onChange={handleFeatureChange} name="has_charge" />}
            label="チャージあり"
          />
          <FormControlLabel
            control={<Checkbox checked={features.has_tv} onChange={handleFeatureChange} name="has_tv" />}
            label="TV設置"
          />
          <FormControlLabel
            control={<Checkbox checked={features.smoking_allowed} onChange={handleFeatureChange} name="smoking_allowed" />}
            label="喫煙可"
          />
          <FormControlLabel
            control={<Checkbox checked={features.has_happy_hour} onChange={handleFeatureChange} name="has_happy_hour" />}
            label="ハッピーアワー"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeatureDialogClose}>キャンセル</Button>
          <Button onClick={handleFeatureSearch} color="primary">
            この特徴で検索
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLocationDialog} onClose={handleLocationDialogClose}>
        <DialogTitle>位置情報の許可が必要です</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このアプリは近くのレストランを見つけるために位置情報を使用します。
            ブラウザの設定から位置情報の使用を許可してください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationDialogClose}>閉じる</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SearchForm;