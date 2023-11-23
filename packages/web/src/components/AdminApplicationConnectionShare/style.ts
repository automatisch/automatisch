import { styled } from '@mui/material/styles';
import BaseForm from 'components/Form';

export const Form = styled(BaseForm)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));
