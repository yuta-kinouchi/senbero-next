// pages/restaurants/new.tsx
import Navbar from '@/components/Navbar';
import { RestaurantNew } from '@/components/RestaurantNew';
import { useRestaurantForm } from '@/hooks/useRestaurantForm';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '../../styles/HomePage.module.css';

const NewRestaurantPage: React.FC = () => {
  const router = useRouter();
  
  const initialData = {
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
  };

  const {
    restaurant,
    imagePreview,
    handleInputChange,
    handleOperatingHoursChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit: onSubmit
  } = useRestaurantForm({ initialData });

  // API送信とナビゲーションを含むサブミットハンドラー
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(e);
      // 成功時の処理
      router.push('/restaurants'); // 一覧ページへ遷移
    } catch (error) {
      // エラー処理
      console.error('Failed to create restaurant:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <RestaurantNew
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleOperatingHoursChange={handleOperatingHoursChange}
          handleSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
          isNew={true}
        />
      </Container>
    </div>
  );
};

export default NewRestaurantPage;