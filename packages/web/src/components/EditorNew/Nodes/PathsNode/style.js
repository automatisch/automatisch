import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

export const Wrapper = styled(Card)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
`;
