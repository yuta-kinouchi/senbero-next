'use client';

import { Edit as EditIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
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

  const fetchRestaurants = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/restaurants?page=${page}&limit=${limit}`);
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
    }
  };

  useEffect(() => {
    fetchRestaurants(pagination.page, pagination.limit);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    fetchRestaurants(newPage + 1, pagination.limit);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    fetchRestaurants(1, newLimit);
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

  if (loading && restaurants.length === 0) {
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      component={Link}
                      href={`/admin/restaurants/${restaurant.restaurant_id}/edit`}
                    >
                      編集
                    </Button>
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
    </>
  );
}