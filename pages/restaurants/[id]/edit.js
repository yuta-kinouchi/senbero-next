import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
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
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/restaurants/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant');
        }
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

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    handleInputChange({
      target: {
        name,
        value: checked,
      },
    });
  };

  const cleanObject = (obj) => {
    const cleanedObj = {};
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] !== 'object' || obj[key] === null) {
        cleanedObj[key] = obj[key];
      } else if (obj[key] instanceof File) {
        // ファイルオブジェクトは特別に処理
        cleanedObj[key] = {
          name: obj[key].name,
          type: obj[key].type,
          size: obj[key].size,
        };
      }
      // その他のオブジェクトや配列は除外
    });
    return cleanedObj;
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    console.log('Received formData:', formData);
    try {
      let updatedRestaurantData = { ...formData };
      delete updatedRestaurantData.imageFile;

      // 新しい画像がアップロードされた場合
      if (formData.imageFile instanceof File) {
        try {
          const imageUrl = await handleImageUpload(formData.imageFile, id);
          console.log('Uploaded image URL:', imageUrl);
          updatedRestaurantData.restaurant_image = imageUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('画像のアップロードに失敗しました。他の情報は更新されます。');
        }
      }

      console.log('Data to be sent to server:', updatedRestaurantData);

      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRestaurantData),
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      const updatedRestaurant = await response.json();
      console.log('Updated restaurant data:', updatedRestaurant);
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
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage('');
    setError(null);
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

  return (
    <div className={styles.container}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>Error: {error}</p>
          </div>
        ) : (
          <RestaurantEdit
            restaurant={restaurant}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCheckboxChange={handleCheckboxChange}
            handleImageUpload={handleImageUpload}
          />
        )}
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