import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const NodeWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

export const NodeInnerWrapper = styled(Box)(() => ({
  maxWidth: 350,
  flex: 1,
}));
