import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MuiTabs from '@mui/material/Tabs';

export const ActionButtonsWrapper = styled(Stack)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const Tabs = styled(MuiTabs)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const SearchInputWrapper = styled('div')`
  padding: ${({ theme }) => theme.spacing(0, 2, 2, 2)};
`;
