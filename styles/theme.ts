import { createTheme } from '@mui/material/styles';

// ビール・せんべろのイメージを残しつつ、全面ベタ塗りではなく
// アクセントカラーとして落ち着かせたパレット。
export const palette = {
  cream: '#FBF6EC',
  paper: '#FFFFFF',
  ink: '#2A2019',
  inkSoft: '#6B5F55',
  amber: '#DDA02A',
  amberDark: '#A8721B',
  amberSoft: '#F3E4C4',
};

const theme = createTheme({
  palette: {
    primary: {
      main: palette.amber,
      dark: palette.amberDark,
      contrastText: palette.ink,
    },
    secondary: {
      main: palette.ink,
    },
    background: {
      default: palette.cream,
      paper: palette.paper,
    },
    text: {
      primary: palette.ink,
      secondary: palette.inkSoft,
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'var(--font-sans), "Hiragino Sans", "Yu Gothic", sans-serif',
    h2: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          color: palette.ink,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(42, 32, 25, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 rgba(42, 32, 25, 0.08)',
        },
      },
    },
  },
});

export default theme;
