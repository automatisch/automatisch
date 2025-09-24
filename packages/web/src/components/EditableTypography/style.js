import { styled } from '@mui/material/styles';
import MuiBox from '@mui/material/Box';
import MuiTextField from '@mui/material/TextField';
import { inputClasses } from '@mui/material/Input';

const boxShouldForwardProp = (prop) => !['editing', 'disabled'].includes(prop);

export const Box = styled(MuiBox, {
  shouldForwardProp: boxShouldForwardProp,
})`
  display: inline-flex;
  align-items: center;
  position: relative;
  ${({ disabled }) => !disabled && 'cursor: pointer;'}
  ${({ editing }) =>
    editing &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: currentColor;
      opacity: 0.5;
    }
  `}
`;

export const TextField = styled(MuiTextField)({
  minWidth: 'fit-content',
  [`.${inputClasses.root}`]: {
    '&:before, &:after, &:hover': {
      borderBottom: '0 !important',
    },
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
});
