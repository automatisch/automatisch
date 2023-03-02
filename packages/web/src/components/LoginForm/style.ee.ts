import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export const Link = styled(RouterLink)(({theme}) => ({
  textDecoration: 'underline',
  marginLeft: theme.spacing(0.5)
}));