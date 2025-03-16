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
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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

export default function CreateRestaurantPage() {
  const router = useRouter();

  // 状態の定義
  const [tabValue, setTabValue] = useState(0);
  const [restaurant, setRestaurant] = useState<Restaurant>(emptyRestaurant);
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // バリデーションチェック
  const validateForm = (): string | null => {
    if (!restaurant.name) {
      return '店舗名は必須項目です';
    }
    if (!restaurant.country) {
      return '国は必須項目です';
    }
    if (!restaurant.city) {
      return '市区町村は必須項目です';
    }
    if (!restaurant.address_line1) {
      return '住所は必須項目です';
    }
    return null;
  };

  // 保存処理
  const handleSave = async () => {
    // バリデーションチェック
    const validationError = validateForm();
    if (validationError) {
      setSaveError(validationError);
      // エラーがあるタブに移動
      if (validationError.includes('店舗名') ||
        validationError.includes('国') ||
        validationError.includes('住所') ||
        validationError.includes('市区町村')) {
        setTabValue(0); // 基本情報タブへ
      }
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // 送信データの準備
      const dataToSend = {
        ...restaurant,
        operating_hours: operatingHours
      };

      // APIリクエスト
      const response = await fetch('/api/admin/restaurants', {
        method: 'POST',
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

      // 成功したら編集ページにリダイレクト
      if (savedData.restaurant_id) {
        setTimeout(() => {
          router.push(`/admin/restaurants/${savedData.restaurant_id}/edit`);
        }, 1000);
      }
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setSaveError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー部分 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/restaurants')}
            sx={{ mr: 2 }}
          >
            戻る
          </Button>
          <Typography variant="h4" component="h1">
            レストラン新規登録
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
          レストラン情報を保存しました。編集ページにリダイレクトします...
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
          aria-label="restaurant create tabs"
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