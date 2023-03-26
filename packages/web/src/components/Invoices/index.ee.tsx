import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { TBillingCardAction } from '@automatisch/types';
import * as URLS from 'config/urls';
import useBillingAndUsageData from 'hooks/useBillingAndUsageData.ee';
import useFormatMessage from 'hooks/useFormatMessage';

const capitalize = (str: string) =>
  str[0].toUpperCase() + str.slice(1, str.length);

type BillingCardProps = {
  name: string;
  title?: string;
  action?: TBillingCardAction;
};

function BillingCard(props: BillingCardProps) {
  const { name, title = '', action } = props;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" sx={{ pb: 0.5 }}>
          {name}
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </CardContent>

      <CardActions>
        <Action action={action} />
      </CardActions>
    </Card>
  );
}

function Action(props: { action?: TBillingCardAction }) {
  const { action } = props;
  if (!action) return <React.Fragment />;

  const { text, type } = action;

  if (type === 'link') {
    if (action.src.startsWith('http')) {
      return (
        <Button size="small" href={action.src} target="_blank">
          {text}
        </Button>
      );
    } else {
      return (
        <Button size="small" component={Link} to={action.src}>
          {text}
        </Button>
      );
    }
  }

  if (type === 'text') {
    return (
      <Typography variant="subtitle2" pb={1}>
        {text}
      </Typography>
    );
  }

  return <React.Fragment />;
}

export default function Invoices() {
  const formatMessage = useFormatMessage();
  const billingAndUsageData = useBillingAndUsageData();

  return (
    <React.Fragment>
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Invoices
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container item xs={12} spacing={1} alignItems="stretch">
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Date
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Amount
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Invoice
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />

          <Grid
            container
            item
            xs={12}
            spacing={1}
            alignItems="stretch"
            sx={{ mt: 1 }}
          >
            <Grid item xs={12} md={5}>
              <Typography
                variant="subtitle2"
                fontWeight="500"
                sx={{ color: 'text.secondary' }}
              >
                Mar 16, 2023
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2">€20.00</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2">
                <Link target="_blank" to="https://sample.com">
                  Link
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />

          <Grid
            container
            item
            xs={12}
            spacing={1}
            alignItems="stretch"
            sx={{ mt: 1 }}
          >
            <Grid item xs={12} md={5}>
              <Typography
                variant="subtitle2"
                fontWeight="500"
                sx={{ color: 'text.secondary' }}
              >
                Mar 16, 2023
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2">€20.00</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2">
                <Link to="https://sample.com">Link</Link>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
