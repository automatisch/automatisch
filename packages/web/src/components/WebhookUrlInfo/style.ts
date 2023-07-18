import { styled } from '@mui/material/styles';
import MuiAlert, { alertClasses } from '@mui/material/Alert';

export const Alert = styled(MuiAlert)(() => ({
  [`&.${alertClasses.root}`]: {
    fontWeight: 300,
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  [`& .${alertClasses.message}`]: {
    width: '100%'
  }
}));
