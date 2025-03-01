// app/admin/page.tsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function AdminDashboard() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              レストラン総数
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              今月の新規登録
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              アクティブユーザー
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              最近の更新
            </Typography>
            <Box sx={{ p: 2, color: 'text.secondary' }}>
              更新データがありません
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}