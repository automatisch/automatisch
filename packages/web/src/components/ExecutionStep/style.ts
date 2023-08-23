import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export const AppIconWrapper = styled('div')`
  display: flex;
  align-items: center;
`;


export const AppIconStatusIconWrapper = styled('span')`
  display: inline-flex;
  position: relative;

  svg {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
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
}) <HeaderProps>`
  padding: ${({ theme }) => theme.spacing(2)};
  cursor: ${({ collapsed }) => (collapsed ? 'pointer' : 'unset')};
`;

export const Content = styled('div')`
  border: 1px solid ${({ theme }) => alpha(theme.palette.divider, 0.8)};
  border-left: none;
  border-right: none;
  padding: ${({ theme }) => theme.spacing(2, 0)};
`;

export const Metadata = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "step id"
    "step date";

  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-template-rows: auto auto auto;
    grid-template-areas:
    "id"
    "step"
    "date";
  }
` as typeof Box;
