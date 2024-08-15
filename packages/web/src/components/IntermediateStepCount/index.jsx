import * as React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import { Container } from './style';

function IntermediateStepCount(props) {
  const { count } = props;

  return (
    <Container>
      <Typography variant="subtitle1" sx={{}}>
        +{count}
      </Typography>
    </Container>
  );
}

IntermediateStepCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default IntermediateStepCount;
