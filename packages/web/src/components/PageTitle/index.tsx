import * as React from 'react';
import Typography from '@mui/material/Typography';

type PageTitleProps = {
  children: React.ReactNode;
};

export default function PageTitle(props: PageTitleProps): React.ReactElement {
  const { children } = props;

  return (
    <Typography variant="h3">
      {children}
    </Typography>
  );
}