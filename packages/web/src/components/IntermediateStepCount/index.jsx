import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from './style';
export default function IntermediateStepCount(props) {
  const { count } = props;
  return (
    <Container>
      <Typography variant="subtitle1" sx={{}}>
        +{count}
      </Typography>
    </Container>
  );
}
