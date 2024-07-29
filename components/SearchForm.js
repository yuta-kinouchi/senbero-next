import SportsBarRoundedIcon from "@mui/icons-material/SportsBarRounded";
import { Box, Button, Container, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from 'next/router';
import { useState } from 'react';

const SearchForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  const handleSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          // 位置情報をクエリパラメータとして次のページに送信
          router.push({
            pathname: '/restaurant-list',
            query: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('位置情報の取得に失敗しました。位置情報を許可してください。');
        }
      );
    } else {
      alert('位置情報がサポートされていません。');
    }
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
          }}
        >
          検索する
        </Button>
      </Box>
    </Container>
  );
};

export default SearchForm;