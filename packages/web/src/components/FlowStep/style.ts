import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';

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
  width: 100%;
  overflow: unset;
`;

type HeaderProps = {
  collapsed?: boolean;
};

export const Header = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<HeaderProps>`
  padding: ${({ theme }) => theme.spacing(2)};
  cursor: ${({ collapsed }) => (collapsed ? 'pointer' : 'unset')};
`;

export const Content = styled('div')`
  border: 1px solid ${({ theme }) => alpha(theme.palette.divider, 0.8)};
  border-left: none;
  border-right: none;
  padding: ${({ theme }) => theme.spacing(2, 0)};
`;
