import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import { useCallback,useState } from 'react';

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
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
