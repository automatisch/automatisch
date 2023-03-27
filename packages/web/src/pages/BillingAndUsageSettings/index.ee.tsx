import * as React from 'react';
import { Navigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import * as URLS from 'config/urls';
import UsageDataInformation from 'components/UsageDataInformation/index.ee';
import Invoices from 'components/Invoices/index.ee';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import useFormatMessage from 'hooks/useFormatMessage';
import useCloud from 'hooks/useCloud';

function BillingAndUsageSettings() {
  const isCloud = useCloud();
  const formatMessage = useFormatMessage();

  // redirect to the initial settings page
  if (isCloud === false) {
    return <Navigate to={URLS.SETTINGS} replace={true} />;
  }

  // render nothing until we know if it's cloud or not
  // here, `isCloud` is not `false`, but `undefined`
  if (!isCloud) return <React.Fragment />;

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>
            {formatMessage('billingAndUsageSettings.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} sx={{ mb: 6 }}>
          <UsageDataInformation />
        </Grid>

        <Grid item xs={12} sx={{ mb: 6 }}>
          <Invoices />
        </Grid>
      </Grid>
    </Container>
  );
}

export default BillingAndUsageSettings;
