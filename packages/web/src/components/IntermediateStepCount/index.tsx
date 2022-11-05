import * as React from 'react';
import Typography from '@mui/material/Typography';

import { Container } from './style';

type IntermediateStepCountProps = {
  count: number;
};

export default function IntermediateStepCount(
  props: IntermediateStepCountProps
) {
  const { count } = props;

  return (
    <Container>
      <Typography variant="subtitle1" sx={{}}>
        +{count}
      </Typography>
    </Container>
  );
}
