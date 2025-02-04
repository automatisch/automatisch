import { styled } from '@mui/material/styles';
import MuiListItemIcon from '@mui/material/ListItemIcon';

export const ListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(4),
}));
