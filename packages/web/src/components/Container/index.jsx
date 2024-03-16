import * as React from 'react';
import MuiContainer from '@mui/material/Container';

export default function Container(props) {
  return <MuiContainer {...props} />;
}

Container.defaultProps = {
  maxWidth: 'lg',
};
