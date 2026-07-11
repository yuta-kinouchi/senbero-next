import AddIcon from '@mui/icons-material/Add'; // Addアイコンをインポート
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { signOut, useSession } from "next-auth/react";
import { useState } from 'react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <IconButton href="/" edge="start" aria-label="menu" onClick={handleMenuToggle}>
          <SportsBarIcon sx={{ color: 'primary.main' }} />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}>
          せんべろCheers
        </Typography>

        {/* レストラン追加ボタン */}
        <Button
          href="/restaurants/new"  // 新規追加ページへのリンク
          variant="outlined"
          color="secondary"
          startIcon={<AddIcon />}
          size="small"
        >
          店舗を追加
        </Button>

        {/* {session ? (
          <>
            <Typography variant="subtitle1" style={{ marginRight: '1rem', color: 'black' }}>
              {session.user.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
          </>
        ) : (
          <>
            <Button href="/login" color="inherit" style={{ color: 'black' }}>ログイン</Button>
            <Button href="/register" color="inherit" style={{ color: 'black' }}>新規登録</Button>
          </>
        )} */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;