import { Alert, CircularProgress, Container, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import RestaurantEdit from '../../../components/RestaurantEdit';
import styles from '../../../styles/HomePage.module.css';

const RestaurantEditPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/restaurants/${id}`);
        if (!response.ok) throw new Error('Failed to fetch restaurant');
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => (event) => {
    const { checked } = event.target;
    setRestaurant(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let updatedRestaurantData = { ...restaurant };

      ['beer_price', 'chuhai_price'].forEach(field => {
        if (updatedRestaurantData[field] === '') {
          updatedRestaurantData[field] = null;
        } else {
          const parsedValue = parseInt(updatedRestaurantData[field], 10);
          updatedRestaurantData[field] = isNaN(parsedValue) ? null : parsedValue;
        }
      });

      if (imageFile) {
        try {
          const imageUrl = await handleImageUpload(imageFile, id);
          updatedRestaurantData.restaurant_image = imageUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('画像のアップロードに失敗しました。他の情報は更新されます。');
        }
      }

      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRestaurantData),
      });

      if (!response.ok) throw new Error('Failed to update restaurant');

      const updatedRestaurant = await response.json();
      setRestaurant(updatedRestaurant);
      setSuccessMessage('レストランの編集に成功しました。詳細ページへ移動します。');

      setTimeout(() => {
        router.push(`/restaurants/${id}`);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, id) => {
    try {
      const fileName = `restaurant_${id}_${Date.now()}.${file.name.split('.').pop()}`;

      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        },
      });

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: fileName,
          Body: file,
        },
      });

      const result = await upload.done();
      return result.Location; // S3のURL
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSuccessMessage('');
    setError(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <RestaurantEdit
          restaurant={restaurant}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
        />
      </Container>
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RestaurantEditPage;