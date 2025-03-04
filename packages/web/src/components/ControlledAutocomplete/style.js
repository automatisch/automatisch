import { styled } from '@mui/material/styles';

export const Option = styled('li', {
  shouldForwardProp: (prop) => prop !== 'showOptionValue',
})(({ theme, showOptionValue }) => ({
  ...(showOptionValue && {
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexDirection: 'column',
    alignItems: 'start !important',
    padding: `${theme.spacing(2)} !important`,
  }),
}));
