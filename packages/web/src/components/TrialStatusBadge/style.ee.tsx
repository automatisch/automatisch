import { styled } from '@mui/material/styles';
import MuiChip, { chipClasses } from '@mui/material/Chip';

export const Chip = styled(MuiChip)`
  &.${chipClasses.root} {
    font-weight: 500;
  }

  &.${chipClasses.colorWarning} {
    background: #fef3c7;
    color: #78350f;
  }
` as typeof MuiChip;
