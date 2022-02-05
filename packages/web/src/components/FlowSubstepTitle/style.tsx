import { styled } from '@mui/material/styles';
import MuiListItemButton from '@mui/material/ListItemButton';
import MuiTypography from '@mui/material/Typography';

export const ListItemButton = styled(MuiListItemButton)`
  justify-content: space-between;
`;

export const Typography = styled(MuiTypography)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;
