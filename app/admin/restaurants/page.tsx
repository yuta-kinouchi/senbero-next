'use client';

import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Restaurant = {
  restaurant_id: number;
  name: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
};

type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export default function RestaurantsList() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 検索用の状態
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchingNow, setSearchingNow] = useState(false);

  // 削除確認ダイアログ用の状態
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // スナックバー通知用の状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // 市区町村のリスト
  const [locations, setLocations] = useState<string[]>([]);

  // 市区町村リストを取得
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/admin/restaurants/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  const fetchRestaurants = async (page: number, limit: number, search?: string, location?: string) => {
    setLoading(true);
    setSearchingNow(true);

    try {
      // クエリパラメータの構築
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));

      if (search) {
        params.append('search', search);
      }

      if (location) {
        params.append('city', location);
      }

      const response = await fetch(`/api/admin/restaurants?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data.restaurants);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('レストラン情報の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
      setSearchingNow(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(pagination.page, pagination.limit);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    fetchRestaurants(newPage + 1, pagination.limit, searchTerm, locationFilter);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    fetchRestaurants(1, newLimit, searchTerm, locationFilter);
  };

  // 検索ハンドラー
  const handleSearch = () => {
    fetchRestaurants(1, pagination.limit, searchTerm, locationFilter);
  };

  // リセットハンドラー
  const handleReset = () => {
    setSearchTerm('');
    setLocationFilter('');
    fetchRestaurants(1, pagination.limit);
  };

  // 日付フォーマットのヘルパー関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 行クリック時の処理
  const handleRowClick = (restaurantId: number) => {
    router.push(`/admin/restaurants/${restaurantId}`);
  };

  // 削除ボタンクリック時の処理
  const handleDeleteClick = (e: React.MouseEvent, restaurant: Restaurant) => {
    e.stopPropagation(); // 行のクリックイベントが発火しないようにする
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  // 削除確認ダイアログを閉じる
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRestaurantToDelete(null);
  };

  // 削除実行処理
  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;

    setDeleteLoading(true);
    try {
      // 削除用APIエンドポイントを呼び出し
      const response = await fetch(`/api/admin/restaurants/delete/${restaurantToDelete.restaurant_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }

      // 削除成功後の処理
      setSnackbar({
        open: true,
        message: `「${restaurantToDelete.name}」を削除しました`,
        severity: 'success'
      });

      // 現在のページのデータを再取得
      fetchRestaurants(pagination.page, pagination.limit, searchTerm, locationFilter);
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      setSnackbar({
        open: true,
        message: 'レストランの削除中にエラーが発生しました',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setRestaurantToDelete(null);
    }
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && restaurants.length === 0 && !searchingNow) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          レストラン一覧
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/admin/restaurants/create"
        >
          新規登録
        </Button>
      </Box>

      {/* 検索フォーム */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="店舗名を検索"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <TextField
                select
                label="エリア"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <MenuItem value="">全てのエリア</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
              >
                検索
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                リセット
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && searchingNow ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : null}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>名前</TableCell>
                <TableCell>場所</TableCell>
                <TableCell>登録日</TableCell>
                <TableCell>更新日</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow
                  key={restaurant.restaurant_id}
                  hover
                  onClick={() => handleRowClick(restaurant.restaurant_id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <TableCell>{restaurant.restaurant_id}</TableCell>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>
                    {restaurant.city}{restaurant.state ? `, ${restaurant.state}` : ''}
                  </TableCell>
                  <TableCell>{formatDate(restaurant.created_at)}</TableCell>
                  <TableCell>{formatDate(restaurant.updated_at)}</TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        component={Link}
                        href={`/admin/restaurants/${restaurant.restaurant_id}/edit`}
                      >
                        編集
                      </Button>
                      <Tooltip title="削除">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => handleDeleteClick(e, restaurant)}
                        >
                          削除
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {restaurants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    レストラン情報がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `${to}以上`}`
          }
        />
      </Paper>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          レストランを削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            「{restaurantToDelete?.name}」を削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            autoFocus
          >
            {deleteLoading ? <CircularProgress size={24} /> : '削除'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 通知用スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}