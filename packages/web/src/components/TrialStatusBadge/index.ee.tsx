import * as React from 'react';
import { Link } from 'react-router-dom';
import { Chip } from './style.ee';

import * as URLS from 'config/urls';
import useTrialStatus from 'hooks/useTrialStatus.ee';

export default function TrialStatusBadge(): React.ReactElement {
  const data = useTrialStatus();

  if (!data) return <React.Fragment />;

  const { message, status } = data;

  return (
    <Chip
      component={Link}
      to={URLS.SETTINGS_BILLING_AND_USAGE}
      clickable
      label={message}
      color={status}
    />
  );
}
