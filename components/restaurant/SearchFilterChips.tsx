import { FEATURE_TAGS } from '@/utils/features';
import { Box, Chip, Container } from '@mui/material';
import { useRouter } from 'next/router';

// 検索結果画面の上部で特徴の絞り込みをその場で切り替えるチップ列。
// チップのON/OFFでURLクエリのfeaturesを書き換えると、
// useRestaurantSearchがクエリ変更を検知して自動的に再検索する。
const SearchFilterChips = () => {
  const router = useRouter();

  const featuresParam = router.query.features;
  const selected = new Set(
    (Array.isArray(featuresParam) ? featuresParam.join(',') : featuresParam || '')
      .split(',')
      .filter(Boolean)
  );

  const toggleFeature = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    const query: Record<string, string | string[]> = { ...router.query } as Record<string, string | string[]>;
    if (next.size > 0) {
      query.features = Array.from(next).join(',');
    } else {
      delete query.features;
    }

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: false });
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 }, pt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          // モバイルで横スクロールバーを目立たせない
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {FEATURE_TAGS.map((tag) => {
          const active = selected.has(tag.key);
          return (
            <Chip
              key={tag.key}
              label={tag.label}
              size="small"
              clickable
              onClick={() => toggleFeature(tag.key)}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              sx={{ flexShrink: 0, fontWeight: 700 }}
            />
          );
        })}
      </Box>
    </Container>
  );
};

export default SearchFilterChips;
