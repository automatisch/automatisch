import { styled } from '@mui/material/styles';
import MuiIconButton, { iconButtonClasses } from '@mui/material/IconButton';

export const IconButton = styled(MuiIconButton)`
  &.${iconButtonClasses.colorPrimary}:not(.${iconButtonClasses.disabled}) {
    background: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};

    &:hover {
      background: ${({ theme }) => theme.palette.primary.dark};
    }
  }
` as typeof MuiIconButton;
