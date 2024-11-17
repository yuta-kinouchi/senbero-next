import Navbar from '@/components/Navbar';
import styles from '@/styles/HomePage.module.css';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import RestaurantEdit from '@components/RestaurantEdit';
import { Alert, CircularProgress, Container, LinearProgress, Snackbar } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// S3クライアントの初期化
const s3Client = typeof window !== 'undefined'
  ? new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
  })
  : null;

const RestaurantEditPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleImageUpload = async (file, id) => {
    try {
      setUploadProgress(0);
      console.log('Original file:', file.name, file.size, file.type);

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        preserveExif: false,
      };

      console.log('Compression options:', options);

      const compressedFile = await imageCompression(file, options);
      console.log('Compressed file:', compressedFile.name, compressedFile.size, compressedFile.type);

      const fileName = `restaurant_${id}_${Date.now()}.${compressedFile.name.split('.').pop()}`;
      console.log('Generated file name:', fileName);

      console.log('S3 Bucket Name:', process.env.NEXT_PUBLIC_S3_BUCKET_NAME);

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: fileName,
          Body: compressedFile,
          ContentType: compressedFile.type
        },
      });

      upload.on("httpUploadProgress", (progress) => {
        const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentUploaded);
        console.log('Upload progress:', percentUploaded + '%');
      });

      const result = await upload.done();
      setUploadProgress(100);
      console.log('Upload completed. File location:', result.Location);
      return result.Location;
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error stack:", error.stack);
      if (error.response) {
        console.error("S3 error response:", error.response);
      }
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

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
          setError(uploadError.message);
          setLoading(false);
          return;
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
        {uploadProgress > 0 && uploadProgress < 100 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
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