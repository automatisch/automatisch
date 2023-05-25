import { styled } from '@mui/material/styles';
import MuiIconButton from '@mui/material/IconButton';
import MuiTabs from '@mui/material/Tabs';

export const FakeDropdownButton = styled(MuiIconButton)`
  position: absolute;
  right: ${({ theme }) => theme.spacing(1)};
  top: 50%;
  transform: translateY(-50%);
`;

export const Tabs = styled(MuiTabs)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const SearchInputWrapper = styled('div')`
  padding: ${({ theme }) => theme.spacing(0, 2, 2, 2)};
`;
