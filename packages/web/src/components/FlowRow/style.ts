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


export const Typography = styled(MuiTypography)(({ theme }) => ({
  '&.MuiTypography-h6': {
    textTransform: 'capitalize',
  },
  display: 'inline-block',
  width: 500,
  maxWidth: '70%',
}));

export const DesktopOnlyBreakline = styled('br')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  }
}));
