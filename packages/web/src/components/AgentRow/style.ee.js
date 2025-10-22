import { styled } from '@mui/material/styles';
import MuiStack from '@mui/material/Stack';
import MuiCardContent from '@mui/material/CardContent';
import MuiTypography from '@mui/material/Typography';

export const CardContent = styled(MuiCardContent)`
  display: grid;
  grid-template-areas: 'title menu';
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(2)};
  &:last-child {
    padding-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

export const Title = styled(MuiStack)`
  grid-area: title;
  min-width: 0;
`;

export const ContextMenu = styled('div')`
  grid-area: menu;
`;

export const Typography = styled(MuiTypography)`
  color: ${({ theme }) => theme.palette.text.primary};
`;
