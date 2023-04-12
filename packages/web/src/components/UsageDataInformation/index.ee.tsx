import * as React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
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
import TrialOverAlert from 'components/TrialOverAlert/index.ee';
import SubscriptionCancelledAlert from 'components/SubscriptionCancelledAlert/index.ee';
import CheckoutCompletedAlert from 'components/CheckoutCompletedAlert/index.ee';
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

export default function UsageDataInformation() {
  const formatMessage = useFormatMessage();
  const billingAndUsageData = useBillingAndUsageData();

  return (
    <React.Fragment>
      <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
        <SubscriptionCancelledAlert />

        <TrialOverAlert />

        <CheckoutCompletedAlert />
      </Stack>
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              {formatMessage('usageDataInformation.subscriptionPlan')}
            </Typography>

            {billingAndUsageData?.subscription?.status && (
              <Chip
                label={capitalize(billingAndUsageData?.subscription?.status)}
                color="success"
              />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid
            container
            item
            xs={12}
            spacing={1}
            sx={{ mb: [2, 2, 8] }}
            alignItems="stretch"
          >
            <Grid item xs={12} md={4}>
              <BillingCard
                name={formatMessage('usageDataInformation.monthlyQuota')}
                title={billingAndUsageData?.subscription?.monthlyQuota.title}
                action={billingAndUsageData?.subscription?.monthlyQuota.action}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <BillingCard
                name={formatMessage('usageDataInformation.nextBillAmount')}
                title={billingAndUsageData?.subscription?.nextBillAmount.title}
                action={
                  billingAndUsageData?.subscription?.nextBillAmount.action
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <BillingCard
                name={formatMessage('usageDataInformation.nextBillDate')}
                title={billingAndUsageData?.subscription?.nextBillDate.title}
                action={billingAndUsageData?.subscription?.nextBillDate.action}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h6" fontWeight="bold">
              {formatMessage('usageDataInformation.yourUsage')}
            </Typography>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 1 }}
              >
                {formatMessage('usageDataInformation.yourUsageDescription')}
              </Typography>
            </Box>

            <Divider sx={{ mt: 2 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
              >
                {formatMessage('usageDataInformation.yourUsageTasks')}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
              >
                {billingAndUsageData?.usage.task}
              </Typography>
            </Box>

            <Divider sx={{ mt: 2 }} />
          </Box>

          {/* free plan has `null` status so that we can show the upgrade button */}
          {billingAndUsageData?.subscription?.status === null && (
            <Button
              component={Link}
              to={URLS.SETTINGS_PLAN_UPGRADE}
              size="small"
              variant="contained"
              sx={{ mt: 2, alignSelf: 'flex-end' }}
            >
              {formatMessage('usageDataInformation.upgrade')}
            </Button>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
