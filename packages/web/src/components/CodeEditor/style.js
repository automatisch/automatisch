import { styled } from '@mui/material/styles';

export const InputLabelWrapper = styled('div')`
  position: absolute;
  top: ${({ theme }) => theme.spacing(1.75)};
  inset: 0;
  left: -6px;
  top: 16px;
`;
