import CasinoIcon from '@mui/icons-material/Casino';
import CreditCardIcon from '@mui/icons-material/CreditCard';
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
  Slider,
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
  const [beerPrice, setBeerPrice] = useState(null);
  const [chuhaiPrice, setChuhaiPrice] = useState(null);

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
        { name: 'credit_card', label: 'クレカ可', icon: <CreditCardIcon /> },
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
    const query = { useLocation: 'true' };
    if (beerPrice !== null) query.maxBeerPrice = beerPrice;
    if (chuhaiPrice !== null) query.maxChuhaiPrice = chuhaiPrice;

    router.push({
      pathname: '/restaurants/search',
      query: query,
    });
  };

  const handleFeatureSearch = (useLocation = false) => {
    const selectedFeatures = Object.entries(features)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const query = {
      features: selectedFeatures.join(','),
      useLocation: useLocation ? 'true' : 'false',
    };

    if (beerPrice !== null) query.maxBeerPrice = beerPrice;
    if (chuhaiPrice !== null) query.maxChuhaiPrice = chuhaiPrice;

    router.push({
      pathname: '/restaurants/search',
      query: query,
    });

    handleFeatureDialogClose();
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBeerPriceChange = (event, newValue) => {
    setBeerPrice(newValue);
  };

  const handleChuhaiPriceChange = (event, newValue) => {
    setChuhaiPrice(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: isMobile ? 6 : 10, pb: 8 }}>
      <Box
        sx={{
          textAlign: 'center',
          px: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.5,
            mb: 3,
            borderRadius: 999,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            せんべろ好きのための検索サイト
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          gap={isMobile ? 1 : 2}
        >
          <SportsBarRoundedIcon sx={{ fontSize: isMobile ? 56 : 72, color: 'primary.main' }} />
          <Typography
            variant="h2"
            sx={{
              color: 'text.primary',
              fontWeight: 900,
              fontSize: isMobile ? '30px' : '48px',
            }}
          >
            せんべろCheers
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            mt: 6,
            mb: 2,
            fontSize: isMobile ? '19px' : '26px',
          }}
        >
          イマココ検索とは？
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: 1.9,
          }}
        >
          次のお店はどこにしようか？
          <br />
          お店探しもはしご酒の醍醐味。
          <br />
          そんなあなたへ送るはしご酒専用検索機能。
          <br />
          「イマ」営業中の居酒屋を「ココ」から近い順に表示します。
          <br />
          <br />
          新しいお店との出会いに乾杯。
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 3,
          px: 2,
          py: 1.5,
          mt: 4,
          mb: 4,
        }}
      >
        <Typography
          align="center"
          sx={{
            color: 'text.secondary',
            fontSize: isMobile ? '12px' : '14px',
          }}
        >
          ※このアプリは位置情報を使用します。機能を利用する際には位置情報の使用許可が必要になります。
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="center"
        gap={1.5}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          fullWidth={isMobile}
          size="large"
          sx={{ px: 4 }}
        >
          イマココ検索
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleFeatureDialogOpen}
          fullWidth={isMobile}
          size="large"
          sx={{ px: 4 }}
        >
          特徴から検索
        </Button>
      </Box>

      <Dialog open={openFeatureDialog} onClose={handleFeatureDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>特徴から検索</DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              価格
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography gutterBottom>ビール価格: {beerPrice !== null ? `~${beerPrice}円` : '未設定'}</Typography>
              <Slider
                value={beerPrice !== null ? beerPrice : 1000}
                onChange={handleBeerPriceChange}
                aria-labelledby="beer-price-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={300}
                max={1000}
              />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography gutterBottom>酎ハイ価格: {chuhaiPrice !== null ? `~${chuhaiPrice}円` : '未設定'}</Typography>
              <Slider
                value={chuhaiPrice !== null ? chuhaiPrice : 1000}
                onChange={handleChuhaiPriceChange}
                aria-labelledby="chuhai-price-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={300}
                max={1000}
              />
            </Box>
          </Grid>
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