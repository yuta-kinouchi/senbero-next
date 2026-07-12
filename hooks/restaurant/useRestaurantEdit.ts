// hooks/restaurant/useRestaurantEdit.ts
import { Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useRestaurantApi } from '../api/useRestaurantApi';

export const useRestaurantEdit = (id: string) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { getRestaurant, updateRestaurant } = useRestaurantApi();

  // 初期データの取得
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        const data = await getRestaurant(id);
        setRestaurant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'レストランの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleCheckboxChange = useCallback((name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setRestaurant((prev) => (prev ? { ...prev, [name]: checked } : null));
  }, []);

  // GPS取得結果など、複数フィールドをまとめて反映する
  const applyFields = useCallback((fields: Partial<Restaurant>) => {
    setRestaurant((prev) => (prev ? { ...prev, ...fields } : null));
  }, []);

  const handleSubmit = async (updatedData: Partial<Restaurant>) => {
    setLoading(true);
    setError(null);

    try {
      const updatedRestaurant = await updateRestaurant(parseInt(id), updatedData);
      setRestaurant(updatedRestaurant);
      setSuccessMessage('保存しました。詳細ページへ移動します。');

      setTimeout(() => {
        router.push(`/restaurants/${id}`);
      }, 1200);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurant,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    applyFields,
    setError,
    setSuccessMessage
  };
};