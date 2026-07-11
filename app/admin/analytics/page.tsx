'use client';

import { Visibility as VisibilityIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

type AnalyticsData = {
  totalViews: number;
  todayViews: number;
  last7DaysViews: number;
  uniqueVisitors7d: number;
  topPages: { path: string; count: number }[];
  daily: { date: string; count: number }[];
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Typography color="error" variant="h6" sx={{ p: 3 }}>
        {error || 'データがありません'}
      </Typography>
    );
  }

  const maxDailyCount = Math.max(1, ...data.daily.map((d) => d.count));

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        アクセス状況
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>本日</Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
              {data.todayViews.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>直近7日間</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {data.last7DaysViews.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>ユニーク訪問者（7日）</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {data.uniqueVisitors7d.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>累計アクセス数</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {data.totalViews.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>日別アクセス数（直近7日間）</Typography>
            {data.daily.length > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 160, mt: 2 }}>
                {data.daily.map((d) => (
                  <Box key={d.date} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Typography variant="caption">{d.count}</Typography>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 32,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        height: `${(d.count / maxDailyCount) * 100}px`,
                        minHeight: 4,
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>{formatDate(d.date)}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 2, color: 'text.secondary' }}>データがありません</Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>人気ページ TOP5</Typography>
            {data.topPages.length > 0 ? (
              <List>
                {data.topPages.map((page, index) => (
                  <Box key={page.path}>
                    <ListItem>
                      <VisibilityIcon color="action" sx={{ mr: 2 }} />
                      <ListItemText primary={page.path} secondary={`${page.count.toLocaleString()} 回`} />
                    </ListItem>
                    {index < data.topPages.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, color: 'text.secondary' }}>データがありません</Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
