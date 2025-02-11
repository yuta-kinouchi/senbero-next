// pages/restaurants/[id]/edit.tsx
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import Navbar from '@/components/common/Navbar';
import RestaurantEdit from '@/components/restaurant/RestaurantEdit';
import { useImageUpload } from '@/hooks/common/useImageUpload';
import { useRestaurantEdit } from '@/hooks/restaurant/useRestaurantEdit';
import styles from '@/styles/HomePage.module.css';
import { Alert, Container, LinearProgress, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const RestaurantEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    restaurant,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    setError,
    setSuccessMessage
  } = useRestaurantEdit(id as string);

  const {
    uploadProgress,
    imagePreview,
    imageFile,
    handleFileChange,
    uploadImage
  } = useImageUpload();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    let updatedRestaurantData = { ...restaurant };

    if (imageFile) {
      try {
        const imageUrl = await uploadImage(imageFile, id as string);
        updatedRestaurantData.restaurant_image = imageUrl;
      } catch (error) {
        const uploadError = error instanceof Error
          ? error.message
          : '画像アップロードに失敗しました';
        setError(uploadError);
        return;
      }
    }

    await handleSubmit(updatedRestaurantData);
  };

  const restaurantEditComponent = useMemo(() => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    if (!restaurant) {
      return (
        <div className={styles.notFoundContainer}>
          <p>Restaurant not found</p>
        </div>
      );
    }

    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
        <RestaurantEdit
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleSubmit={handleFormSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
        />
        <Snackbar
          open={!!successMessage || !!error}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert
            onClose={() => setSuccessMessage('')}
            severity={successMessage ? "success" : "error"}
            sx={{ width: '100%' }}
          >
            {successMessage || error}
          </Alert>
        </Snackbar>
      </Container>
    );
  }, [
    restaurant,
    loading,
    error,
    uploadProgress,
    successMessage,
    imagePreview,
    handleInputChange,
    handleFormSubmit,
    handleCheckboxChange,
    handleFileChange,
    setSuccessMessage
  ]);

  return (
    <div className={styles.container}>
      <Navbar />
      {restaurantEditComponent}
    </div>
  );
};

export default RestaurantEditPage;