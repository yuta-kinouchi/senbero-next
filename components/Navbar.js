import MenuIcon from '@mui/icons-material/Menu';
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
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        {session ? (
          <>
            <Typography variant="subtitle1" style={{ marginRight: '1rem' }}>
              {session.user.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
          </>
        ) : (
          <>
            <Button href="/login" color="inherit">ログイン</Button>
            <Button href="/register" color="inherit">新規登録</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;