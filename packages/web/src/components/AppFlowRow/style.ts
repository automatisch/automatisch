import { styled } from '@mui/material/styles';
import MuiCardContent from '@mui/material/CardContent';
import MuiTypography from '@mui/material/Typography';

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: '1fr auto',
  gridColumnGap: theme.spacing(2),
  alignItems: 'center',
}));


export const Typography = styled(MuiTypography)(() => ({
  display: 'inline-block',
  width: 300,
  maxWidth: '50%',
}));
