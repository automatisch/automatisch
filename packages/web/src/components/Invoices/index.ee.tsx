import * as React from 'react';
import { DateTime } from 'luxon';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import useInvoices from 'hooks/useInvoices.ee';
import useFormatMessage from 'hooks/useFormatMessage';

export default function Invoices() {
  const formatMessage = useFormatMessage();
  const { invoices, loading } = useInvoices();

  if (loading || invoices.length === 0) return <React.Fragment />;

  return (
    <React.Fragment>
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              {formatMessage('invoices.invoices')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container item xs={12} spacing={1} alignItems="stretch">
            <Grid item xs={5}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {formatMessage('invoices.date')}
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {formatMessage('invoices.amount')}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {formatMessage('invoices.invoice')}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mt: 2 }} />

          {invoices.map((invoice, invoiceIndex) => (
            <React.Fragment key={invoice.id}>
              {invoiceIndex !== 0 && <Divider sx={{ mt: 2 }} />}

              <Grid
                container
                item
                xs={12}
                spacing={1}
                alignItems="stretch"
                sx={{ mt: 1 }}
              >
                <Grid item xs={5}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="500"
                    sx={{ color: 'text.secondary' }}
                  >
                    {DateTime.fromISO(invoice.payout_date).toFormat('LLL dd, yyyy')}
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography variant="subtitle2">€{invoice.amount}</Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography variant="subtitle2">
                    <Link target="_blank" href={invoice.receipt_url}>
                      {formatMessage('invoices.link')}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
