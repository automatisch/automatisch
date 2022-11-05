import * as React from 'react';
import Slide, { SlideProps } from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export default function HideOnScroll(props: SlideProps): React.ReactElement {
  const trigger = useScrollTrigger();

  return <Slide appear={false} direction="down" in={!trigger} {...props} />;
}
