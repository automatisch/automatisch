import * as React from 'react';
import { Link } from 'react-router-dom';

import { Chip } from './style.ee';
import * as URLS from 'config/urls';
import useUserTrial from 'hooks/useUserTrial.ee';

export default function TrialStatusBadge() {
  const data = useUserTrial();

  if (!data.hasTrial) return <React.Fragment />;

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
