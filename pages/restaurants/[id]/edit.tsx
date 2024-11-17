// pages/restaurants/[id]/edit.tsx
import { RestaurantEdit } from '@/components/restaurant/RestaurantEdit';
import { useRestaurantEdit } from '@/hooks/restaurant/useRestaurantEdit';
import { useImageUpload } from '@/hooks/useImageUpload';
import styles from '@/styles/HomePage.module.css';
import { Alert, CircularProgress, Container, LinearProgress, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';


const RestaurantEditPage: React.FC = () => {
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
      } catch (uploadError) {
        setError(uploadError.message);
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