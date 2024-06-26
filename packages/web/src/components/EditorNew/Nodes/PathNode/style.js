import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: '#0059f714',
  borderRadius: 20,
}));
