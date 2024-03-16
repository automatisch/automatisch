import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

export const TopBar = styled(Stack)(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
}));
