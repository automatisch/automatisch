import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 50,
  height: 50,
  border: '1px solid #000',
  borderRadius: theme.shape.borderRadius,
}));
