import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';


export default function Applications() {

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <PageTitle>Application!</PageTitle>
          </Grid>

          <Grid container item xs={6} justifyContent="flex-end">
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
