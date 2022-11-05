import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Container from 'components/Container';

type FlowParams = {
  flowId: string;
};

export default function Flow(): React.ReactElement {
  const { flowId } = useParams() as FlowParams;

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container>
          <Grid item xs>
            {flowId}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
