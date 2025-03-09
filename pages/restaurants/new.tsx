// pages/restaurants/new.tsx
import Navbar from '@/components/common/Navbar';
import { RestaurantNew } from '@/components/restaurant/RestaurantNew';
import { useRestaurantForm } from '@/hooks/restaurant/useRestaurantForm';
import { Container } from '@mui/material';
import styles from '../../styles/HomePage.module.css';

const NewRestaurantPage: React.FC = () => {

  const {
    restaurant,
    imagePreview,
    loading,
    error,
    handleInputChange,
    handleOperatingHoursChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit
  } = useRestaurantForm();


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
          loading={loading}
          error={error}
          isNew={true}
        />
      </Container>
    </div>
  );
};

export default NewRestaurantPage;