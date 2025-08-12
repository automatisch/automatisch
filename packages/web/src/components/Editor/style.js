import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const EditorWrapper = styled(Box)(() => ({
  flexGrow: 1,
  position: 'relative',
  margin: 0,
  height: '100%',
  backgroundColor: '#fafafa',
  backgroundImage: `radial-gradient(circle at 1px 1px, #d3d3d3 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
  backgroundPosition: '10px 10px, 12px 12px',
  overflow: 'hidden',

  '& > div': {
    flexGrow: 1,
    height: '100%',
  },

  '& .react-flow__pane': {
    cursor: 'auto !important',
  },

  '& .react-flow__node': {
    cursor: 'pointer !important',
  },

  // Make ReactFlow background transparent to show our dot pattern
  '& .react-flow': {
    backgroundColor: 'transparent',
  },

  '& .react-flow__background': {
    backgroundColor: 'transparent',
  },

  '& .react-flow__minimap': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
}));
