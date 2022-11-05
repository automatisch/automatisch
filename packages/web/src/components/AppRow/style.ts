import { styled } from '@mui/material/styles';
import MuiCardContent from '@mui/material/CardContent';
import MuiTypography from '@mui/material/Typography';

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: 'auto 1fr auto auto auto',
  gridColumnGap: theme.spacing(2),
  alignItems: 'center',
}));

export const Typography = styled(MuiTypography)(() => ({
  '&.MuiTypography-h6': {
    textTransform: 'capitalize',
  },
  textAlign: 'center',
  display: 'inline-block',
}));

export const DesktopOnlyBreakline = styled('br')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
