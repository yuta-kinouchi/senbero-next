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
    <AppBar position="static" style={{ backgroundColor: 'white' }}>
      <Toolbar>
        <IconButton href="/" edge="start" color="inherit" aria-label="menu" onClick={handleMenuToggle}>
          <SportsBarIcon style={{ color: 'black' }} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>
          せんべろCheers
        </Typography>
        {session ? (
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;