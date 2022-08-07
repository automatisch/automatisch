import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 30,
  height: 30,
  border: `1px solid ${theme.palette.text.disabled}`,
  borderRadius: theme.shape.borderRadius,
}));
