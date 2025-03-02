'use client';

import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  LocalBar as LocalBarIcon,
  Payment as PaymentIcon,
  Restaurant as RestaurantIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// レストランの型定義
type Restaurant = {
  restaurant_id?: number;
  name: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2: string;
  description: string;
  special_rule: string;
  capacity: number | null;
  home_page: string;
  latitude: number | null;
  longitude: number | null;
  restaurant_image: string;

  // 店舗詳細
  morning_available: boolean;
  daytime_available: boolean;
  has_set: boolean;
  senbero_description: string;
  has_chinchiro: boolean;
  chinchiro_description: string;
  outside_available: boolean;
  outside_description: string;
  is_standing: boolean;
  standing_description: string;
  is_kakuuchi: boolean;
  is_cash_on: boolean;
  has_tv: boolean;
  smoking_allowed: boolean;
  has_happy_hour: boolean;

  // ドリンク情報
  beer_price: number | null;
  beer_types: string;
  chuhai_price: number | null;

  // 支払い情報
  credit_card: boolean;
  credit_card_description: string;
  is_cash_only: boolean;
  has_charge: boolean;
  charge_description: string;
};

// タブパネルのプロパティ
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// タブパネルのコンポーネント
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 空のレストラン情報の初期値
const emptyRestaurant: Restaurant = {
  name: '',
  phone_number: '',
  country: '日本',
  state: '',
  city: '',
  address_line1: '',
  address_line2: '',
  description: '',
  special_rule: '',
  capacity: null,
  home_page: '',
  latitude: null,
  longitude: null,
  restaurant_image: '',

  // 店舗詳細
  morning_available: false,
  daytime_available: false,
  has_set: false,
  senbero_description: '',
  has_chinchiro: false,
  chinchiro_description: '',
  outside_available: false,
  outside_description: '',
  is_standing: false,
  standing_description: '',
  is_kakuuchi: false,
  is_cash_on: false,
  has_tv: false,
  smoking_allowed: false,
  has_happy_hour: false,

  // ドリンク情報
  beer_price: null,
  beer_types: '',
  chuhai_price: null,

  // 支払い情報
  credit_card: false,
  credit_card_description: '',
  is_cash_only: false,
  has_charge: false,
  charge_description: '',
};

export default function RestaurantEdit() {
  const params = useParams();
  const router = useRouter();
  const isNewRestaurant = params?.id === 'create';
  const restaurantId = isNewRestaurant ? null : Number(params?.id);

  // 状態の定義
  const [tabValue, setTabValue] = useState(0);
  const [restaurant, setRestaurant] = useState<Restaurant>(emptyRestaurant);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // レストラン情報の取得
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (isNewRestaurant) {
        setRestaurant(emptyRestaurant);
        setLoading(false);
        return;
      }

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

        // 取得したデータを変換
        const formattedRestaurant = {
          ...emptyRestaurant, // デフォルト値を設定
          ...data, // APIからのデータで上書き
        };

        setRestaurant(formattedRestaurant);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, isNewRestaurant]);

  // タブの変更ハンドラー
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // フォーム入力の変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

  // 数値フィールドの変更ハンドラー
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : Number(value);
    setRestaurant({ ...restaurant, [name]: numValue });
  };

  // チェックボックスの変更ハンドラー
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRestaurant({ ...restaurant, [name]: checked });
  };

  // 保存処理
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // フォームバリデーション
      if (!restaurant.name) {
        throw new Error('店舗名は必須項目です');
      }
      if (!restaurant.address_line1) {
        throw new Error('住所は必須項目です');
      }
      if (!restaurant.city) {
        throw new Error('市区町村は必須項目です');
      }

      // APIエンドポイントの選択
      const url = isNewRestaurant
        ? '/api/admin/restaurants'
        : `/api/admin/restaurants/${restaurantId}`;

      const method = isNewRestaurant ? 'POST' : 'PUT';

      // APIリクエスト
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '保存に失敗しました');
      }

      const savedData = await response.json();

      setSaveSuccess(true);

      // 新規作成の場合は保存後に編集ページにリダイレクト
      if (isNewRestaurant && savedData.restaurant_id) {
        router.push(`/admin/restaurants/${savedData.restaurant_id}/edit`);
      } else {
        // 既存データ編集の場合は状態を更新
        setRestaurant({
          ...emptyRestaurant,
          ...savedData
        });
      }
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setSaveError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);

      // 成功メッセージを数秒後に消す
      if (saveSuccess) {
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
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
            {isNewRestaurant ? 'レストラン新規登録' : `${restaurant.name} の編集`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </Box>

      {/* 保存成功/エラーメッセージ */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          レストラン情報を保存しました
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      {/* タブナビゲーション */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="restaurant edit tabs"
        >
          <Tab icon={<InfoIcon />} label="基本情報" />
          <Tab icon={<RestaurantIcon />} label="店舗詳細" />
          <Tab icon={<LocalBarIcon />} label="ドリンク情報" />
          <Tab icon={<PaymentIcon />} label="支払い情報" />
        </Tabs>
      </Box>

      {/* 基本情報タブ */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="基本情報" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="店舗名"
                      name="name"
                      value={restaurant.name}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="電話番号"
                      name="phone_number"
                      value={restaurant.phone_number || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ホームページ"
                      name="home_page"
                      value={restaurant.home_page || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="国"
                      name="country"
                      value={restaurant.country}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="都道府県"
                      name="state"
                      value={restaurant.state}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="市区町村"
                      name="city"
                      value={restaurant.city}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="住所1（番地など）"
                      name="address_line1"
                      value={restaurant.address_line1}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="住所2（建物名など）"
                      name="address_line2"
                      value={restaurant.address_line2 || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="緯度"
                      name="latitude"
                      type="number"
                      value={restaurant.latitude || ''}
                      onChange={handleNumberChange}
                      InputProps={{
                        inputProps: { step: 'any' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="経度"
                      name="longitude"
                      type="number"
                      value={restaurant.longitude || ''}
                      onChange={handleNumberChange}
                      InputProps={{
                        inputProps: { step: 'any' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="店舗画像URL"
                      name="restaurant_image"
                      value={restaurant.restaurant_image || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="説明"
                      name="description"
                      value={restaurant.description || ''}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="特別ルール"
                      name="special_rule"
                      value={restaurant.special_rule || ''}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 店舗詳細タブ */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="店舗の特徴" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="収容人数"
                      name="capacity"
                      type="number"
                      value={restaurant.capacity || ''}
                      onChange={handleNumberChange}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.morning_available || false}
                            onChange={handleCheckboxChange}
                            name="morning_available"
                          />
                        }
                        label="朝営業あり"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.daytime_available || false}
                            onChange={handleCheckboxChange}
                            name="daytime_available"
                          />
                        }
                        label="昼営業あり"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.is_standing || false}
                          onChange={handleCheckboxChange}
                          name="is_standing"
                        />
                      }
                      label="立ち飲み可"
                    />
                    {restaurant.is_standing && (
                      <TextField
                        fullWidth
                        label="立ち飲み詳細"
                        name="standing_description"
                        value={restaurant.standing_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.is_kakuuchi || false}
                            onChange={handleCheckboxChange}
                            name="is_kakuuchi"
                          />
                        }
                        label="角打ち可"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.is_cash_on || false}
                            onChange={handleCheckboxChange}
                            name="is_cash_on"
                          />
                        }
                        label="現金オン可"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.has_set || false}
                          onChange={handleCheckboxChange}
                          name="has_set"
                        />
                      }
                      label="セットメニューあり"
                    />
                    {restaurant.has_set && (
                      <TextField
                        fullWidth
                        label="せんべろセット詳細"
                        name="senbero_description"
                        value={restaurant.senbero_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.has_chinchiro || false}
                          onChange={handleCheckboxChange}
                          name="has_chinchiro"
                        />
                      }
                      label="ちんちろゲームあり"
                    />
                    {restaurant.has_chinchiro && (
                      <TextField
                        fullWidth
                        label="ちんちろ詳細"
                        name="chinchiro_description"
                        value={restaurant.chinchiro_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.outside_available || false}
                          onChange={handleCheckboxChange}
                          name="outside_available"
                        />
                      }
                      label="外席あり"
                    />
                    {restaurant.outside_available && (
                      <TextField
                        fullWidth
                        label="外席詳細"
                        name="outside_description"
                        value={restaurant.outside_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.has_tv || false}
                            onChange={handleCheckboxChange}
                            name="has_tv"
                          />
                        }
                        label="テレビあり"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.smoking_allowed || false}
                            onChange={handleCheckboxChange}
                            name="smoking_allowed"
                          />
                        }
                        label="喫煙可"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.has_happy_hour || false}
                            onChange={handleCheckboxChange}
                            name="has_happy_hour"
                          />
                        }
                        label="ハッピーアワーあり"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ドリンク情報タブ */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="ドリンク情報" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ビール価格"
                      name="beer_price"
                      type="number"
                      value={restaurant.beer_price || ''}
                      onChange={handleNumberChange}
                      InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: <InputAdornment position="end">円</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="チューハイ価格"
                      name="chuhai_price"
                      type="number"
                      value={restaurant.chuhai_price || ''}
                      onChange={handleNumberChange}
                      InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: <InputAdornment position="end">円</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="ビールの種類"
                      name="beer_types"
                      value={restaurant.beer_types || ''}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      placeholder="例: アサヒスーパードライ, エビス, サッポロ黒ラベルなど"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 支払い情報タブ */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="支払い情報" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.credit_card || false}
                          onChange={handleCheckboxChange}
                          name="credit_card"
                        />
                      }
                      label="クレジットカード決済可"
                    />
                    {restaurant.credit_card && (
                      <TextField
                        fullWidth
                        label="クレジットカード詳細"
                        name="credit_card_description"
                        value={restaurant.credit_card_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                        placeholder="例: VISA, Mastercard, JCB"
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restaurant.is_cash_only || false}
                            onChange={handleCheckboxChange}
                            name="is_cash_only"
                          />
                        }
                        label="現金のみ"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={restaurant.has_charge || false}
                          onChange={handleCheckboxChange}
                          name="has_charge"
                        />
                      }
                      label="席料/チャージあり"
                    />
                    {restaurant.has_charge && (
                      <TextField
                        fullWidth
                        label="席料/チャージ詳細"
                        name="charge_description"
                        value={restaurant.charge_description || ''}
                        onChange={handleInputChange}
                        sx={{ mt: 1 }}
                        placeholder="例: 1人500円、飲食代に含む"
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}