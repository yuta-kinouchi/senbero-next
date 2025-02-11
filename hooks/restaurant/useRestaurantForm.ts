// hooks/restaurant/useRestaurantForm.ts
import { useRestaurantApi } from '@/hooks/api/useRestaurantApi';
import { Restaurant } from '@/types/restaurant';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useRestaurantForm = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Partial<Restaurant>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRestaurant } = useRestaurantApi();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleOperatingHoursChange = (operatingHours: any[]) => {
    setRestaurant((prev) => ({ ...prev, operating_hours: operatingHours }));
  };

  const handleCheckboxChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestaurant((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      formData.append('restaurant', JSON.stringify(restaurant));

      const result = await createRestaurant(formData);
      router.push(`/restaurants/${result.restaurant_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurant,
    imagePreview,
    loading,
    error,
    handleInputChange,
    handleOperatingHoursChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit
  };
};