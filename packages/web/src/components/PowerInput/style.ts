import MuiTabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';

export const ChildrenWrapper = styled('div')`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
`;

export const InputLabelWrapper = styled('div')`
  position: absolute;
  left: ${({ theme }) => theme.spacing(1.75)};
  inset: 0;
  left: -6px;
`;

export const FakeInput = styled('div', {
  shouldForwardProp: (prop) => prop !== 'disabled',
}) <{ disabled?: boolean }>`
  border: 1px solid #eee;
  min-height: 56px;
  width: 100%;
  display: block;
  padding: ${({ theme }) => theme.spacing(0, 10, 0, 1.75)};
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  border-color: rgba(0, 0, 0, 0.23);
  position: relative;

  ${({ disabled, theme }) =>
    !!disabled && `
    color: ${theme.palette.action.disabled};
    border-color: ${theme.palette.action.disabled};
  `}

  &:hover {
    border-color: ${({ theme }) => theme.palette.text.primary};
  }

  &:focus-within, &:focus {
    &:before {
      border-color: ${({ theme }) => theme.palette.primary.main};
      border-radius: ${({ theme }) => theme.spacing(0.5)};
      border-style: solid;
      border-width: 2px;
      bottom: -2px;
      content: '';
      display: block;
      left: -2px;
      position: absolute;
      right: -2px;
      top: -2px;
    }
  }
`;

export const Tabs = styled(MuiTabs)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;
