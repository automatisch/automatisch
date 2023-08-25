import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const Button = styled(MuiButton)(() => ({
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 0, 4px -4px, 0px 4px',
  transition: 'none',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  border: 0,
  borderRadius: 4,
  width: '24px',
  aspectRatio: '1 / 1',
  height: '24px',
  minWidth: 0,
})) as typeof MuiButton;
