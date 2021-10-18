import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import Toolbar from '@mui/material/Toolbar';

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const onMenuClick = useCallback(() => { setDrawerOpen(value => !value) }, []);

  return (
    <>
      <AppBar onMenuClick={onMenuClick} />

      <Box sx={{ display: 'flex', }}>
        <Drawer open={isDrawerOpen} />

        <Box sx={{ flex: 1 }}>
          <Toolbar />

          {children}
        </Box>
      </Box>
    </>
  );
}
