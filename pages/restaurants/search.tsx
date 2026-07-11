import { LoadingState } from '@/components/common/LoadingState';
import Navbar from '@/components/common/Navbar';
import RestaurantList from '@/components/restaurant/RestaurantList';
import SearchFilterChips from '@/components/restaurant/SearchFilterChips';
import { useRestaurantSearch } from '@/hooks/restaurant/useRestaurantSearch';
import styles from '@/styles/HomePage.module.css';
import { Alert, Container } from '@mui/material';

import Head from 'next/head';
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
      <Head>
        <title>お店を探す | せんべろCheers</title>
        <meta
          name="description"
          content="エリアや立ち飲み・角打ち・せんべろセット・昼飲みなどの条件から大衆酒場を検索できます。"
        />
      </Head>
      <Navbar />
      <SearchFilterChips />
      {error && (
        <Container maxWidth="sm" sx={{ pt: 2 }}>
          <Alert severity="warning">{error}</Alert>
        </Container>
      )}
      {restaurantListComponent}
    </div>
  );
}

export default RestaurantListPage;