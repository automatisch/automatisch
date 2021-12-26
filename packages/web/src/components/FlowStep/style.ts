import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';

export const Wrapper = styled(Card)`
  width: 100%;
`;

type HeaderProps = {
  borderBottom?: boolean;
}

export const Header = styled('div', { shouldForwardProp: prop => prop !== 'borderBottom' })<HeaderProps>`
  border-bottom: 1px solid ${({ theme, borderBottom }) => borderBottom ? alpha(theme.palette.divider, .8) : 'transparent'};
  padding: ${({ theme }) => theme.spacing(2, 2)};
  cursor: ${({ borderBottom }) => borderBottom ? 'unset' : 'pointer'};
`;