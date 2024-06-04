import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EditorWrapper = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  '& > div': {
    flexGrow: 1,
  },

  '& .react-flow__pane, & .react-flow__node': {
    cursor: 'auto !important',
  },
}));
