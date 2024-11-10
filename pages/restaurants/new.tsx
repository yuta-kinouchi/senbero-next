// pages/restaurants/new.tsx

import Navbar from '@/components/Navbar';
import { RestaurantNew } from '@/components/RestaurantNew';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/HomePage.module.css';

const RestaurantNewPage = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 初期状態の設定
  const initialRestaurantState = {
    name: '',
    phone_number: '',
    country: 'Japan', // デフォルト値
    state: '',
    city: '',
    address_line1: '',
    address_line2: '',
    latitude: 0,
    longitude: 0,
    capacity: '',
    home_page: '',
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
    beer_price: '',
    beer_types: '',
    chuhai_price: '',
  };

  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
      });

      if (response.ok) {
        router.push('/'); // 成功したらホームページへリダイレクト
      } else {
        // エラー処理
        console.error('Failed to create restaurant');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <RestaurantNew
          restaurant={restaurant}
          handleInputChange={handleInputChange}
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

export default RestaurantNewPage;