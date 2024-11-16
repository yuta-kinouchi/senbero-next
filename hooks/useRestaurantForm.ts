// hooks/useRestaurantForm.ts
import { OperatingHour, Restaurant } from '@/types/restaurant';
import { useCallback, useState } from 'react';

interface UseRestaurantFormProps {
  initialData?: Partial<Restaurant>;
}

export const useRestaurantForm = ({ initialData }: UseRestaurantFormProps = {}) => {
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: '',
    phone_number: '',
    country: '',
    state: '',
    city: '',
    address_line1: '',
    address_line2: '',
    capacity: 0,
    description: '',
    special_rule: '',
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
    has_charge: false,
    charge_description: '',
    has_tv: false,
    smoking_allowed: false,
    has_happy_hour: false,
    credit_card: false,
    credit_card_description: '',
    beer_price: 0,
    beer_types: '',
    chuhai_price: 0,
    operating_hours: [],
    ...initialData
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // API呼び出しのロジックをここに実装
      // const response = await api.createRestaurant(restaurant);
    } catch (error) {
      console.error('Failed to submit restaurant data:', error);
    }
  }, [restaurant]);

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
    handleInputChange,
    handleOperatingHoursChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
    validate,
    resetForm,
    setRestaurant
  };
};