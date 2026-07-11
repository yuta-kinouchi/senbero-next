// pages/restaurants/[id]/index.tsx
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import Navbar from '@/components/common/Navbar';
import RestaurantDetail from '@/components/restaurant/RestaurantDetail';
import { useRestaurantDetail } from '@/hooks/restaurant/useRestaurantDetail';
import styles from '@/styles/HomePage.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const RestaurantDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { restaurant, loading, error } = useRestaurantDetail(id as string);

  const restaurantDetailComponent = useMemo(() => {
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

    return <RestaurantDetail restaurant={restaurant} />;
  }, [restaurant, loading, error]);

  const title = restaurant?.name ? `${restaurant.name} | せんべろCheers` : 'せんべろCheers';
  const description = restaurant
    ? `${restaurant.name}(${restaurant.city ?? ''}${restaurant.address_line1 ?? ''})の営業時間・立ち飲み/角打ち/せんべろセットの有無などの情報。`
    : '大衆酒場・立ち飲み・せんべろの検索アプリ「せんべろCheers」。';

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <Navbar />
      {restaurantDetailComponent}
    </div>
  );
};

export default RestaurantDetailPage;