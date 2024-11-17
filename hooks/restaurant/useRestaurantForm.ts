// hooks/useRestaurantForm.ts
import { OperatingHour, Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useRestaurantApi } from '../api/useRestaurantApi';

// フックの戻り値の型定義
interface UseRestaurantFormReturn {
  restaurant: Restaurant;
  imagePreview: string | null;
  loading: boolean;
  error: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOperatingHoursChange: (hours: OperatingHour[]) => void;
  handleCheckboxChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  // 以下は必要に応じて追加
  validate: () => Partial<Record<keyof Restaurant, string>>;
  resetForm: () => void;
}


export const useRestaurantForm = (initialData?: Partial<Restaurant>): UseRestaurantFormReturn => {
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: '',  // nameは必須フィールドなので初期値が必要
    ...initialData
  } as Restaurant);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRestaurant } = useRestaurantApi();
  const router = useRouter();

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleOperatingHoursChange = useCallback((hours: OperatingHour[]) => {
    setRestaurant(prev => ({
      ...prev,
      operating_hours: hours
    }));
  }, []);

  const handleCheckboxChange = useCallback((name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestaurant(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // バリデーション
      if (!restaurant.name) {
        throw new Error('店名は必須です');
      }
      if (!restaurant.state || !restaurant.city || !restaurant.address_line1) {
        throw new Error('住所は必須です');
      }

      // FormDataの作成
      const formData = new FormData();
      
      // 画像以外のデータをFormDataに追加
      Object.entries(restaurant).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // 画像ファイルの追加
      const fileInput = document.getElementById('raised-button-file') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('restaurant_image', fileInput.files[0]);
      }

      // APIリクエスト
      const response = await createRestaurant(formData);

      // 成功時の処理
      router.push(`/restaurants/${response.restaurant_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // バリデーション関数
  const validate = useCallback(() => {
    const errors: Partial<Record<keyof Restaurant, string>> = {};
    
    if (!restaurant.name) {
      errors.name = '店名は必須です';
    }

    if (restaurant.operating_hours?.length === 0) {
      errors.operating_hours = '営業時間を設定してください';
    }

    if (restaurant.beer_price && restaurant.beer_price < 0) {
      errors.beer_price = 'ビール料金は0以上を入力してください';
    }

    if (restaurant.chuhai_price && restaurant.chuhai_price < 0) {
      errors.chuhai_price = '酎ハイ料金は0以上を入力してください';
    }

    return errors;
  }, [restaurant]);

  // フォームのリセット
  const resetForm = useCallback(() => {
    setRestaurant({
      name: '',
      operating_hours: [],
      // その他のフィールドもデフォルト値にリセット
    });
    setImagePreview(null);
  }, []);

  return {
    restaurant,
    imagePreview,
    loading,     // 追加
    error,       // 追加
    handleInputChange,
    handleOperatingHoursChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    validate,
    resetForm
  };
};