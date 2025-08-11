import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';

export const AppIconWrapper = styled('div')`
  position: relative;
`;

export const AppIconStatusIconWrapper = styled('span')`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  display: inline-flex;

  svg {
    // to make it distinguishable over an app icon
    background: white;
    border-radius: 100%;
    overflow: hidden;
  }
`;

export const Wrapper = styled(Card)`
  width: 300px;
  overflow: unset;
  margin: 0 auto;
`;

export const Header = styled('div')`
  padding: ${({ theme }) => theme.spacing(1.5)};
  cursor: pointer;
  position: relative;
`;

export const Content = styled('div')`
  border: 1px solid ${({ theme }) => alpha(theme.palette.divider, 0.8)};
  border-left: none;
  border-right: none;
  padding: ${({ theme }) => theme.spacing(2, 0)};
`;

export const ContextMenuButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`;
