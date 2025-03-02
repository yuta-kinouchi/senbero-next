'use client';

import {
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
  Edit as EditIcon,
  LocalBar as LocalBarIcon,
  Restaurant as RestaurantIcon,
  Schedule as ScheduleIcon,
  Storefront as StorefrontIcon
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// レストランの型定義
type OperatingHour = {
  id: number;
  restaurant_id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  drink_last_order_time?: string;
  food_last_order_time?: string;
  happy_hour_start?: string;
  happy_hour_end?: string;
  created_at: string;
  updated_at: string;
};

type Restaurant = {
  restaurant_id: number;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  home_page?: string;
  description?: string;
  capacity?: number;
  is_standing: boolean;
  standing_description?: string;
  is_kakuuchi: boolean;
  is_cash_on: boolean;
  morning_available: boolean;
  daytime_available: boolean;
  has_set: boolean;
  senbero_description?: string;
  has_chinchiro: boolean;
  chinchiro_description?: string;
  outside_available: boolean;
  outside_description?: string;
  is_cash_only: boolean;
  has_charge: boolean;
  charge_description?: string;
  has_tv: boolean;
  smoking_allowed: boolean;
  has_happy_hour: boolean;
  special_rule?: string;
  restaurant_image?: string;
  credit_card: boolean;
  credit_card_description?: string;
  beer_price?: number;
  beer_types?: string;
  chuhai_price?: number;
  created_at: string;
  updated_at: string;
  operating_hours: OperatingHour[];
};

export default function RestaurantDetail() {
  const params = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // レストランIDを取得
  const restaurantId = params?.id;

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/admin/restaurants/${restaurantId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('レストランが見つかりません');
          }
          throw new Error('レストラン情報の取得に失敗しました');
        }

        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // 曜日の表示名
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  // 日時フォーマット
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

  // 時刻のフォーマット (00:00 形式)
  const formatTime = (timeString: string) => {
    if (!timeString) return '指定なし';

    try {
      const date = new Date(timeString);
      const jpTime = new Date(date.getTime() - (9 * 60 * 60 * 1000));
      return jpTime.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      console.error('Time parsing error:', e);
      return timeString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error || 'レストラン情報を取得できませんでした'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mt: 2 }}
        >
          戻る
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー部分 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            戻る
          </Button>
          <Typography variant="h4" component="h1">
            {restaurant.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          component={Link}
          href={`/admin/restaurants/${restaurant.restaurant_id}/edit`}
        >
          編集
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 基本情報 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="基本情報"
              avatar={<StorefrontIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">住所</Typography>
                  <Typography>
                    {restaurant.address_line1}
                    {restaurant.address_line2 && <><br />{restaurant.address_line2}</>}
                    <br />
                    {restaurant.city}
                    {restaurant.state && `, ${restaurant.state}`}
                    {restaurant.country && ` ${restaurant.country}`}
                  </Typography>
                </Box>

                {restaurant.phone_number && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">電話番号</Typography>
                    <Typography>{restaurant.phone_number}</Typography>
                  </Box>
                )}

                {restaurant.home_page && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">ホームページ</Typography>
                    <Typography>
                      <Link href={restaurant.home_page} target="_blank" rel="noopener noreferrer">
                        {restaurant.home_page}
                      </Link>
                    </Typography>
                  </Box>
                )}

                {(restaurant.latitude !== undefined && restaurant.longitude !== undefined) && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">位置情報</Typography>
                    <Typography>
                      緯度: {restaurant.latitude}, 経度: {restaurant.longitude}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">登録日時</Typography>
                  <Typography>{formatDate(restaurant.created_at)}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">最終更新日時</Typography>
                  <Typography>{formatDate(restaurant.updated_at)}</Typography>
                </Box>

                {restaurant.description && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">説明</Typography>
                    <Typography style={{ whiteSpace: 'pre-line' }}>{restaurant.description}</Typography>
                  </Box>
                )}

                {restaurant.special_rule && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">特別ルール</Typography>
                    <Typography style={{ whiteSpace: 'pre-line' }}>{restaurant.special_rule}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 店舗の特徴 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="店舗の特徴"
              avatar={<RestaurantIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">収容人数</Typography>
                  <Typography>{restaurant.capacity || '指定なし'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">立ち飲み</Typography>
                  <Typography>
                    {restaurant.is_standing ? '可' : '不可'}
                    {restaurant.is_standing && restaurant.standing_description &&
                      ` (${restaurant.standing_description})`}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">角打ち</Typography>
                  <Typography>{restaurant.is_kakuuchi ? '可' : '不可'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">現金オン</Typography>
                  <Typography>{restaurant.is_cash_on ? '可' : '不可'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">営業時間</Typography>
                  <Typography>
                    {restaurant.morning_available ? '朝営業あり' : '朝営業なし'}
                    <br />
                    {restaurant.daytime_available ? '昼営業あり' : '昼営業なし'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">セット</Typography>
                  <Typography>
                    {restaurant.has_set ? 'あり' : 'なし'}
                    {restaurant.has_set && restaurant.senbero_description &&
                      ` (${restaurant.senbero_description})`}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">その他の特徴</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {restaurant.has_happy_hour && <Chip size="small" label="ハッピーアワー" color="primary" />}
                    {restaurant.has_chinchiro && (
                      <Chip
                        size="small"
                        label={`ちんちろ${restaurant.chinchiro_description ? `(${restaurant.chinchiro_description})` : ''}`}
                      />
                    )}
                    {restaurant.outside_available && (
                      <Chip
                        size="small"
                        label={`外席あり${restaurant.outside_description ? `(${restaurant.outside_description})` : ''}`}
                      />
                    )}
                    {restaurant.has_tv && <Chip size="small" label="TV設置" />}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">喫煙</Typography>
                  <Typography>{restaurant.smoking_allowed ? '可' : '不可'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ドリンク情報 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="ドリンク情報"
              avatar={<LocalBarIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {restaurant.beer_price && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">ビール価格</Typography>
                    <Typography>{restaurant.beer_price}円</Typography>
                  </Grid>
                )}

                {restaurant.beer_types && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">ビールの種類</Typography>
                    <Typography>{restaurant.beer_types}</Typography>
                  </Grid>
                )}

                {restaurant.chuhai_price && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">チューハイ価格</Typography>
                    <Typography>{restaurant.chuhai_price}円</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 支払い情報 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="支払い情報"
              avatar={<CreditCardIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">キャッシュレス決済</Typography>
                  <Typography>
                    {restaurant.credit_card ? '利用可' : '利用不可'}
                    {restaurant.credit_card && restaurant.credit_card_description &&
                      ` (${restaurant.credit_card_description})`}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">現金のみ</Typography>
                  <Typography>{restaurant.is_cash_only ? 'はい' : 'いいえ'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">席料/チャージ</Typography>
                  <Typography>
                    {restaurant.has_charge ? 'あり' : 'なし'}
                    {restaurant.has_charge && restaurant.charge_description &&
                      ` (${restaurant.charge_description})`}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 営業時間 */}
        {restaurant.operating_hours && restaurant.operating_hours.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="営業時間"
                avatar={<ScheduleIcon color="primary" />}
              />
              <Divider />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>曜日</TableCell>
                        <TableCell>開店時間</TableCell>
                        <TableCell>閉店時間</TableCell>
                        <TableCell>ドリンク L.O.</TableCell>
                        <TableCell>フード L.O.</TableCell>
                        <TableCell>ハッピーアワー</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[0, 1, 2, 3, 4, 5, 6].map(day => {
                        const dayData = restaurant.operating_hours.find(
                          oh => oh.day_of_week === day
                        );

                        // 各曜日に対応するデータがない場合はその曜日は定休日と見なす
                        const isOpen = !!dayData;

                        return (
                          <TableRow key={day}>
                            <TableCell>{dayNames[day]}曜日</TableCell>
                            <TableCell>
                              {isOpen ? formatTime(dayData.open_time) : (
                                <Chip size="small" label="定休日" color="error" />
                              )}
                            </TableCell>
                            <TableCell>
                              {isOpen ? formatTime(dayData.close_time) : '-'}
                            </TableCell>
                            <TableCell>
                              {isOpen && dayData.drink_last_order_time
                                ? formatTime(dayData.drink_last_order_time)
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {isOpen && dayData.food_last_order_time
                                ? formatTime(dayData.food_last_order_time)
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {isOpen && dayData.happy_hour_start && dayData.happy_hour_end
                                ? `${formatTime(dayData.happy_hour_start)} - ${formatTime(dayData.happy_hour_end)}`
                                : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}