import CasinoIcon from '@mui/icons-material/Casino';
import DeckRoundedIcon from '@mui/icons-material/DeckRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SmokingRoomsRoundedIcon from '@mui/icons-material/SmokingRoomsRounded';
import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import TvRoundedIcon from '@mui/icons-material/TvRounded';
import {
  Alert,
  Box, Button,
  Container, Dialog, DialogActions, DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/router';
import { useState } from 'react';

const SearchForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
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

  const featureCategories = [
    {
      category: "楽しみ方",
      items: [
        { name: 'has_set', label: 'せんべろセット', icon: <SportsBarRoundedIcon /> },
        { name: 'has_happy_hour', label: 'ハッピーアワー', icon: <SportsBarRoundedIcon /> },
        { name: 'has_chinchiro', label: 'チンチロ', icon: <CasinoIcon /> },
      ]
    },
    {
      category: "時間",
      items: [
        { name: 'morning_available', label: '朝飲み', icon: <SportsBarRoundedIcon /> },
        { name: 'daytime_available', label: '昼飲み', icon: <SportsBarRoundedIcon /> },
      ]
    },
    {
      category: "雰囲気",
      items: [
        { name: 'outside_available', label: '外飲み', icon: <DeckRoundedIcon /> },
        { name: 'is_standing', label: '立ち飲み', icon: <SportsBarRoundedIcon /> },
        { name: 'is_kakuuchi', label: '角打ち', icon: <SportsBarRoundedIcon /> },
      ]
    },
    {
      category: "お金",
      items: [
        { name: 'is_cash_on', label: 'キャッシュオン', icon: <PaymentsRoundedIcon /> },
        { name: 'has_charge', label: 'チャージなし', icon: <PaymentsRoundedIcon /> },
      ]
    },
    {
      category: "その他",
      items: [
        { name: 'has_tv', label: 'TV設置', icon: <TvRoundedIcon /> },
        { name: 'smoking_allowed', label: '喫煙可', icon: <SmokingRoomsRoundedIcon /> },
      ]
    },
  ];

  const handleSearch = () => {
    router.push({
      pathname: '/restaurant-list',
      query: { useLocation: 'true' },
    });
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

  const handleFeatureSearch = (useLocation = false) => {
    const selectedFeatures = Object.entries(features)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    router.push({
      pathname: '/restaurant-list',
      query: {
        features: selectedFeatures.join(','),
        useLocation: useLocation ? 'true' : 'false',
      },
    });

    handleFeatureDialogClose();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
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
          イマココ検索
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
          <Grid container spacing={3}>
            {featureCategories.map((category) => (
              <Grid item xs={12} key={category.category}>
                <Typography variant="h6" gutterBottom>
                  {category.category}
                </Typography>
                <Grid container spacing={2}>
                  {category.items.map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.name}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => handleIconClick(item.name)}
                          color={features[item.name] ? "primary" : "default"}
                          size="small"
                        >
                          {item.icon}
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeatureDialogClose}>キャンセル</Button>
          <Button onClick={() => handleFeatureSearch(false)} color="primary">
            特徴のみで検索
          </Button>
          <Button onClick={() => handleFeatureSearch(true)} color="secondary">
            特徴＋位置情報で検索
          </Button>
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