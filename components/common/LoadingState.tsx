// components/LoadingState.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingState = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2 
      }}
    >
      <CircularProgress />
      <Typography>情報を読み込んでいます...</Typography>
    </Box>
  );
};
