'use client';

import { Restaurant as RestaurantIcon } from '@mui/icons-material';
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

type RestaurantStats = {
  totalRestaurants: number;
  newRestaurantsThisMonth: number;
  recentUpdates: {
    restaurant_id: number;
    name: string;
    updated_at: string;
  }[];
};

export default function AdminDashboard() {
  // 状態管理: レストラン統計情報、ローディング状態、エラー状態
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // レストラン統計情報を取得する関数
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // APIエンドポイントからデータを取得
        const response = await fetch('/api/admin/restaurants/stats');

        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant stats');
        }

        // レスポンスデータをJSONとして解析
        const data = await response.json();

        // 状態を更新
        setStats(data);
        setTotalCount(data.totalRestaurants);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    // コンポーネントのマウント時に統計情報を取得
    fetchStats();
  }, []);

  // 日付フォーマットのヘルパー関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" sx={{ p: 3 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" gutterBottom>
                  レストラン総数
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {totalCount !== null ? totalCount.toLocaleString() : '0'}
              </Typography>
              {loading && totalCount === null && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    読み込み中...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              今月の新規登録
            </Typography>
            <Typography variant="h3">
              {stats?.newRestaurantsThisMonth || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              最近の更新
            </Typography>
            {stats?.recentUpdates && stats.recentUpdates.length > 0 ? (
              <List>
                {stats.recentUpdates.map((update, index) => (
                  <Box key={update.restaurant_id}>
                    <ListItem>
                      <ListItemText
                        primary={update.name}
                        secondary={formatDate(update.updated_at)}
                      />
                    </ListItem>
                    {index < stats.recentUpdates.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, color: 'text.secondary' }}>
                更新データがありません
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}