import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const NodeWrapper = styled(Box)(({ theme }) => ({
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(0, 2.5),
}));

export const NodeInnerWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  flex: 1,
}));
