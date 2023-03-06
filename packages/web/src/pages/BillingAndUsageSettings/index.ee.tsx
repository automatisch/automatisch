import * as React from 'react';
import { Navigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import * as URLS from 'config/urls'
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import useFormatMessage from 'hooks/useFormatMessage';
import useCloud from 'hooks/useCloud';

function BillingAndUsageSettings() {
  const isCloud = useCloud();
  const formatMessage = useFormatMessage();

  if (!isCloud) {
    return (<Navigate to={URLS.SETTINGS} replace={true} />)
  }

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('billingAndUsageSettings.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{pt: 5 }}>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BillingAndUsageSettings;
