import { styled } from '@mui/material/styles';
import MuiBox from '@mui/material/Box';
import MuiTextField from '@mui/material/TextField';
import { inputClasses } from '@mui/material/Input';

const boxShouldForwardProp = (prop) => !['editing', 'disabled'].includes(prop);

export const Box = styled(MuiBox, {
  shouldForwardProp: boxShouldForwardProp,
})(({ theme, disabled, editing }) => ({
  display: 'flex',
  flex: 1,
  minWidth: '300px',
  maxWidth: '90%',
  height: '33px',
  alignItems: 'center',
  ...(!disabled ? { cursor: 'pointer' } : {}),
  ...(editing ? { borderBottom: '1px dashed #000' } : {}),
  [theme.breakpoints.down('sm')]: {
    minWidth: '210px',
  },
}));

export const TextField = styled(MuiTextField)({
  width: '100%',
  [`.${inputClasses.root}:before, .${inputClasses.root}:after, .${inputClasses.root}:hover`]:
    {
      borderBottom: '0 !important',
    },
});
