import { styled } from '@mui/material/styles';
import MuiCardContent from '@mui/material/CardContent';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: 'calc(30px * 3 + 8px * 2) minmax(0, auto) min-content',
  gridGap: theme.spacing(2),
  gridTemplateAreas: `
    "apps title menu"
  `,
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    gridTemplateAreas: `
      "apps menu"
      "title menu"
    `,
    gridTemplateColumns: 'minmax(0, auto) min-content',
    gridTemplateRows: 'auto auto',
  }
}));

export const Apps = styled(MuiStack)(() => ({
  gridArea: 'apps',
}));

export const Typography = styled(MuiTypography)(() => ({
  display: 'inline-block',
  width: 500,
  maxWidth: '70%',
}));

export const DesktopOnlyBreakline = styled('br')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  }
}));
