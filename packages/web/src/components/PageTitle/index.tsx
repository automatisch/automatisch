import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

type PageTitleProps = TypographyProps;

export default function PageTitle(props: PageTitleProps): React.ReactElement {
  return <Typography variant="h3" data-test="page-title" {...props} />;
}
