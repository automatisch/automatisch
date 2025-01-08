import { styled } from '@mui/material/styles';
import MuiBox from '@mui/material/Box';
import MuiTextField from '@mui/material/TextField';
import { inputClasses } from '@mui/material/Input';

const boxShouldForwardProp = (prop) => !['editing', 'disabled'].includes(prop);

export const Box = styled(MuiBox, {
  shouldForwardProp: boxShouldForwardProp,
})`
  display: flex;
  flex: 1;
  min-width: 300px;
  max-width: 90%;
  height: 33px;
  align-items: center;
  ${({ disabled }) => !disabled && 'cursor: pointer;'}
  ${({ editing }) => editing && 'border-bottom: 1px dashed #000;'}
`;

export const TextField = styled(MuiTextField)({
  width: '100%',
  [`.${inputClasses.root}:before, .${inputClasses.root}:after, .${inputClasses.root}:hover`]:
    {
      borderBottom: '0 !important',
    },
});
