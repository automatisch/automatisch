import { styled } from '@mui/material/styles';

export const InputLabelWrapper = styled('div')`
  position: absolute;
  left: ${({ theme }) => theme.spacing(1.75)};
  inset: 0;
  left: -6px;
`;

export const FakeInput = styled('div')`
  border: 1px solid #eee;
  min-height: 52px;
  width: 100%;
  display: block;
  padding: ${({ theme }) => theme.spacing(0, 1.75)};
  border-radius: ${({ theme }) => theme.spacing(.5)};
  border-color: rgba(0, 0, 0, 0.23);
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.palette.text.primary};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
    border-width: 2px;
  }
`;
