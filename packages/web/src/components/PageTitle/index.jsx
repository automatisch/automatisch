import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function PageTitle(props) {
  return <Typography variant="h3" data-test="page-title" {...props} />;
}
