import { LoadingState } from '@/components/common/LoadingState';
import Navbar from '@/components/common/Navbar';
import RestaurantList from '@/components/restaurant/RestaurantList';
import { useRestaurantSearch } from '@/hooks/restaurant/useRestaurantSearch';
import styles from '@/styles/HomePage.module.css';

import { useRouter } from 'next/router';
import { useMemo } from 'react';

const RestaurantListPage = () => {
  const router = useRouter();
  const {
    restaurants,
    loading,
    error,
  } = useRestaurantSearch();

  const restaurantListComponent = useMemo(() => {
    if (loading) {
      return <LoadingState />;
    }
  
    return <RestaurantList restaurants={restaurants} />;
  }, [restaurants, loading]);
  
  return (
    <div className={styles.container}>
      <Navbar />
      {restaurantListComponent}
    </div>
  );
}

export default RestaurantListPage;