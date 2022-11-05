import { styled } from '@mui/material/styles';
import MuiCardContent from '@mui/material/CardContent';
import MuiBox from '@mui/material/Box';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: 'calc(30px * 3 + 8px * 2) minmax(0, auto) min-content',
  gridGap: theme.spacing(2),
  gridTemplateAreas: `
    "apps title arrow-container"
  `,
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    gridTemplateAreas: `
      "apps arrow-container"
      "title arrow-container"
    `,
    gridTemplateColumns: 'minmax(0, auto) min-content',
    gridTemplateRows: 'auto auto',
  },
}));

export const Apps = styled(MuiStack)(() => ({
  gridArea: 'apps',
}));
export const Title = styled(MuiStack)(() => ({
  gridArea: 'title',
}));

export const ArrowContainer = styled(MuiBox)(() => ({
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  gridArea: 'arrow-container',
}));
export const Typography = styled(MuiTypography)(() => ({
  display: 'inline-block',
  width: '100%',
  maxWidth: '85%',
}));

export const DesktopOnlyBreakline = styled('br')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
