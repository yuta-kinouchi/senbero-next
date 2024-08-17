import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import {
  Alert,
  Box, Button,
  Container, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
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

  const featureItems = [
    { name: 'morning_available', label: '朝飲み' },
    { name: 'daytime_available', label: '昼飲み' },
    { name: 'has_set', label: 'せんべろセット' },
    { name: 'has_chinchiro', label: 'チンチロリン' },
    { name: 'outside_available', label: '外飲み' },
    { name: 'is_standing', label: '立ち飲み' },
    { name: 'is_kakuuchi', label: '角打ち' },
    { name: 'is_cash_on', label: 'キャッシュオン' },
    { name: 'has_charge', label: 'チャージあり' },
    { name: 'has_tv', label: 'TV設置' },
    { name: 'smoking_allowed', label: '喫煙可' },
    { name: 'has_happy_hour', label: 'ハッピーアワー' },
  ];

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

  const handleIconClick = (name) => {
    setFeatures(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFeatureSearch = async () => {
    const selectedFeatures = Object.entries(features)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    try {
      router.push({
        pathname: '/restaurant-list',
        query: { features: selectedFeatures.join(',') },
      });
    } catch (error) {
      console.error('Error navigating to restaurant list:', error);
      setSnackbar({
        open: true,
        message: 'エラーが発生しました。もう一度お試しください。',
        severity: 'error'
      });
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

      <Dialog open={openFeatureDialog} onClose={handleFeatureDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>特徴から検索</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {featureItems.map((item) => (
              <Grid item xs={12} sm={4} key={item.name}>
                <IconButton
                  onClick={() => handleIconClick(item.name)}
                  color={features[item.name] ? "primary" : "default"}
                >
                  <SportsBarRoundedIcon />
                </IconButton>
                <Typography variant="body2" display="inline">
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
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