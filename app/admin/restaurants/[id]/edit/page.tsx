'use client';

import BasicInfoTab from '@/components/admin/restaurants/BasicInfoTab';
import DrinkInfoTab from '@/components/admin/restaurants/DrinkInfoTab';
import OperatingHoursTab from '@/components/admin/restaurants/OperatingHoursTab';
import PaymentInfoTab from '@/components/admin/restaurants/PaymentInfoTab';
import RestaurantDetailsTab from '@/components/admin/restaurants/RestaurantDetailsTab';
import { OperatingHour, Restaurant } from '@/types/restaurant';
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  LocalBar as LocalBarIcon,
  Payment as PaymentIcon,
  Restaurant as RestaurantIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
  capacity: undefined,
  home_page: '',
  latitude: undefined,
  longitude: undefined,
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
  beer_price: undefined,
  beer_types: '',
  chuhai_price: undefined,

  // 支払い情報
  credit_card: false,
  credit_card_description: '',
  has_charge: false,
  charge_description: '',

  // 営業時間
  operating_hours: [],
};

export default function RestaurantEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNewRestaurant = params?.id === 'create';
  const restaurantId = isNewRestaurant ? null : Number(params?.id);

  // 状態の定義
  const [tabValue, setTabValue] = useState(0);
  const [restaurant, setRestaurant] = useState<Restaurant>(emptyRestaurant);
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
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
        setOperatingHours([]);
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

        // 営業時間データを設定
        if (data.operating_hours && Array.isArray(data.operating_hours)) {
          setOperatingHours(data.operating_hours);
        }
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

  // 営業時間の変更ハンドラー
  const handleOperatingHoursChange = (hours: OperatingHour[]) => {
    setOperatingHours(hours);
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

      // 送信データの準備
      const dataToSend = {
        ...restaurant,
        operating_hours: operatingHours
      };

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
        body: JSON.stringify(dataToSend),
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

        // 営業時間データを更新
        if (savedData.operating_hours && Array.isArray(savedData.operating_hours)) {
          setOperatingHours(savedData.operating_hours);
        }
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
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<InfoIcon />} label="基本情報" />
          <Tab icon={<RestaurantIcon />} label="店舗詳細" />
          <Tab icon={<LocalBarIcon />} label="ドリンク情報" />
          <Tab icon={<PaymentIcon />} label="支払い情報" />
          <Tab icon={<ScheduleIcon />} label="営業時間" />
        </Tabs>
      </Box>

      {/* 基本情報タブ */}
      <TabPanel value={tabValue} index={0}>
        <BasicInfoTab
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleNumberChange={handleNumberChange}
        />
      </TabPanel>

      {/* 店舗詳細タブ */}
      <TabPanel value={tabValue} index={1}>
        <RestaurantDetailsTab
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleNumberChange={handleNumberChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      </TabPanel>

      {/* ドリンク情報タブ */}
      <TabPanel value={tabValue} index={2}>
        <DrinkInfoTab
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleNumberChange={handleNumberChange}
        />
      </TabPanel>

      {/* 支払い情報タブ */}
      <TabPanel value={tabValue} index={3}>
        <PaymentInfoTab
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      </TabPanel>

      {/* 営業時間タブ */}
      <TabPanel value={tabValue} index={4}>
        <OperatingHoursTab
          operatingHours={operatingHours}
          onChange={handleOperatingHoursChange}
        />
      </TabPanel>
    </Box>
  );
}