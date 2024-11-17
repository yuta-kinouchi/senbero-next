// pages/restaurants/[id].tsx
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import Navbar from '@/components/common/Navbar';
import RestaurantDetail from '@/components/restaurant/RestaurantDetail';
import { useRestaurantDetail } from '@/hooks/restaurant/useRestaurantDetail';
import styles from '@/styles/HomePage.module.css';
import { useRouter } from 'next/router';

const RestaurantDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { restaurant, loading, error } = useRestaurantDetail(id as string);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      {restaurant ? (
        <RestaurantDetail restaurant={restaurant} />
      ) : (
        <div className={styles.notFoundContainer}>
          <p>Restaurant not found</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;