// pages/restaurants/[id]/edit.tsx
import RestaurantEdit from '@/components/restaurant/RestaurantEdit';
import { useImageUpload } from '@/hooks/common/useImageUpload';
import { useRestaurantEdit } from '@/hooks/restaurant/useRestaurantEdit';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import styles from '@/styles/HomePage.module.css';
import { Alert, CircularProgress, Container, LinearProgress, Snackbar } from '@mui/material';

const RestaurantEditPage: React.FC = () => {
  const { getCurrentId } = useAppNavigation();
  const restaurantId = getCurrentId();
  
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
  } = useRestaurantEdit(restaurantId);

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
        const imageUrl = await uploadImage(imageFile, restaurantId);
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

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default RestaurantEditPage;