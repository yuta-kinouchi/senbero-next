// pages/areas/[slug].tsx エリア別ランディングページ(SSR)
import Navbar from '@/components/common/Navbar';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { AREAS, findArea } from '@/lib/areas';
import prisma from '@/lib/prisma';
import { getSiteUrl } from '@/lib/siteUrl';
import styles from '@/styles/HomePage.module.css';
import { Restaurant } from '@/types/restaurant';
import { Box, Container, Stack, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AreaPageProps {
  slug: string;
  label: string;
  areaDescription: string;
  restaurants: Restaurant[];
  siteUrl: string;
}

const AreaPage: React.FC<AreaPageProps> = ({ slug, label, areaDescription, restaurants, siteUrl }) => {
  const router = useRouter();
  const title = `${label}のせんべろ・立ち飲み・大衆酒場一覧(${restaurants.length}件) | せんべろCheers`;
  const description = `${areaDescription} ${label}エリアの登録店舗${restaurants.length}件を掲載中。`;
  const canonicalUrl = `${siteUrl}/areas/${slug}`;

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="せんべろCheers" />
      </Head>
      <Navbar />
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 }, pt: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          {label}のせんべろ・立ち飲み・大衆酒場
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {areaDescription}
        </Typography>

        <Stack spacing={1.5} sx={{ pb: 3 }}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              href={`/restaurants/${restaurant.restaurant_id}`}
              onClick={() => router.push(`/restaurants/${restaurant.restaurant_id}`)}
            />
          ))}
        </Stack>

        <Box sx={{ pb: 5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            他のエリアから探す
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {AREAS.filter((area) => area.slug !== slug).map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`}>
                <Typography variant="body2" color="primary.dark" sx={{ fontWeight: 700 }}>
                  {area.label}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const area = findArea(slug);
  if (!area) {
    return { notFound: true };
  }

  const restaurants = await prisma.restaurant.findMany({
    where: {
      city: { in: area.cities },
      deleted_at: null,
    },
    include: { operating_hours: true },
    orderBy: { restaurant_id: 'asc' },
  });

  return {
    props: {
      slug,
      label: area.label,
      areaDescription: area.description,
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      siteUrl: getSiteUrl(),
    },
  };
};

export default AreaPage;
