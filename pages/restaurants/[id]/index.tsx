// pages/restaurants/[id]/index.tsx
import Navbar from '@/components/common/Navbar';
import RestaurantDetail from '@/components/restaurant/RestaurantDetail';
import prisma from '@/lib/prisma';
import { getSiteUrl } from '@/lib/siteUrl';
import styles from '@/styles/HomePage.module.css';
import { Restaurant } from '@/types/restaurant';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

interface RestaurantDetailPageProps {
  restaurant: Restaurant;
  siteUrl: string;
}

// 曜日番号をschema.orgのdayOfWeek表記へ
const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const toTimeString = (value?: Date | string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;
  // 営業時間はJSTの時刻が1970-01-01のUTC時刻として保存されている
  const jst = new Date(date.getTime() - 9 * 60 * 60 * 1000);
  return jst.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' });
};

const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({ restaurant, siteUrl }) => {
  const areaLabel = `${restaurant.state ?? ''}${restaurant.city ?? ''}`;
  const title = `${restaurant.name} | ${areaLabel}のせんべろ・大衆酒場 | せんべろCheers`;
  const features = [
    restaurant.is_standing && '立ち飲み',
    restaurant.is_kakuuchi && '角打ち',
    restaurant.has_set && 'せんべろセット',
    restaurant.daytime_available && '昼飲み',
    restaurant.morning_available && '朝飲み',
  ].filter(Boolean).join('・');
  const description = restaurant.description
    ? `${restaurant.name}(${areaLabel})。${restaurant.description}`
    : `${restaurant.name}(${areaLabel})の営業時間・${features || 'せんべろ情報'}。`;
  const canonicalUrl = `${siteUrl}/restaurants/${restaurant.restaurant_id}`;
  const imageUrl = restaurant.restaurant_image || `${siteUrl}/default-restaurant-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: restaurant.name,
    url: canonicalUrl,
    image: imageUrl,
    servesCuisine: '居酒屋',
    address: {
      '@type': 'PostalAddress',
      addressRegion: restaurant.state,
      addressLocality: restaurant.city,
      streetAddress: `${restaurant.address_line1 ?? ''}${restaurant.address_line2 ?? ''}`,
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    ...(restaurant.phone_number ? { telephone: restaurant.phone_number } : {}),
    ...(restaurant.set_price || restaurant.beer_price
      ? { priceRange: `¥${restaurant.set_price || restaurant.beer_price}~` }
      : {}),
    ...(restaurant.operating_hours && restaurant.operating_hours.length > 0
      ? {
          openingHoursSpecification: restaurant.operating_hours
            .map((hour) => {
              const opens = toTimeString(hour.open_time);
              const closes = toTimeString(hour.close_time);
              if (!opens || !closes) return null;
              return {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: SCHEMA_DAYS[hour.day_of_week],
                opens,
                closes,
              };
            })
            .filter(Boolean),
        }
      : {}),
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="せんべろCheers" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Navbar />
      <RestaurantDetail restaurant={restaurant} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string, 10);
  if (isNaN(id)) {
    return { notFound: true };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { restaurant_id: id },
    include: { operating_hours: true },
  });

  if (!restaurant || restaurant.deleted_at) {
    return { notFound: true };
  }

  return {
    props: {
      // Date型はそのままpropsに渡せないためJSONシリアライズする
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      siteUrl: getSiteUrl(),
    },
  };
};

export default RestaurantDetailPage;
