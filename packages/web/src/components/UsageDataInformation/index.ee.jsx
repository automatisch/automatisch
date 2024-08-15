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
import PropTypes from 'prop-types';

import TrialOverAlert from 'components/TrialOverAlert/index.ee';
import SubscriptionCancelledAlert from 'components/SubscriptionCancelledAlert/index.ee';
import CheckoutCompletedAlert from 'components/CheckoutCompletedAlert/index.ee';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import usePlanAndUsage from 'hooks/usePlanAndUsage';
import useSubscription from 'hooks/useSubscription.ee';
import useUserTrial from 'hooks/useUserTrial.ee';
import { useQueryClient } from '@tanstack/react-query';
import useCurrentUser from 'hooks/useCurrentUser';

const capitalize = (str) => str[0].toUpperCase() + str.slice(1, str.length);

function BillingCard(props) {
  const { name, title = '', action, text } = props;

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
        <Action action={action} text={text} />
      </CardActions>
    </Card>
  );
}

BillingCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  action: PropTypes.string,
  text: PropTypes.string,
};

function Action(props) {
  const { action, text } = props;

  if (!action) return <React.Fragment />;

  if (action.startsWith('http')) {
    return (
      <Button size="small" href={action} target="_blank">
        {text}
      </Button>
    );
  } else if (action.startsWith('/')) {
    return (
      <Button size="small" component={Link} to={action}>
        {text}
      </Button>
    );
  }

  return (
    <Typography variant="subtitle2" pb={1}>
      {text}
    </Typography>
  );
}

Action.propTypes = {
  action: PropTypes.string,
  text: PropTypes.string,
};

export default function UsageDataInformation() {
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.data?.id;
  const { data } = usePlanAndUsage(currentUserId);
  const planAndUsage = data?.data;
  const trial = useUserTrial();
  const subscriptionData = useSubscription();
  const subscription = subscriptionData?.data;
  let billingInfo;

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['users', currentUserId, 'planAndUsage'],
    });
  }, [subscription, queryClient, currentUserId]);

  if (trial.hasTrial) {
    billingInfo = {
      monthlyQuota: {
        title: formatMessage('usageDataInformation.freeTrial'),
        action: URLS.SETTINGS_PLAN_UPGRADE,
        text: 'Upgrade plan',
      },
      nextBillAmount: {
        title: '---',
        action: null,
        text: null,
      },
      nextBillDate: {
        title: '---',
        action: null,
        text: null,
      },
    };
  } else {
    billingInfo = {
      monthlyQuota: {
        title: planAndUsage?.plan?.limit,
        action: subscription?.cancelUrl,
        text: formatMessage('usageDataInformation.cancelPlan'),
      },
      nextBillAmount: {
        title: `€${subscription?.nextBillAmount}`,
        action: subscription?.updateUrl,
        text: formatMessage('usageDataInformation.updatePaymentMethod'),
      },
      nextBillDate: {
        title: subscription?.nextBillDate,
        action: formatMessage('usageDataInformation.monthlyPayment'),
        text: formatMessage('usageDataInformation.monthlyPayment'),
      },
    };
  }

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

            {subscription?.status && (
              <Chip label={capitalize(subscription?.status)} color="success" />
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
                title={billingInfo.monthlyQuota.title}
                action={billingInfo.monthlyQuota.action}
                text={billingInfo.monthlyQuota.text}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <BillingCard
                name={formatMessage('usageDataInformation.nextBillAmount')}
                title={billingInfo.nextBillAmount.title}
                action={billingInfo.nextBillAmount.action}
                text={billingInfo.nextBillAmount.text}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <BillingCard
                name={formatMessage('usageDataInformation.nextBillDate')}
                title={billingInfo.nextBillDate.title}
                action={billingInfo.nextBillDate.action}
                text={billingInfo.nextBillDate.text}
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
                {planAndUsage?.usage.task}
              </Typography>
            </Box>

            <Divider sx={{ mt: 2 }} />
          </Box>

          {/* free plan has `null` status so that we can show the upgrade button */}
          {subscription?.status === undefined && (
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
