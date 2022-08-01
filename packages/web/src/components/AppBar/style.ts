import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export const Link = styled(RouterLink)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'inline-flex',
}));
